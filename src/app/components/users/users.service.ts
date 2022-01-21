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
import { User } from './user';
import { HttpService } from '../core/http/http.service';
import {Observable} from 'rxjs';
import {ObservableTransformer} from '../../helpers/observable.transformer';

@Injectable()
export class UsersService extends HttpService {

  protected getPrefix (): string {
    return 'director/users';
  }

  getUsers(): Observable<User[]> {
    const obs = this.get();
    return new ObservableTransformer().transform(obs, r => r.data as User[]);
  }

  getUser(id: number): Observable<User> {
    const obs = this.get(id);
    return new ObservableTransformer().transform(obs, r => r.data as User);
  }

  delete(id: number): Observable<void> {
    return this.remove(id);
  }

  create(user: User): Observable<User> {
    const obs = this.store(user);
    return new ObservableTransformer().transform(obs, r => r.data as User);
  }

  update(user: User): Observable<User> {
    const obs = this.put(user.id, user);
    return new ObservableTransformer().transform(obs, r => r.data as User);
  }

  deletePhoto(userId: number): Observable<void> {
      return this.remove(`${userId}/photo`);
  }
}
