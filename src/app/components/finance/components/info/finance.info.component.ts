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

import { Component, Input } from '@angular/core';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { FinanceRule } from '../../finance.rule';
import { FinanceCurrency } from '../currency/finance.currency';

@Component({
  selector: 'nga-finance-info',
  templateUrl: './finance.info.html',
  outputs: ['init', 'loaded'],
})
export class FinanceInfoComponent extends LoadableComponent {
  protected componentName: string = 'FinanceInfoComponent';

  _financeRule: FinanceRule = new FinanceRule();

  /**
   * Cache for currencies
   */
  currencies: FinanceCurrency[] = null;

  @Input() set financeRule (financeRule: FinanceRule) {
    this._financeRule = financeRule;
  }

  hasConditions () {
    return this.hasCondition('assistants')
      || this.hasCondition('doctors')
      || this.hasCondition('datePeriods')
      || this.hasCondition('services')
      || this.hasCondition('cities');
  }

  hasCondition (conditionName): boolean {
    switch (conditionName) {
      case 'doctors':
        return !!this._financeRule.doctors.length;
      case 'assistants':
        return !!this._financeRule.assistants.length;
      case 'datePeriods':
        return !!this._financeRule.datePeriods.length;
      case 'services':
        return !!this._financeRule.services.length;
      case 'cities':
        return !!this._financeRule.cities.length;
    }
    return false;
  }

  hasCurrency () {
    return this._financeRule.value > 0
      && (this._financeRule.currencyMode === 'percent' || this._financeRule.currencyId);
  }
}
