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

import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { Doctor } from '../../doctor';
import { DoctorsService } from '../../doctors.service';
import { City, CitiesService } from '../../../city';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { User } from '../../../users/user';
import { UserEditorComponent } from '../../../users/editor/user.editor.component';
import { MultiSelectorComponent } from '../../../ui/selector/components/multiSelector';
import { GlobalState } from '../../../../global.state';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../users/users.service';
import { AutocompleterComponent } from '../../../ui/selector/components/autocompleter';

@Component({
  selector: 'nga-doctor-editor',
  templateUrl: './doctor.editor.html',
  styleUrls: ['./doctor.editor.scss'],
  outputs: ['init', 'loaded'],
})
export class DoctorEditorComponent extends LoadableComponent implements AfterViewInit {
  protected componentName: string = 'DoctorEditorComponent';

  @Input() set setDoctor(doctor: Doctor) {
    this.editDoctor(doctor);
  }

  @Output() doctorChanged: EventEmitter<Doctor> = new EventEmitter<Doctor>();
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('userSelector')
    private userSelectComponent: AutocompleterComponent;

  @ViewChild('userEditor')
    private userEditor: UserEditorComponent;

  @ViewChild('citiesSelector')
    private citiesSelector: MultiSelectorComponent;

  doctor: Doctor;
  showUserEditor: boolean = false;
  // doctor's cities
  cities: City[] = [];
  isLoaded: boolean = false;

  constructor(
    private service: DoctorsService,
    public cityService: CitiesService,
    protected _state: GlobalState,
    private translateService: TranslateService,
    public userService: UsersService,
  ) {
    super();
  }

  editDoctor(doctor: Doctor): void {
    if (this.doctor !== doctor) {
      this.showUserEditor = false;
    }
    this.doctor = doctor;
    this.loadEditableData();
  }

  ngAfterViewInit(): void {
    this.isLoaded = true;
    this.loadEditableData();
  }

  onSubmit(): void {
    const opName = `Save`;
    this.startLoader(opName);
    if (this.doctor.id) {
      this.service.update(this.doctor).then((doctor: Doctor) => {
        this.stopLoader(opName);
        this.doctorChanged.emit(doctor);
      }).catch(() => this.stopLoader(opName));
    } else {
      this.service.create(this.doctor).then((doctor: Doctor) => {
        this.stopLoader(opName);
        this.doctorChanged.emit(doctor);
      }).catch(() => this.stopLoader(opName));
    }
  }

  onDelete(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete the doctor?'),
        acceptVisible: true,
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.service.destroy(this.doctor)
            .then(() => {
              this.stopLoader(postfix);
              this.doctorChanged.emit(null);
              this.close.emit();
            })
            .catch(() => this.stopLoader(postfix));
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  onUserChanged(user: User|any): void {
    this.doctor.userId = user.id;
  }

  onCitySelect(cities: City[]): void {
    const opName = 'CitySelect';
    this.startLoader(opName);
    this.service.setDoctorCities(this.doctor.id, cities)
      .then(() => this.stopLoader(opName))
      .catch(() => this.stopLoader(opName));
  }

  toggleEditor(): void {
    this.showUserEditor = !this.showUserEditor;
    this.userEditor.loadUser(this.doctor.userId);
  }

  closeEditor(): void {
    this.close.emit(true);
  }

  reloadUsers(): void {
    if (this.doctor) {
      this.userSelectComponent.selectItems(+this.doctor.userId, 'users.id');
    }
  }

  loadEditableData(): void {
    if (this.isLoaded) {
      this.reloadUsers();
      this.reloadDoctorCities();
    }
  }

  private reloadDoctorCities(): void {
    this.cities = [];
    if (this.doctor && this.doctor.id) {
      const opName = 'LoadCity';
      this.startLoader(opName);
      this.service.getDoctorCities(this.doctor.id)
        .then((cities: City[]) => {
          this.stopLoader(opName);
          this.cities = cities;
          this.citiesSelector.selectItems(this.cities);
        }).catch(() => this.stopLoader(opName));
    }
  }

  handleUserEdited(event): void {
    this.showUserEditor = false;
    this.doctor.userId = event.id;
    this.reloadUsers();
  }
}
