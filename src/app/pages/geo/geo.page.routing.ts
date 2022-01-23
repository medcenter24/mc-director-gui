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

import { GeoPageComponent } from './geo.page.component';
import { HospitalDatatableComponent }
  from '../../components/hospital/components/datatable/hospital.datatable.component';
import { GeoCityPageComponent } from './city';
import { GeoCountryPageComponent } from './country';
import { GeoRegionPageComponent } from './region';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: GeoPageComponent,
    children: [
      { path: 'cities', component: GeoCityPageComponent },
      { path: 'hospitals', component: HospitalDatatableComponent },
      { path: 'countries', component: GeoCountryPageComponent },
      { path: 'regions', component: GeoRegionPageComponent },
    ],
  },
];

export const routing = RouterModule.forChild(routes);
