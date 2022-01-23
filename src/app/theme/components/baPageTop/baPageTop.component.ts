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

import { ChangeDetectorRef, Component } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { AuthenticationService } from '../../../components/auth/authentication.service';
import { LocalStorageHelper } from '../../../helpers/local.storage.helper';
import { layoutPaths } from '../../index';

@Component({
  selector: 'nga-ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss'],
})
export class BaPageTopComponent {

  isScrolled: boolean = false;
  isMenuCollapsed: boolean = false;
  avatar: string = '';
  showProfileMenu: boolean = false;
  searchText: string = '';

  constructor(
    private _state: GlobalState,
    private authenticationService: AuthenticationService,
    private storage: LocalStorageHelper,
    private cdRef: ChangeDetectorRef,
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this._state.subscribe('avatarB64', (b64: string) => {
        this.avatar = b64.length ? b64 : `${layoutPaths.images.profile}no-photo.png`;
    });
    this.avatar = this.storage.getItem('avatar');

    this.avatar = typeof this.avatar !== 'undefined' && this.avatar !== 'undefined' && this.avatar.length ?
        this.avatar : `${layoutPaths.images.profile}no-photo.png`;
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
    this.cdRef.detectChanges();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  startSearch() {
    this._state.notifyDataChanged('seeker', this.searchText);
  }
}
