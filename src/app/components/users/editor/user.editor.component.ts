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

import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from '../user';
import { UsersService } from '../users.service';
import { LoadableComponent } from '../../core/components/componentLoader';
import { AutocompleterComponent } from '../../ui/selector/components/autocompleter';

@Component({
  selector: 'nga-user-editor',
  templateUrl: './user.editor.html',
})
export class UserEditorComponent extends LoadableComponent implements OnInit {

  protected componentName: string = 'UserEditorComponent';

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  user: User;

  @Output() saved: EventEmitter<User> = new EventEmitter<User>();

  @ViewChild('userSelector')
  private userSelectComponent: AutocompleterComponent;

  constructor(
    public service: UsersService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setEmptyUser();
  }

  onSubmit(): void {
    const postfix = 'Submit';
    this.startLoader(postfix);
    const obs = this.user.id ? this.service.update(this.user) : this.service.create(this.user);
    obs.subscribe({
      next: user => {
        this.stopLoader(postfix);
        this.setUser(user);
        this.saved.emit(user);
      },
      error: () => this.stopLoader(postfix),
    });
  }

  onUserChanged(user: User): void {
    this.setUser(user);
  }

  onUserCreated(): void {
    this.setEmptyUser();
  }

  private setUser(user: User): void {
    this.user = user;
    this.userSelectComponent.selectItems(+this.user.id, 'users.id');
  }

  private setEmptyUser(): void {
    this.user = new User();
    if (this.userSelectComponent) {
      this.userSelectComponent.selectItems( +this.user.id, 'users.id' );
    }
  }

  loadUser(id: number): void {
    if (+id) {
      const postfix = 'User';
      this.startLoader(postfix);
      this.service.getUser(id).subscribe({next: (user: User) => {
        this.stopLoader(postfix);
        this.setUser(user);
      }, error: () => this.stopLoader(postfix)});
    } else {
      this.setEmptyUser();
    }
  }
}
