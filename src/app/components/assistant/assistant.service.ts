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
import { Assistant } from './assistant';
import { HttpService } from '../core/http/http.service';
import { AccidentCheckpoint } from '../accident/components/checkpoint/checkpoint';
import { Observable } from 'rxjs';

@Injectable()
export class AssistantsService extends HttpService {

  protected getPrefix(): string {
    return 'director/assistants';
  }

  destroy(assistant: Assistant): Observable<void> {
    return this.remove(assistant.id);
  }

  save (assistant: Assistant): Observable<any> {
    const action = assistant.id ? this.put(assistant.id, assistant) : this.store(assistant);
    action.subscribe(response => response.data as AccidentCheckpoint);
    return action;
  }
}
