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
import { FinanceCurrencyDatatableComponent } from '../../components/finance/components/currency/components/datatable';
import { FinanceDatatableComponent } from '../../components/finance/components/datatable';
import { ConditionsEditorPageComponent } from './conditions/editor';
import { FinancePageComponent } from './finance.page.component';
import {FinanceBaseAssistantConditionsPageComponent} from "./conditions/base/assistant";

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: FinancePageComponent,
    children: [
      { path: 'conditions', component: FinanceDatatableComponent },
      { path: 'conditions/new', component: ConditionsEditorPageComponent },
      { path: 'conditions/:id', component: ConditionsEditorPageComponent },
      { path: 'currencies', component: FinanceCurrencyDatatableComponent },
      { path: 'base-assistant-conditions', component: FinanceBaseAssistantConditionsPageComponent },
      // todo make it like a cities done
      // { path: 'currencies/new', component: ConditionsEditorPageComponent },
      // { path: 'currencies/:id', component: ConditionsEditorPageComponent },
    ],
  },
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

