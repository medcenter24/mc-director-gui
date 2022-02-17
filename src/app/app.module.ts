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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { environment } from '../environments/environment';
import { routing } from './app.routing';
import { ApiErrorService } from './components/ui/apiError.service';
import { AppTranslationModule } from './app.translation.module';
import { LocalStorageHelper } from './helpers/local.storage.helper';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './components/auth/auth.guard';
import { LoggerModule } from './components/core/logger';
import { LoggerComponent } from './components/core/logger/LoggerComponent';
import { UiToastModule } from './components/ui/toast';
import { UiToastService } from './components/ui/toast/ui.toast.service';
import { TokenService } from './components/auth/token.service';
import { BaImageLoaderService } from './theme/services';
import { BaThemePreloader } from './theme/services';
import { BaThemeSpinner } from './theme/services';
import { BaMenuService } from './theme';
import { AuthenticationService } from './components/auth/authentication.service';
import { BaThemeConfig, BaThemeConfigProvider } from './theme';
import { EmailValidator, EqualPasswordsValidator } from './theme/validators';
import { ProgressBarModule } from 'primeng/progressbar';
import {UiBlockerContainerModule} from "./components/ui/blocker/components/container";

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState,
  ConfirmationService,
  ApiErrorService,
  LocalStorageHelper,
  AuthGuard,
  LoggerComponent,
  UiToastService,
  TokenService,
  BaImageLoaderService,
  BaThemePreloader,
  BaThemeSpinner,
  BaMenuService,
  AuthenticationService,
  BaThemeConfigProvider,
  BaThemeConfig,
  EmailValidator,
  EqualPasswordsValidator,
];

export function tokenGetter() {
  const storage = new LocalStorageHelper();
  return storage.getItem('token');
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
    imports: [ // import Angular 's modules
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgaModule,
        PagesModule,
        routing,
        ConfirmDialogModule,
        BlockUIModule,
        AppTranslationModule,
        JwtModule.forRoot({
            config: {
                tokenGetter,
                // whitelistedDomains: ['localhost:3001']
                // blacklistedRoutes: ['localhost:3001/auth/']
            },
        }),
        LoggerModule,
        UiToastModule,
        NgaModule,
        ProgressBarModule,
        ProgressBarModule,
        UiBlockerContainerModule,
    ],
  exports: [],
  providers: [ // expose our Services and Providers into Angular 's dependency injection
    APP_PROVIDERS,
  ],
})

export class AppModule {
  constructor(
    public appState: AppState,
    private _logger: LoggerComponent,
    private _tokenService: TokenService,
  ) {
    this.appState.set('appStatus', 'initialized');
    this._logger.setLevel(environment.logger.level);
    this._tokenService.refresh();
  }
}
