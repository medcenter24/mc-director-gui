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
import { saveAs } from 'file-saver';
import { Document } from './document';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentsService extends HttpService {

  protected getPrefix(): string {
    return 'director/documents';
  }

  deleteDocument(id: number): Observable<void> {
    return this.remove(id);
  }

  download(file): void {
    this.http
      .get(this.getUrl(file.id), { headers: this.getAuthHeaders(), responseType: 'blob' })
      .subscribe(data => saveAs(data, file.name), err => this.handleError(err));
  }

  update(document: Document): Observable<Document> {
    const obs = this.put( document.id, document );
    obs.subscribe( response => response as Document );
    return obs;
  }
}
