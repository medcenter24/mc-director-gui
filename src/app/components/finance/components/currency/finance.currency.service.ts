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
import { HttpService } from '../../../core/http/http.service';
import { LoadableServiceInterface } from '../../../core/loadable';
import { FinanceCurrency } from './finance.currency';
import { Observable } from 'rxjs';
import {ObservableTransformer} from '../../../../helpers/observable.transformer';

@Injectable()
export class FinanceCurrencyService extends HttpService implements LoadableServiceInterface {
  protected getPrefix (): string {
    return 'director/currency';
  }

  create(currency: FinanceCurrency): Observable<FinanceCurrency> {
    const obs = this.store(currency);
    return new ObservableTransformer()
      .transform(obs, response => response.data as FinanceCurrency);
  }

  save (currency: FinanceCurrency): Observable<FinanceCurrency> {
    const obs = currency.id ? this.put(currency.id, currency) : this.store(currency);
    return new ObservableTransformer()
      .transform(obs, response => response.data as FinanceCurrency);
  }

  destroy (currency: FinanceCurrency): Observable<any> {
    return this.remove(currency.id);
  }
}
