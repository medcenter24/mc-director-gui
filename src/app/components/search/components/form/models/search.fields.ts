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
 * Copyright (c) 2022 (original work) MedCenter24.com;
 */

import {Injectable} from '@angular/core';
import {SearchField} from '../contracts/searhc.field';

@Injectable()
export class SearchFields {
  private fields: SearchField[] = [
    {id: 'npp', title: 'Npp', order: '', sort: 1},
    {id: 'patient', title: 'Patient', order: '', sort: 2},
    {id: 'assist-ref-num', title: 'Assistant Ref. Number', order: '', sort: 3},
    {id: 'city', title: 'City', order: '', sort: 4},
    {id: 'doctor-income', title: 'Doctor\'s fees', order: '', sort: 5},
    {id: 'accident-link', title: 'Accident ID', order: '', sort: 6},
    {id: 'visit-date', title: 'Visit Date', order: '', sort: 7},
    {id: 'ref-num', title: 'Ref. Number', order: '', sort: 8},
    {id: 'income', title: 'Income', order: '', sort: 9},
    {id: 'diagnosis', title: 'Diagnosis', order: '', sort: 10},
  ];

  private agrFields: SearchField[] = [
    {id: 'agr-totals', title: 'Count Totals', order: '', sort: 0},
  ];

  public getFields(): SearchField[] {
    return this.fields;
  }

  public getField(key: string): SearchField {
    return this.fields.find(row => row.id === key);
  }

  public getTitle(key: string): string {
    const field = this.getField(key);
    return field && field.hasOwnProperty('title') ? field['title'] : '';
  }
}
