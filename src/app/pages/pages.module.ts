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
import { CommonModule } from '@angular/common';
import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';
import { PagesComponent } from './pages.component';
import { PageNotFoundComponent } from './page.not.found.component';
// import { LoginPageModule } from './login';
// import { CasesPageModule } from './cases';
// import { CompanionsPageModule } from './companions';
// import { DashboardPageModule } from './dashboard';
// import { DevelopmentPageModule } from './development';
// import { DoctorsPageModule } from './doctors';
// import { FinancePageModule } from './finance';
// import { GeoPageModule } from './geo';
// import { ProfilePageModule } from './profile';
// import { SettingsPageModule } from './settings';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    NgaModule,
    routing,
    // LoginPageModule,
    // CasesPageModule,
    // CompanionsPageModule,
    // DashboardPageModule,
    // DevelopmentPageModule,
    // DoctorsPageModule,
    // FinancePageModule,
    // GeoPageModule,
    // ProfilePageModule,
    // SettingsPageModule,
  ],
  declarations: [
    PagesComponent,
    PageNotFoundComponent,
  ],
})
export class PagesModule {
}
