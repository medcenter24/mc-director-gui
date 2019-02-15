/*
 * Copyright (c) 2017.
 *
 * @author Alexander Zagovorichev <zagovorichev@gmail.com>
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './profile.routing';
import { MessagesModule, DropdownModule, ButtonModule, InputTextModule, AutoCompleteModule } from 'primeng/primeng';
import { AppTranslationModule } from '../../app.translation.module';
import { ProfileComponent } from './profile.component';
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
    ProfileComponent,
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
export class ProfileModule {
}
