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
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './geo.page.routing';
import { GeoPageComponent } from './geo.page.component';
import { AppTranslationModule } from '../../app.translation.module';
import { HospitalDatatableModule } from '../../components/hospital/components/datatable';
import { GeoCityPageModule } from './city';
import { GeoCountryPageModule } from './country';
import { GeoRegionPageModule } from './region';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    HospitalDatatableModule,
    GeoCityPageModule,
    GeoCountryPageModule,
    GeoRegionPageModule,
  ],
  declarations: [
    GeoPageComponent,
  ],
})

export class GeoPageModule {}
