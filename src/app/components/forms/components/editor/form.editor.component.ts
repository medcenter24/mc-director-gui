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

import {
  Component, ElementRef, EventEmitter,
  OnInit, Output, ViewChild,
} from '@angular/core';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalState } from '../../../../global.state';
import { FormService } from '../../form.service';
import { Form } from '../../form';
import { TranslateService } from '@ngx-translate/core';
import { FormOption } from '../options/form.option';
import { BaToolboxAction } from '../../../../theme/components';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';
import { FormsOptionsEditorComponent } from '../options/editor';
declare var $: any;

@Component({
  selector: 'nga-form-editor',
  templateUrl: './form.editor.html',
})
export class FormEditorComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'FormEditorComponent';

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  isLoaded: boolean = false;
  form: Form;
  msgs: any;
  displayDialog: boolean = false;
  formPreviewerVisible: boolean = false;
  allTypeVariables: FormOption[] = [];
  usedTypeVariables: FormOption[] = [];

  @ViewChild('previewContainer')
    previewContainer: ElementRef;

  @ViewChild('formsOptionsEditorComponent')
    formOptionEditor: FormsOptionsEditorComponent;

  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    protected _state: GlobalState,
    private translateService: TranslateService,
    private router: Router,
  ) {
    super();
    this.translateService.get('Template').subscribe((text: string) => {
      this._state.notifyDataChanged('changeTitle', `${text} · ${this.translateService.instant('Loading')}`);
    });
  }

  ngOnInit(): void {
    this.translateService.get('Form content is here').subscribe(() => {
      this.route.params
        .subscribe((params: Params) => {
          const breadcrumbs = [];
          const title = this.translateService.instant('Forms');
          breadcrumbs.push(new Breadcrumb(title, '/pages/settings/forms', true));
          this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
          this._state.notifyDataChanged('changeTitle', title);

          const id = +params['id'];
          this.showToolbox(id);
          if (id) {
            this.startLoader();

            this.formService.getForm(id)
              .subscribe({next: (form: Form) => {
                this.stopLoader();
                this._state.notifyDataChanged('changeTitle', `${this.translateService.instant('Template')} · ${form.title}`);
                this.form = form;
                this.readyToLoad();
              }, error: () => this.stopLoader()});
          } else {
            this.form = new Form();
            this.readyToLoad();
          }
        });
    });
  }

  private showToolbox(id: Number): void {
    const actions: BaToolboxAction[] = [];
    actions.push(new BaToolboxAction(this.translateService.instant('Back'), 'fa fa-angle-left', () => {
      this.goToList().then();
    }, 'navigation'));
    actions.push(new BaToolboxAction(this.translateService.instant('Save'), 'fa fa-save', () => {
      this.saveForm();
    }));
    if (id) {
      actions.push(new BaToolboxAction(this.translateService.instant('Delete'), 'fa fa-times', () => {
        this.onDelete();
      }));
    }
    actions.push(new BaToolboxAction(this.translateService.instant('Preview'), 'fa fa-eye', () => {
      this.onPreview();
    }));
    actions.push(new BaToolboxAction(this.translateService.instant('Variables'), 'fa fa-asterisk', () => {
      this.onVariables();
    }, 'content'));
    this._state.notifyDataChanged('toolbox.actions', actions);
  }

  private goToList(): Promise<boolean> {
    return this.router.navigate(['pages/settings/forms']);
  }

  private onVariables(): void {
    this.displayDialog = true;
  }

  private onPreview(): void {
    this.formPreviewerVisible = true;
    this.previewContainer.nativeElement.innerHTML = this.form.template;
  }

  private readyToLoad(): void {
      this.isLoaded = true;
  }

  saveForm(): void {
    this.sendForm(this.form);
  }

  onDelete(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete this form?'),
        acceptVisible: true,
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.formService.destroy(this.form)
            .subscribe({next: () => {
              this.goToList().then(() => this.stopLoader(postfix));
            }, error: () => {
              this.stopLoader(postfix);
            }});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  private sendForm(form: Form): void {
    const postfix = 'SaveRule';
    this.startLoader(postfix);
    const previousId = this.form.id;
    this.formService.save(form)
      .subscribe({
        next: savedForm => {
          this.stopLoader(postfix);
          if (!previousId) {
            this.router.navigate([`pages/settings/forms/${savedForm.id}`]).then();
          }/* else {
            this.form = savedForm;
          }*/
        },
        error: () => this.stopLoader(postfix),
      });
  }

  setSelectedVar(formParam: FormOption): void {
    this.displayDialog = false;
    const $editor = $('#htmlTemplate');
    const cursorPos = $editor.prop('selectionStart');

    const textBefore = this.form.template.substring(0 , cursorPos);
    const textAfter = this.form.template.substring(cursorPos, this.form.template.length);

    this.form.template = `${textBefore}${formParam.key}${textAfter}`;

    this.checkActiveVars();
  }

  updateAllVars(vars: FormOption[]): void {
    this.allTypeVariables = vars;
    this.checkActiveVars();
  }

  onFormableTypeSelected(event): void {
    this.form.formableType = event.key;
  }

  checkActiveVars(): void {
    this.usedTypeVariables = [];
    this.allTypeVariables.forEach((formOption: FormOption) => {
      if (this.form.template.includes(formOption.key)) {
        this.usedTypeVariables.push(formOption);
      }
    });
    this.formOptionEditor.updateUsedVars(this.usedTypeVariables);
  }
}
