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

import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from '../components/auth/auth.guard';
import { PageNotFoundComponent } from './page.not.found.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.page.module').then(m => m.LoginPageModule),
  },
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      {
        path: 'search',
        loadChildren: () => import('./search/search.page.module').then(m => m.SearchPageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'settings',
        loadChildren: () => import('./settings/settings.page.module').then(m => m.SettingsPageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'finance',
        loadChildren: () => import('./finance/finance.page.module').then(m => m.FinancePageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'geo',
        loadChildren: () => import('./geo/geo.page.module').then(m => m.GeoPageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'doctors',
        loadChildren: () => import('./doctors/doctors.page.module').then(m => m.DoctorsPageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.page.module').then(m => m.DashboardPageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'cases',
        loadChildren: () => import('./cases/cases.page.module').then(m => m.CasesPageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'profile',
        loadChildren: () => import('./profile/profile.page.module').then(m => m.ProfilePageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'companions',
        loadChildren: () => import('./companions/companions.page.module').then(m => m.CompanionsPageModule),
        canActivate: [AuthGuard],
      }, {
        path: 'development',
        loadChildren: () => import('./development/development.page.module').then(m => m.DevelopmentPageModule),
        canActivate: [AuthGuard],
      }, {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.page.module').then(m => m.DashboardPageModule),
        pathMatch: 'full',
        canActivate: [AuthGuard],
      }, {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
