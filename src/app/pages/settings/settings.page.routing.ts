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
import { ModuleWithProviders } from '@angular/core';
import { SettingsPageComponent } from './settings.page.component';
import { PeriodDatatableComponent } from '../../components/period/components/datatable/period.datatable.component';
import { AccidentCheckpointDatatableComponent }
  from '../../components/accident/components/checkpoint/components/datatable/accident.checkpoint.datatable.component';
import { FormDatatableComponent } from '../../components/forms/components/datatable';
import { FormEditorPageComponent } from './form/editor';
import { DiseaseDatatableComponent } from '../../components/disease/components/datatable';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: SettingsPageComponent,
    children: [
      { path: 'checkpoints', component: AccidentCheckpointDatatableComponent },
      { path: 'periods', component: PeriodDatatableComponent },
      { path: 'forms', component: FormDatatableComponent },
      { path: 'forms/new', component: FormEditorPageComponent },
      { path: 'forms/:id', component: FormEditorPageComponent },
      { path: 'diseases', component: DiseaseDatatableComponent },
    ],
  },
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
