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
import { FinanceCurrency } from '../../../currency/finance.currency';
import { FinancePayment } from '../../finance.payment';

export class PaymentViewer {
  constructor(
    public type: string = '', // identifier of the payment viewer type
    public loading: boolean = false, // process
    public payment: FinancePayment = null,
    // this is not a payment, this is result of calculation from the backend
    public calculatedValue: number = 0, // price amount
    public currency: FinanceCurrency = null,
    public formula: string = '', // calculation formula
  ) { }

  getPaymentId(): number {
    return this.payment ? this.payment.id : 0;
  }

  getPrice(): number {
    return this.formula === 'fixed' && this.payment.fixed ? this.payment.value : this.calculatedValue;
  }

  static fromData(data: object) {
    if (data['payment'] !== null) {
      const payment =  data['payment'];
      data['payment'] = new FinancePayment(
        payment['id'],
        payment['createdBy'],
        payment['value'],
        payment['currencyId'],
        payment['fixed'],
        payment['description'],
      );
    }

    if (data['currency'] !== null) {
      const currency = data['currency'];
      data['currency'] = new FinanceCurrency(
        currency['id'],
        currency['title'],
        currency['code'],
        currency['ico'],
      );
    }

    return new PaymentViewer(
      data['type'],
      data['loading'],
      data['payment'],
      data['calculatedValue'],
      data['currency'],
      data['formula'],
    );
  }
}
