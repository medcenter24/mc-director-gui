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
import { NgaModule } from '../../theme/nga.module';
import { routing } from './profile.page.routing';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AppTranslationModule } from '../../app.translation.module';
import { ProfilePageComponent } from './profile.page.component';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../components/users/users.service';
import { LoggedUserService } from '../../components/auth/loggedUser.service';
import { MediaService } from '../../components/media/media.service';
import { CompanyService } from '../../components/company/company.service';
import { TimezoneService } from '../../components/timezone/timezone.service';
import { TimezoneSelectComponent } from '../../components/timezone/components/select/select.component';
import { UploadPictureModule } from '../../components/upload/components/picture';
import { CompanyEditorModule } from '../../components/company/components/editor';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgaModule,
    routing,
    MessagesModule,
    AppTranslationModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
    UploadPictureModule,
    CompanyEditorModule,
  ],
  declarations: [
    ProfilePageComponent,
    TimezoneSelectComponent,
  ],
  providers: [
    UsersService,
    LoggedUserService,
    MediaService,
    CompanyService,
    TimezoneService,
  ],
})
export class ProfilePageModule {
}
