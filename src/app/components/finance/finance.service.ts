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

import { Injectable } from '@angular/core';
import { HttpService } from '../core/http/http.service';
import { FinanceRule } from './finance.rule';

@Injectable()
export class FinanceService extends HttpService {
  protected getPrefix (): string {
    return 'director/finance';
  }

  getFinanceRule(id: number): Promise<FinanceRule> {
    return this.get(id).then(response => response.data as FinanceRule);
  }

  create(financeRule: FinanceRule): Promise<FinanceRule> {
    return this.store(financeRule);
  }

  save (finance: FinanceRule): Promise<FinanceRule> {
    return finance.id ? this.put(finance.id, finance).then(response => response.data as FinanceRule)
      : this.store(finance).then(response => response as FinanceRule);
  }

  destroy (financeRule: FinanceRule): Promise<any> {
    return this.remove(financeRule.id);
  }
}
