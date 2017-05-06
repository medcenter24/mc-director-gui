/*
 * Copyright (c) 2017.
 *
 * @author Alexander Zagovorichev <zagovorichev@gmail.com>
 */

import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Accident } from '../../../accident/accident';
import { AccidentsService } from '../../../accident/accidents.service';
import { Message } from 'primeng/primeng';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { TranslateService } from '@ngx-translate/core';
import { AccidentType } from '../../../accident/components/type/type';
import { AccidentDiscount } from '../../../accident/components/discount/discount';
import { Patient } from '../../../patient/patient';

@Component({
  selector: 'case-editor',
  templateUrl: './editor.html'
})
export class CaseEditorComponent {

  @Output() loaded: EventEmitter<null> = new EventEmitter<null>();

  msgs: Message[] = [];

  accident: Accident;
  patient: Patient;
  appliedTime: Date;
  maxDate: Date;
  discountValue: number = 0;
  discountType: AccidentDiscount;

  totalAmount: number = 0;
  totalIncome: number = 0;

  totalIncomeFormula: string = '';

  constructor (private route: ActivatedRoute, private accidentsService: AccidentsService,
               private loadingBar: SlimLoadingBarService, private translate: TranslateService) {
  }

  ngOnInit () {
    this.translate.get('general.without_discount').subscribe(res => {
      this.totalIncomeFormula = res;
    });
    this.maxDate = new Date();
    this.appliedTime = new Date();

    if (this.route.params['id'] && this.route.params['id'] !== 'new' ) {
      this.route.params
        // (+) converts string 'id' to a number
        .switchMap((params: Params) => this.accidentsService.getAccident(+params[ 'id' ]))
        .subscribe((accident: Accident) => {
          this.accident = accident ? accident : new Accident();
          this.appliedTime = new Date(this.accident.created_at);
        });
    } else {
      this.accident = new Accident;
    }
  }

  onSave(): void {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: this.translate.instant('general.not_saved') + '!', detail: 'Save method still has not been implemented!'});
    this.loadingBar.start();
    setTimeout(() => this.loadingBar.complete(), 3000)
  }

  onAccidentTypeSelected(accidentType: AccidentType): void {
    this.accident.accident_type_id = accidentType.id;
  }

  onServicesSelectorPriceChanged(servicesPrice): void {
    this.totalAmount = servicesPrice;
    this.recalculatePrice();
  }

  onDiscountTypeSelected(discountType: AccidentDiscount): void {
    this.discountType = discountType;
    this.recalculatePrice();
  }

  onDiscountValueChanged(): void {
    this.recalculatePrice();
  }

  private recalculatePrice(): void {
    this.totalIncome = 0;
    if (this.totalAmount && this.discountType && this.discountValue) {
      if (this.discountType.title === '%') {
        // *
        this.totalIncome = this.totalAmount - this.discountValue * this.totalAmount / 100;
        this.totalIncomeFormula = this.totalAmount + ' - ' + this.discountValue + ' * ' + this.totalAmount + ' / 100';
      } else if (this.discountType.title === 'EUR') {
        // -
        this.totalIncome = this.totalAmount - this.discountValue;
        this.totalIncomeFormula = this.totalAmount + ' - ' + this.discountValue;
      } else {
        this.totalIncome = this.totalAmount;
        this.totalIncomeFormula = this.translate.instant('general.without_discount');
      }
    } else {
      this.totalIncome = this.totalAmount;
      this.totalIncomeFormula = this.translate.instant('general.without_discount');
    }
  }
}
