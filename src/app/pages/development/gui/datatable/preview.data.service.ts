/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2020 (original work) MedCenter24.com;
 */

import { Injectable } from '@angular/core';
import { LoadableServiceInterface } from '../../../../components/core/loadable';
import { SearchFilter } from '../../../../components/core/loadable/search.filter';
import { PreviewDataModel } from './preview.data.model';
import { DatatableResponse } from '../../../../components/ui/datatable';
import { Observable } from 'rxjs';

@Injectable()
export class PreviewDataService implements LoadableServiceInterface {

  data: PreviewDataModel[] = [];

  destroy ( model: Object ): Observable<any> {
    return undefined;
  }

  save ( model: Object ): Observable<any> {
    return undefined;
  }

  search ( filters: SearchFilter ): Observable<any> {
    this.data = [];
    this.data.push(new PreviewDataModel('title 1', 1, 'fa-one'));
    this.data.push(new PreviewDataModel('title 2', 2, 'fa-two'));
    this.data.push(new PreviewDataModel('title 3', 3, 'fa-three'));
    return new Observable<any>(subscriber => {
      const response = new DatatableResponse(this.data, { pagination: { total: 30 } });
      subscriber.next(response);
    });
  }

}
