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
import { CasesPageComponent } from './cases.page.component';
import { ModuleWithProviders } from '@angular/core';
import { CaseEditorComponent } from '../../components/case/components/editor/case.editor.component';
import { CaseDatatableComponent } from '../../components/case/components/datatable/case.datatable.component';
import {CaseArchiveComponent} from "../../components/case/components/archive/case.archive.component";

export const routes: Routes = [
  {
    path: '',
    component: CasesPageComponent,
    children: [
      { path: '', component: CaseDatatableComponent },
      { path: 'new', component: CaseEditorComponent },
      { path: 'archive/:id', component: CaseArchiveComponent },
      { path: ':id', component: CaseEditorComponent },
    ],
  },
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
