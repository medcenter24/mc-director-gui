/*
 * Copyright (c) 2017. 
 *
 * @author Alexander Zagovorichev <zagovorichev@gmail.com>
 */

import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { DoctorsService } from '../../../../components/doctors/doctors.service';
import { DoctorEditorComponent } from '../../../../components/doctors/editor/editor.component';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Logger } from 'angular2-logger/core';
import { City } from '../../../../components/city/city';

@Component({
  selector: 'nga-stuff-component',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stuff.html',
})
export class StuffComponent implements OnInit {

  @ViewChild('deleteDialog')
  private deleteDialog: ModalComponent;

  @ViewChild('errorDialog')
  private errorDialog: ModalComponent;

  @ViewChild(DoctorEditorComponent)
  private doctorEditorComponent: DoctorEditorComponent;

  /**
   * User editor
   * @type {boolean}
   */
  userEditorHidden: boolean = true;
  editableUserId: number = 0;

  /**
   * Doctor editor
   * @type {boolean}
   */
  doctorEditorHidden: boolean = true;
  editableDoctorId: number = 0;

  /**
   * Cities selector
   * @type {boolean}
   */
  selectedCities: City[] = [];

  query: string = '';

  settings = {
    actions: {
      position: 'left',
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmSave: true,
    },
    'delete': {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      ref_key: {
        title: 'Ref. Key',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  deleteDialogEvent: any = null;
  titleForDeletion: string = '';
  deleteProcess: boolean = false;
  errorMessage: string = '';

  constructor (
    protected service: DoctorsService,
    private loadingBar: SlimLoadingBarService,
    private _logger: Logger,
  ) {
  }

  ngOnInit (): void {
    this.loadingBar.start();
    this.service.getDoctors().then((data) => {
      this.source.load(data);
      this.loadingBar.complete();
    }).catch(() => {
      this.showError('Something bad happened, you can\'t load list of doctors');
      this.loadingBar.complete();
    });
  }

  handleTableSave (event): void {
    this.loadingBar.start();
    this.service.update(event.newData).then(() => {
      event.confirm.resolve();
      this.doctorEditorHidden = true;
      this.userEditorHidden = true;
      this.loadingBar.complete();
    }).catch((reason) => {
      if (event && event.confirm) {
        event.confirm.reject();
      }
      this.showError('Something bad happened, you can\'t save doctors\' data');
      this.loadingBar.complete();
      this._logger.error(reason);
    });
  }

  handleTableCreate (event): void {
    this.loadingBar.start();
    this.service.create(event.newData).then(response => {
      event.confirm.resolve(response);
      this.doctorEditorHidden = true;
      this.userEditorHidden = true;
      this.loadingBar.complete();
    }).catch(() => {
      if (event && event.confirm) {
        event.confirm.reject();
      }
      this.showError('Something bad happened, you can\'t create doctor');
      this.loadingBar.complete();
    });
  }

  private showError (message: string): void {
    this.errorMessage = message;
    this.errorDialog.open('sm');
  }

  handleDeleteConfirm (event): void {
    this.deleteDialogEvent = event;
    this.titleForDeletion = event.data.name;
    this.deleteDialog.open('sm');
  }

  handleDeleteDialogOk (): void {
    this.deleteProcess = true;
    this.loadingBar.start();
    this.service.delete(this.deleteDialogEvent.data.id).then(() => {
      this.deleteDialogEvent.confirm.resolve();
      this.deleteDialogEvent = null;
      this.deleteDialog.close();
      this.deleteProcess = false;
      this.doctorEditorHidden = true;
      this.userEditorHidden = true;
      this.loadingBar.complete();
    }).catch(() => {
      this.deleteDialogEvent.confirm.reject();
      this.deleteDialogEvent = null;
      this.deleteProcess = false;
      this.doctorEditorHidden = true;
      this.userEditorHidden = true;
      this.loadingBar.complete();
    });
  }

  handleDeleteDialogCancel (event): void {
    if (this.deleteDialogEvent && this.deleteDialogEvent.confirm) {
      this.deleteDialogEvent.confirm.reject();
    }
    this.deleteDialogEvent = null;
  }

  closeDoctorEditor (): void {
    this.doctorEditorHidden = true;
    this.userEditorHidden = true;
    this.editableDoctorId = 0;
  }

  handleUserSelectRow (event): void {
    this.doctorEditorHidden = false;
    this.userEditorHidden = true;
    this.editableDoctorId = event.data.id;
  }

  handleToggleUserEditor (userId: number): void {
    this.userEditorHidden = !this.userEditorHidden;
    this.editableUserId = +userId;
  }

  handleUserEdited (): void {
    this.doctorEditorComponent.reloadUsers();
  }
}
