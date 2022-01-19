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
import {
  TranslateModule, TranslateLoader,
  TranslateService, MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GlobalState } from './global.state';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoggerComponent } from './components/core/logger/LoggerComponent';

export function createTranslateLoader (http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule()
export class MyDocMissingTranslationHandler implements MissingTranslationHandler {
  constructor (private _logger: LoggerComponent) {
  }

  handle (params: MissingTranslationHandlerParams) {
    const error = `Hasn\'t had translation: "${params.key}"`;
    this._logger.warn(error);
    return error;
  }
}

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateLoader),
    deps: [HttpClient],
  },
  defaultLanguage: 'en',
};

@NgModule({
  imports: [
    TranslateModule.forRoot(translationOptions),
    HttpClientModule,
  ],
  exports: [TranslateModule],
  providers: [
    TranslateService,
    { provide: MissingTranslationHandler, useClass: MyDocMissingTranslationHandler },
  ],
})
export class AppTranslationModule {

  constructor (
    private translate: TranslateService,
    private _state: GlobalState,
  ) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');
    let lang = localStorage.getItem('lang');
    if (lang !== 'ru') {
      lang = 'en';
    }
    translate.use(lang);

    this._state.subscribe('lang', (_lang: string) => {
      localStorage.setItem('lang', _lang);
      this.translate.use(_lang);
    });
  }
}
