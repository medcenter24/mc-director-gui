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

import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme';
import { ConfirmationService } from 'primeng/api';
import { ApiErrorService } from './components/ui/apiError.service';
import { LocalStorageHelper } from './helpers/local.storage.helper';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UiToastComponent } from './components/ui/toast';
import { UiToastService } from './components/ui/toast/ui.toast.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'nga-app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.html',
})
export class AppComponent implements AfterViewInit {

  isMenuCollapsed: boolean = false;
  // global window block
  blocked: boolean = false;
  // global loading progress bar (slim loading bar)
  runLoadingProcess = false;

  @ViewChild('uiToastComponent')
    uiToastComponent: UiToastComponent;

  constructor(private _state: GlobalState,
              private _imageLoader: BaImageLoaderService,
              private _spinner: BaThemeSpinner,
              private viewContainerRef: ViewContainerRef,
              private themeConfig: BaThemeConfig,
              private confirmationService: ConfirmationService,
              private apiErrorService: ApiErrorService,
              private storage: LocalStorageHelper,
              public http: HttpClient,
              private router: Router,
              protected cdRef: ChangeDetectorRef,
              public uiToastService: UiToastService,
              private titleService: Title,
              private translateService: TranslateService,
  ) {
    themeConfig.config();

    this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

    /**
     * Dialogs to have opportunity to do it quickly
     * message: string;
     * key?: string;
     * icon?: string;
     * header?: string;
     * accept?: Function;
     * reject?: Function;
     * acceptLabel?: string;
     * rejectLabel?: string;
     * acceptVisible?: boolean;
     * rejectVisible?: boolean;
     * acceptEvent?: EventEmitter<any>;
     * rejectEvent?: EventEmitter<any>;
     */
    this._state.subscribe('confirmDialog', config => this.confirmationService.confirm(config));

    /**
     * GUI Blocker (everything on the page)
     */
    this._state.subscribe('blocker', (block: boolean) => {
      this.blocked = block;
      this.cdRef.detectChanges();
    });
    this._state.subscribe('runLoadingProcess', (state: boolean) => {
      this.runLoadingProcess = state;
      this.cdRef.detectChanges();
    });
    this._state.subscribe('apiError', (errors: HttpErrorResponse) => {
      this.apiErrorService.show(errors);
    });
    this._state.subscribe('avatarB64', (b64: string) => {
      this.storage.setItem('avatar', b64);
    });
    this._state.subscribe('changeUri', (uri: string) => {
      this.storage.setItem('lastActiveUri', uri);
    });
    this._state.subscribe('token', (token: string) => {
      // token has been changed
    });

    this._state.subscribe('seeker', (text: string) => {
      // click on the search button
      // or provided the text to search and pressed enter
      this.router.navigateByUrl(`pages/search?q=${text}`).then();
    });

    this._state.subscribe('changeTitle', (text: string) => {
      this.translateService.get('director_title').subscribe((sectionTitle: string) => {
        this.titleService.setTitle(`${sectionTitle} · ${text}`);
      });
    });

    // blocker should be turned off on the route change (to not block content)
    this.router.events
      .subscribe(event => {
        // https://angular.io/guide/router#router-events
        this._state.notifyDataChanged('routerMove', '');
        if (event instanceof NavigationStart) {
          this._state.notifyDataChanged('routerMove', 'NavigationStart');
          this._state.notifyDataChanged('blocker', false);
        }
        if (event instanceof NavigationEnd) {
          if (event.url !== '/login') {
            this._state.notifyDataChanged( 'changeUri', event.url );
          }
        }
        // NavigationCancel
      });
  }

  ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });

    this.uiToastService.setComponent(this.uiToastComponent);
  }

  private _loadImages(): void {
    // register some loaders
    // BaThemePreloader.registerLoader(this._imageLoader.load('/assets/img/sky-bg.jpg'));
  }

}
