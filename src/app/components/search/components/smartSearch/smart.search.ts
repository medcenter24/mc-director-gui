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

import {Searcher} from '../form/models/searcher';

export class SmartSearch {
  constructor(
    public id: number = 0,
    public title: string = '',
    public type: string = '',
    public body: string = '',
  ) {
  }

  static fromData(data: any): SmartSearch {
    return new SmartSearch(
      data['id'],
      data['title'],
      data['type'],
      data['body'],
    );
  }

  getBody(): string {
    return this.body;
  }

  static fromSearcher(searcher: Searcher) {

    const bodyObject = {
      filters: searcher.filters,
      fields: searcher.fields,
      result: searcher.result,
    };

    return SmartSearch.fromData({
      id: searcher.id,
      title: searcher.title,
      type: searcher.type,
      body: JSON.stringify(bodyObject),
    });
  }
}
