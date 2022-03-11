import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import {SearchPageComponent} from './search.page.component';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: SearchPageComponent,
    children: [
    ],
  },
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
