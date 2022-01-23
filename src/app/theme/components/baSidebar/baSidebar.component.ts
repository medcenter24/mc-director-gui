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

import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { layoutSizes } from '../../../theme';

@Component({
  selector: 'nga-ba-sidebar',
  templateUrl: './baSidebar.html',
  styleUrls: ['./baSidebar.scss'],
})
export class BaSidebarComponent implements OnInit {
  menuHeight: number;
  isMenuCollapsed: boolean = false;
  isMenuShouldCollapsed: boolean = false;

  constructor(private _elementRef: ElementRef, private _state: GlobalState) {

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  ngOnInit(): void {
    if (this._shouldMenuCollapse()) {
      this.menuCollapse();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {

    const isMenuShouldCollapsed = this._shouldMenuCollapse();

    if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
      this.menuCollapseStateChange(isMenuShouldCollapsed);
    }
    this.isMenuShouldCollapsed = isMenuShouldCollapsed;
    this.updateSidebarHeight();
  }

  menuExpand(): void {
    this.menuCollapseStateChange(false);
  }

  menuCollapse(): void {
    this.menuCollapseStateChange(true);
  }

  menuCollapseStateChange(isCollapsed: boolean): void {
    this.isMenuCollapsed = isCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
  }

  updateSidebarHeight(): void {
    this.menuHeight = this._elementRef.nativeElement.childNodes[0].clientHeight;
  }

  private _shouldMenuCollapse(): boolean {
    return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
  }
}
