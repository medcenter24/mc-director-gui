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

@Injectable()
export class SearchResult {

  private hasData: boolean = false;
  private countOnly: boolean = true;
  private header: string[] = [];
  private loaded: boolean = false;
  private rows: any[] = [];

  constructor(
    private data: any[] = [],
  ) {
    this.initHasData(data);
    this.initCountOnly(data);
    this.initHeader(data);
    this.initData(data);
    this.loaded = true;
  }

  initHasData(data) {
    this.hasData = data.length;
  }

  initCountOnly(data) {
    this.countOnly = data.length === 1 && data[0].hasOwnProperty('count');
  }

  initHeader(data) {
    if (this.isHasData() && !this.isCountOnly()) {
      this.header = [];
      const firstRow = data[0];
      for (const [key, value] of Object.entries(firstRow)) {
        this.header.push(key);
      }
    }
  }

  initData(data) {
    this.rows = [];
    data.forEach((row) => {
      const cols = [];
      this.getHeader().forEach((key) => {
        cols.push(row[key]);
      });
      this.rows.push(cols);
    });
  }

  isCountOnly() {
    return this.countOnly;
  }

  getCount(): number {
    return this.data[0].count;
  }

  isHasData() {
    return this.hasData;
  }

  getHeader() {
    return this.header;
  }

  getData() {
    return this.rows;
  }
}
