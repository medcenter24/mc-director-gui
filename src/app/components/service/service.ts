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

import { Disease } from '../disease';

export class Service {
  constructor (public id: number = 0,
               public title: string = '',
               public description: string = '',
               public type: string = '',
               public status: string = 'active',
               public diseases: Disease[] = [],
               public sort: number = 0,
  ) {
  }

  static fromData(data: Array<any>) {
    return new Service(
      data['id'],
      data['title'],
      data['description'],
      data['type'],
      data['status'],
      this.getDiseasesFromData(data['diseases']),
    );
  }

  private static getDiseasesFromData(diseases: Array<any>) {
    const res = [];
    diseases.forEach(disease => {
      res.push(Disease.fromData(disease));
    });
    return res;
  }
}
