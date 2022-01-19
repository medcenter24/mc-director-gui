/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2019 (original work) MedCenter24.com;
 */

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NumbersHelper} from '../../../../helpers/numbers.helper';
import {LoadableComponent} from '../../../core/components/componentLoader';
import {Form, FormService} from '../../../forms';
import {AutocompleterComponent} from '../../../ui/selector/components/autocompleter';
import {Upload} from '../../../upload/upload';
import {Invoice} from '../../invoice';
import {InvoiceService} from '../../invoice.service';
import {FormViewerComponent} from '../../../forms/components/viewer';
import {UiToastService} from '../../../ui/toast/ui.toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'nga-invoice-editor',
  templateUrl: './invoice.editor.html',
})
export class InvoiceEditorComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'InvoiceEditorComponent';

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('invoiceFormAutocompleter')
  invoiceFormAutocompleter: AutocompleterComponent;

  @ViewChild('formViewerComponent')
  formViewerComponent: FormViewerComponent;

  @Input() invoice: Invoice;
  @Input() label: string = 'Invoice';
  @Input() autosave: boolean = false;
  @Input() reload: boolean = false; // reload Invoice on the initialization

  @Input() dataModelId: number = 0; // entity which I can load for this invoice
                                    // (for example accident for the current invoice)

  @Output() sourceChosen: EventEmitter<Form | Upload> = new EventEmitter<Form | Upload>();
  @Output() saved: EventEmitter<Invoice> = new EventEmitter<Invoice>();

  file: Upload;
  form: Form;
  saving: boolean = false;

  constructor(
    public formService: FormService,
    public invoiceService: InvoiceService,
    private uiToastService: UiToastService,
    private translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit() {
    if (!this.invoice) {
      this.invoice = new Invoice();
    } else if (this.reload) {
      this.setInvoice(this.invoice, true);
    }
  }

  preview(): void {
    if (this.formViewerComponent) {
      this.formViewerComponent.preview(true);
    } else {
      this.translateService.get('Choose a form of the invoice')
        .subscribe((translation: string) => {
          this.uiToastService.errorMessage(translation);
        });
    }
  }

  formSelected(form: Form): void {
    this.form = form;
    this.sourceChosen.emit(this.form);
    this.doAutoSave();
  }

  onUploaded(file: Upload): void {
    this.file = file;
    this.sourceChosen.emit(file);
    this.doAutoSave();
  }

  onStatusChanged(state: string): void {
    this.invoice.status = state;
    this.doAutoSave();
  }

  priceChanged(event): void {
    this.invoice.price = NumbersHelper.getFixedFloat(event.target.value, true);
    this.doAutoSave();
  }

  private doAutoSave(): void {
    if (this.autosave) {
      this.save();
    }
  }

  /**
   * Replace invoice in the form
   * if invoice has not been loaded - invoice will be requested from the backend
   * @param invoice
   * @param update
   */
  setInvoice(invoice: Invoice, update: boolean = false): void {
    if (update && +invoice.id) {
      const postfix = 'SearchInvoice';
      this.startLoader(postfix);
      const obs = this.invoiceService.search({
        filter:
          {
            fields: [{
              elType: 'text',
              field: 'id',
              match: 'eq',
              value: invoice.id,
            }],
          },
      });
      obs.subscribe({
        next: response => {
          this.stopLoader(postfix);
          if (response.data.length) {
            this.invoice = response.data[0] as Invoice;
            if (this.isFormInvoice()) {
              const postfix1 = 'GetInvoiceForm';
              this.startLoader(postfix1);
              const obsForm = this.invoiceService.getForm(this.invoice);
              obsForm.subscribe({
                next: (form: Form) => {
                  this.stopLoader(postfix1);
                  this.invoiceFormAutocompleter.selectItems(form);
                  this.form = form;
                }, error: () => {
                  this.stopLoader(postfix1);
                },
              });
            } else if (this.isFileInvoice()) {
              const postfix2 = 'GetInvoiceFile';
              this.startLoader(postfix2);
              const obsFile = this.invoiceService.getFile(this.invoice);
              obsFile.subscribe({
                next: (file: Upload) => {
                  this.stopLoader(postfix2);
                  this.file = file;
                }, error: () => this.stopLoader(postfix2),
              });
            } else {
              throw new Error('Invoice type is not defined');
            }
          } else {
            throw new Error('Invoice not found');
          }
        },
        error: () => this.stopLoader(postfix),
      });
    } else {
      this.invoice = invoice;
    }
  }

  save(): void {
    const postfix = 'SaveInvoice';
    this.startLoader(postfix);
    this.saving = true;
    if (this.isFileInvoice()) {
      const obs = this.invoiceService.assignFile(this.invoice, this.file);
      obs.subscribe({
        next: (invoice: Invoice) => {
          this.stopLoader(postfix);
          this.invoice = invoice;
          this.saving = false;
          this.saved.emit(this.invoice);
        }, error: () => {
          this.stopLoader(postfix);
          this.saving = false;
        },
      });
    } else if (this.isFormInvoice()) {
      if (!this.form || !this.form.id) {
        return;
      }
      const obs = this.invoiceService.assignForm(this.invoice, this.form);
      obs.subscribe({
        next: (invoice: Invoice) => {
          this.saving = false;
          this.stopLoader(postfix);
          this.invoice = invoice;
          this.saved.emit(this.invoice);
        }, error: () => {
          this.saving = false;
          this.stopLoader(postfix);
        },
      });
    } else {
      this.saving = false;
      this.stopLoader(postfix);
      throw new Error(`Undefined type of the invoice: ${this.invoice.type}`);
    }
  }

  isFormInvoice(): boolean {
    return this.invoice && this.invoice.type === 'form';
  }

  isFileInvoice(): boolean {
    return this.invoice && this.invoice.type === 'file';
  }
}
