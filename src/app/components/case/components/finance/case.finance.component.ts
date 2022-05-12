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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { Accident } from '../../../accident/accident';
import { TranslateService } from '@ngx-translate/core';
import { PaymentViewer } from '../../../finance/components/payment/components/block/payment.viewer';
import { CasesService } from '../../cases.service';

@Component({
  selector: 'nga-case-finance',
  templateUrl: './case.finance.html',
  styleUrls: ['./case.finance.scss'],
})
export class CaseFinanceComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'CaseFinanceComponent';

  @Input() accident: Accident;
  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();
  @Output() changed: EventEmitter<PaymentViewer[]> = new EventEmitter<PaymentViewer[]>();
  @Output() state: EventEmitter<PaymentViewer[]> = new EventEmitter<PaymentViewer[]>();

  types: string[] = ['income', 'assistant', 'caseable', 'cash'];
  paymentViewers: PaymentViewer[] = [];

  constructor(
    private translate: TranslateService,
    private caseService: CasesService,
  ) {
    super();
  }

  ngOnInit() {
    this.translate.get('Yes').subscribe(() => {
      this.types.forEach(type => {
        this.paymentViewers.push(new PaymentViewer(type, true));
      });
      this.reload(this.types);
    });
  }

  /**
   * Getting new Finances from the server
   * @param types [income, assistant, caseable]
   */
  private reload(types: string[] = []): void {
    this.caseService.getFinance(this.accident, types)
      .subscribe((paymentViewers: PaymentViewer[]) => {
        this.updatePaymentViewers(paymentViewers);
      });
  }

  private save(type: string, data: Object): void {
    this.caseService.saveFinance(this.accident, type, data)
      .subscribe((paymentViewers: PaymentViewer[]) => {
        this.updatePaymentViewers(paymentViewers);
        this.changed.emit(this.paymentViewers);
      });
  }

  private updatePaymentViewers(paymentViewers: PaymentViewer[]): void {
    paymentViewers.forEach((pView: PaymentViewer) => {
      const viewerKey = this.paymentViewers
        .findIndex((view: PaymentViewer) => view.type === pView.type);
      this.paymentViewers[viewerKey] = pView;
    });
    this.state.emit(this.paymentViewers);
  }

  getTitle(type: string): string {
    switch (type) {
      case 'income':
        return 'Income';
      case 'caseable':
        return this.accident.caseableType === 'hospital'
          ? 'To hospital'
          : 'To doctor';
      case 'assistant':
        return 'From assistant';
      case 'cash':
        return 'Cash';
      default: return `Undefined payment type ${type}`;
    }
  }

  onReload(type: string): void {
    this.reload([type]);
  }

  reloadPayments(types: string[]): void {
    this.reload(types);
  }

  onUpdate(type, data): void {
    this.save(type, data);
  }
}
