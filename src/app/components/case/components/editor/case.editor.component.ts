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

import {Component, ViewChild, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Accident} from '../../../accident/accident';
import {AccidentsService} from '../../../accident/accidents.service';
import {TranslateService} from '@ngx-translate/core';
import {AccidentType} from '../../../accident/components/type/type';
import {GlobalState} from '../../../../global.state';
import {DoctorAccident} from '../../../doctorAccident/doctorAccident';
import {FormService} from '../../../forms';
import {HospitalAccident} from '../../../hospitalAccident/hospitalAccident';
import {InvoiceEditorComponent} from '../../../invoice/components/editor';
import {Invoice} from '../../../invoice/invoice';
import {Upload} from '../../../upload/upload';
import {CasesService} from '../../cases.service';
import {Diagnostic} from '../../../diagnostic/diagnostic';
import {Document} from '../../../document/document';
import {AccidentCheckpoint} from '../../../accident/components/checkpoint/checkpoint';
import {DoctorsService} from '../../../doctors';
import {Doctor} from '../../../doctors';
import {DateHelper} from '../../../../helpers/date.helper';
import {Survey} from '../../../survey';
import {PatientEditorComponent} from '../../../patient/components/editor/patient.editor.component';
import {LoadingComponent} from '../../../core/components/componentLoader';
import {Patient} from '../../../patient/patient';
import {PatientSelectorComponent} from '../../../patient/components/selector/patient.selector.component';
import {PatientsService} from '../../../patient/patients.service';
import {CaseFinanceComponent} from '../finance';
import {Assistant, AssistantsService} from '../../../assistant';
import {CaseEditorTabsService} from './case.editor.tabs.service';
import {AccidentScenarioLineComponent} from '../../../accident/components/scenario/components/line/accident.scenario.line.component';
import {Service} from '../../../service';
import {AutocompleterComponent} from '../../../ui/selector/components/autocompleter';
import {CitiesService} from '../../../city';
import {Hospital, HospitalsService} from '../../../hospital';
import {BaToolboxAction} from '../../../../theme/components';
import {LoggerComponent} from '../../../core/logger/LoggerComponent';
import {Breadcrumb} from '../../../../theme/components/baContentTop/breadcrumb';
import {UiToastService} from '../../../ui/toast/ui.toast.service';

@Component({
  selector: 'nga-case-editor',
  templateUrl: './case.editor.html',
  styleUrls: ['./case.editor.scss'],
})
export class CaseEditorComponent extends LoadingComponent implements OnInit {

  @ViewChild('parentSelector')
  private parentSelector: AutocompleterComponent;

  @ViewChild('scenario')
  private scenarioComponent: AccidentScenarioLineComponent;

  @ViewChild('editPatientForm')
  private editPatientForm: PatientEditorComponent;

  @ViewChild('patientSelector')
  private patientSelector: PatientSelectorComponent;

  // I need to update finance if data changes
  @ViewChild('caseFinance')
  private caseFinance: CaseFinanceComponent;

  @ViewChild('assistantAutocompleter')
  private assistantAutocompleter: AutocompleterComponent;

  @ViewChild('cityAutocompleter')
  private cityAutocompleter: AutocompleterComponent;

  @ViewChild('doctorAutocompleter')
  private doctorAutocompleter: AutocompleterComponent;

  @ViewChild('hospitalAutocompleter')
  private hospitalAutocompleter: AutocompleterComponent;

  @ViewChild('guaranteeHospitalAutocompleter')
  private guaranteeHospitalAutocompleter: AutocompleterComponent;

  @ViewChild('hospitalInvoiceEditor')
  private hospitalInvoiceEditor: InvoiceEditorComponent;

  @ViewChild('invoiceEditorComponent')
  private invoiceEditorComponent: InvoiceEditorComponent;

  accident: Accident;
  appliedTime: string = '';
  doctorAccident: DoctorAccident;
  hospitalAccident: HospitalAccident;
  services: Service[] = [];
  diagnostics: Diagnostic[] = [];
  surveys: Survey[] = [];
  documents: Document[] = [];
  checkpoints: number[] = []; // ids of checkpoints
  handlingTime: string = '';
  createdTime: string = '';
  updatedTime: string = '';
  deletedTime: string = '';
  closedTime: string = '';
  patientEditFormDisplay: boolean = false;
  patient: Patient;
  assistantInvoice: Invoice;
  assistantGuaranteeFile: Upload;

  /**
   * to show on save message, that doctor was changed
   */
  doctorBeforeSave: number = 0;

  /**
   * if user touched any data on the page
   */
  hasChangedData: boolean = false;

  protected componentName: string = 'CaseEditorComponent';

  constructor(private route: ActivatedRoute,
              private translate: TranslateService,
              protected _logger: LoggerComponent,
              protected _state: GlobalState,
              public accidentsService: AccidentsService,
              public caseService: CasesService,
              public doctorService: DoctorsService,
              private router: Router,
              private patientService: PatientsService,
              private tabStopper: CaseEditorTabsService,
              public assistantService: AssistantsService,
              public cityService: CitiesService,
              public hospitalService: HospitalsService,
              public formService: FormService,
              private uiToastService: UiToastService,
  ) {
    super();
    this.translate.get('Case Loading').subscribe((text: string) => {
      this._state.notifyDataChanged('changeTitle', text);
    });
  }

  dataChanged(): void {
    if (!this.isLoading()) {
      this.hasChangedData = true;
    }
  }

  requireSave(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.hasChangedData) {
        this._state.notifyDataChanged('confirmDialog',
          {
            header: this.translate.instant('Warning'),
            message: this.translate.instant('The case has unsaved changes, would you like to save it?'),
            accept: value => {
              this.onSave();
              resolve(value);
            },
            reject: () => {
              if (reject) {
                reject();
              }
            },
            icon: 'fa fa-question-circle',
          },
        );
      } else {
        resolve(true);
      }
    });
  }

  ngOnInit() {
    this.accident = new Accident();

    this.doctorAccident = new DoctorAccident();
    this.hospitalAccident = new HospitalAccident();

    this.route.params
      .subscribe((params: Params) => {
        this._state.notifyDataChanged('menu.activeLink', {title: 'Cases'});

        if (+params['id']) {
          // start of loading data and the page
          const mainPostfix = 'main';
          this.startLoader(mainPostfix);

          this.accidentsService.getAccident(+params['id']).subscribe({
            next: (accident: Accident) => {

              this._state.notifyDataChanged('changeTitle', accident.refNum);

              this.translate.get('Cases').subscribe((trans: string) => {
                const breadcrumbs = [];
                breadcrumbs.push(new Breadcrumb(trans, '/pages/cases'));
                breadcrumbs.push(new Breadcrumb(accident.refNum, `/pages/cases/${accident.id}`, true, false));
                this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
              });

              this.showToolbox();
              this.accident = accident ? accident : new Accident();
              if (this.accident.handlingTime && this.accident.handlingTime.length) {
                this.handlingTime = DateHelper.toEuropeFormatWithTime(this.accident.handlingTime);
              }
              if (this.accident.createdAt.length) {
                this.createdTime = DateHelper.toEuropeFormatWithTime(this.accident.createdAt);
              }
              if (this.accident.updatedAt && this.accident.updatedAt.length) {
                this.updatedTime = DateHelper.toEuropeFormatWithTime(this.accident.updatedAt);
              }
              if (this.accident.deletedAt && this.accident.deletedAt.length) {
                this.deletedTime = DateHelper.toEuropeFormatWithTime(this.accident.deletedAt);
              }
              if (this.accident.closedAt && this.accident.closedAt.length) {
                this.closedTime = DateHelper.toEuropeFormatWithTime(this.accident.closedAt);
              }
              if (this.accident.assistantId) {
                this.assistantAutocompleter.selectItems(this.accident.assistantId);
              }
              if (this.accident.cityId) {
                this.cityAutocompleter.selectItems(this.accident.cityId);
              }
              if (this.accident.parentId && this.parentSelector) {
                this.parentSelector.selectItems(this.accident.parentId);
              }
              // cheating to not make extra request
              if (+this.accident.assistantGuaranteeId) {
                this.assistantGuaranteeFile = new Upload(this.accident.assistantGuaranteeId);
              }
              this.assistantInvoice = new Invoice(accident.assistantInvoiceId, 0, 'form');
              this.loadCaseable();
              this.loadDocuments();
              this.loadCheckpoints();
              this.loadPatient();
              // it has to be at the end, because on any error it will be stopped second time (in the catch section)
              this.stopLoader(mainPostfix);
            }, error: (err) => {
              this.stopLoader(mainPostfix);
              if (err.status === 404) {
                this._logger.error('Resource not found');
                this.uiToastService.notFound();
                // todo stop all loaders on the page?
                this.router.navigate(['pages/cases']).then();
              } else {
                this._logger.error(err);
              }
            },
          });
        } else {
          this.handlingTime = DateHelper.toEuropeFormatWithTime(Date().toString());
          setTimeout(() => {
            this._state.notifyDataChanged('menu.activeLink', {title: 'Cases'});
          }, 100);
          this.translate.get('New Case').subscribe((text: string) => {
            this._state.notifyDataChanged('changeTitle', text);
          });
        }
      });
  }

  private showToolbox(): void {
    this.translate.get('Save').subscribe((saveText: string) => {
      const actions: BaToolboxAction[] = [];
      actions.push(new BaToolboxAction(this.translate.instant('Back'), 'fa fa-angle-left', () => {
        this.goToList().then();
      }, 'navigation'));
      actions.push(new BaToolboxAction(saveText, 'fa fa-save', () => {
        this.onSave();
      }, 'save'));
      actions.push(new BaToolboxAction(this.translate.instant('Delete'), 'fa fa-trash', () => {
        this.onDelete();
      }, 'close'));
      actions.push(new BaToolboxAction(this.translate.instant('Close'), 'fa fa-times', () => {
        this.onClose();
      }, 'close'));
      actions.push(new BaToolboxAction(this.translate.instant('Preview'), 'fa fa-eye', () => {
        this.previewCase();
      }, 'content'));
      this._state.notifyDataChanged('toolbox.actions', actions);
    });
  }

  protected onComponentsLoadingCompleted(): void {
    this.tabStopper.init();
  }

  previewCase(): void {
    this.requireSave().then(() => {
      if (this.invoiceEditorComponent && typeof this.invoiceEditorComponent['preview'] === 'function') {
        this.invoiceEditorComponent.preview();
      } else {
        this.uiToastService.errorMessage(this.translate.instant('Form not selected'));
      }
    }).catch((e) => {
      this._logger.error(e);
      this.uiToastService.error();
    });
  }

  onSave(): void {
    this.accident.handlingTime = this.handlingTime && this.handlingTime.length
      ? DateHelper.getUnixDateWithTime(DateHelper.parseDateFromFormat(this.handlingTime))
      : DateHelper.getUnixDateWithTime(new Date());

    this.doctorAccident.visitTime = this.appliedTime && this.appliedTime.length
      ? DateHelper.getUnixDateWithTime(DateHelper.parseDateFromFormat(this.appliedTime))
      : DateHelper.getUnixDateWithTime(new Date());

    const data = {
      accident: this.accident,
      doctorAccident: this.doctorAccident,
      hospitalAccident: this.hospitalAccident,
      services: this.services.map(x => x.id),
      diagnostics: this.diagnostics.map(x => x.id),
      surveys: this.surveys.map(x => x.id),
      documents: this.documents.map(x => x.id),
      checkpoints: this.checkpoints,
      patient: this.patientSelector.getPatient(),
    };

    if (this.doctorBeforeSave && this.doctorBeforeSave !== +this.doctorAccident.doctorId) {
      this._state.notifyDataChanged('confirmDialog',
        {
          header: this.translate.instant('Warning'),
          message: this.translate.instant('Are you sure that you want to change doctor?' +
            ' Doctor will lost access to that case.'),
          accept: () => {
            this.saveCase(data);
          },
          icon: 'fa fa-question-circle',
        },
      );
    } else {
      this.saveCase(data);
    }
  }

  onClose(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translate.instant('Warning'),
        message: this.translate.instant('Are you sure that you want to close case?' +
          ' Every one will lost access to this case.'),
        accept: () => {
          const postfix = 'caseClosing';
          this.startLoader(postfix);
          this.caseService.closeCase(this.accident.id).subscribe({next: () => {
            this.scenarioComponent.reload();
            this.stopLoader(postfix);
          }, error: err => {
            if (err.status === 404) {
              this.uiToastService.notFound();
            } else {
              this._logger.error(err);
              this.uiToastService.error();
              this.stopLoader(postfix);
            }
          }});
        },
        icon: 'fa fa-warning',
      },
    );
  }

  private goToList(): Promise<boolean> {
    return this.router.navigate(['pages/cases']);
  }

  onDelete(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translate.instant('Warning'),
        message: this.translate.instant('Are you sure that you want to DELETE case?' +
          ' After that this case won\'t be restored.'),
        accept: () => {
          const postfix = 'deleteCase';
          this.startLoader(postfix);
          this.caseService.deleteCase(this.accident.id).subscribe({next: () => {
            this.goToList().then(() => this.stopLoader(postfix));
          }, error: err => {
            if (err.status === 404) {
              this.uiToastService.notFound();
              this.router.navigate(['pages/cases']).then(() => this.stopLoader(postfix));
            } else {
              this._logger.error(err);
              this.stopLoader(postfix);
            }
          }});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  private saveCase(data): void {
    const postfix = 'SaveCase';
    this.startLoader(postfix);
    this.caseService.saveCase(data).subscribe({next: response => {
      this.doctorBeforeSave = +this.doctorAccident.doctorId;
      this.hasChangedData = false;
      if (!data.accident.id) {
        this.router.navigate([`pages/cases/${response.id}`])
          .then(() => this.stopLoader(postfix));
      } else {
        this.scenarioComponent.reload();
        this.caseFinance.reloadPayments(['income', 'assistant', 'caseable']);
        this.stopLoader(postfix);
      }
    }, error: err => {
      if (err.status === 404) {
        this.uiToastService.notFound();
        this.goToList().then(() => this.stopLoader(postfix));
      } else if (err.status === 403) {
        this.uiToastService.errorMessage(this.translate.instant('This case was closed'));
        this.stopLoader(postfix);
      } else {
        this._logger.error(err);
        this.stopLoader(postfix);
      }
    }});
  }

  onCaseTypeSelected(type): void {
    this.accident.caseableType = type;
    if (type === 'doctor' && !this.doctorAccident) {
      this.doctorAccident = new DoctorAccident();
    } else if (!this.hospitalAccident) {
      this.hospitalAccident = new HospitalAccident();
    }
    this.dataChanged();
  }

  onAccidentTypeSelected(accidentType: AccidentType): void {
    this.dataChanged();
    this.accident.accidentTypeId = accidentType.id;
  }

  onAssistantChanged(assistant: Assistant): void {
    this.dataChanged();
    this.accident.assistantId = assistant.id;
  }

  onAccidentSelected(accident: Accident): void {
    this.dataChanged();
    this.accident.parentId = 0;
    setTimeout(() => this.accident.parentId = accident.id, 100);
  }

  onParentDeleted(): void {
    this.dataChanged();
    this.accident.parentId = 0;
    this.parentSelector.selectItems(0);
  }

  onReferralChanged(event): void {
    this.dataChanged();
    this.accident.refNum = event.target.value;
  }

  onServicesChanged(services: Service[]): void {
    this.dataChanged();
    this.services = services;
    if (!this.isLoading()) {
      this.onSave();
    }
  }

  onDiagnosticsChanged(diagnostics: Diagnostic[]): void {
    this.dataChanged();
    this.diagnostics = diagnostics;
  }

  onDiagnosticsLoaded(diagnostics: Diagnostic[]): void {
    // loaded by the accidentId, have to be refactored to avoid and moved to the accident service
    this.diagnostics = diagnostics;
  }

  onSurveysChanged(surveys: Survey[]): void {
    this.dataChanged();
    this.surveys = surveys;
  }

  onDoctorChanged(doc): void {
    this.dataChanged();
    this.doctorAccident.doctorId = doc ? doc.id : 0;
    this.autoSave();
  }

  onHospitalChanged(hospital: Hospital): void {
    this.dataChanged();
    this.hospitalAccident.hospitalId = hospital ? hospital.id : 0;
  }

  onCityChanged(city): void {
    this.dataChanged();
    const cityId = city ? city.id : 0;
    this.accident.cityId = cityId;

    this.doctorAccident.doctorId = +this.doctorAccident.doctorId;
    // determine which doctor could be used in this hospital
    if (!this.doctorAccident.doctorId && cityId) {
      this.defineDoctorByCity(cityId);
    }
  }

  onCheckpointChange(checkpoints: number[]): void {
    this.dataChanged();
    this.checkpoints = checkpoints;
  }

  private defineDoctorByCity(cityId: number): void {
    const postfix = 'DefineDoctorByCity';
    this.startLoader(postfix);
    this.doctorService.getDoctorsByCity(cityId).subscribe({next: (doctors: Doctor[]) => {
      if (doctors && doctors.length) {
        this.doctorAccident.doctorId = doctors[0].id;
      }
      this.stopLoader(postfix);
    }, error: () => this.stopLoader(postfix)});
  }

  private loadDocuments(): void {
    const postfix = 'getDocuments';
    this.startLoader(postfix);
    this.caseService.getDocuments(this.accident.id)
      .subscribe({ next: (documents: Document[]) => {
        this.documents = documents;
        this.stopLoader(postfix);
      }, error: err => {
        this._logger.error(err);
        this.stopLoader(postfix);
    }});
  }

  private loadCheckpoints(): void {
    this.startLoader('getCheckpoints');
    this.caseService.getCheckpoints(this.accident.id)
      .subscribe({ next: (checkpoints: AccidentCheckpoint[]) => {
        this.checkpoints = checkpoints.map(x => x.id);
        this.stopLoader('getCheckpoints');
      }, error: () => {
      this.stopLoader('getCheckpoints');
    }});
  }

  private loadPatient(): void {
    if (+this.accident.patientId) {
      this.startLoader('getPatient');
      this.patientService.getPatient(this.accident.patientId)
        .subscribe({next: (patient: Patient) => {
          this.stopLoader('getPatient');
          this.patient = patient;
        }, error: () => this.stopLoader('getPatient')});
    }
  }

  private loadDoctorAccidentCaseable(): void {
    const postfix = '_GetDoctorCaseable';
    this.startLoader(postfix);
    this.caseService.getDoctorCase(this.accident.id)
      .subscribe({next: (doctorAccident: DoctorAccident) => {
        this.doctorAccident = doctorAccident;
        this.doctorBeforeSave = +doctorAccident.doctorId;
        if (+this.doctorAccident.doctorId) {
          this.doctorAutocompleter.selectItems(+this.doctorAccident.doctorId);
        }
        if (doctorAccident.visitTime) {
          this.appliedTime = DateHelper.toEuropeFormatWithTime(doctorAccident.visitTime);
        }
        this.stopLoader(postfix);
      }, error: err => {
      this._logger.error(err);
      this.stopLoader(postfix);
    }});
  }

  private loadHospitalCaseable(): void {
    const postfix = 'getHospitalCaseable';
    this.startLoader(postfix);
    this.caseService.getHospitalCase(this.accident.id)
      .subscribe({
        next: (hospitalAccident: HospitalAccident) => {
          this.stopLoader(postfix);

          this.hospitalAccident = hospitalAccident;
          if (hospitalAccident.hospitalId) {
            this.hospitalAutocompleter.selectItems(hospitalAccident.hospitalId);
          }
          // hospital's letter
          if (+this.hospitalAccident.hospitalGuaranteeId) {
            this.guaranteeHospitalAutocompleter.selectItems(this.hospitalAccident.hospitalGuaranteeId);
          }
          // hospital's invoice
          this.hospitalInvoiceEditor.setInvoice(new Invoice(hospitalAccident.hospitalInvoiceId, 0, 'file'), true);
        }, error: (err) => {
          this._logger.error(err);
          this.stopLoader(postfix);
        },
      });
  }

  private loadCaseable(): void {
    if (this.isDoctorAccident()) {
      this.loadDoctorAccidentCaseable();
    } else {
      this.loadHospitalCaseable();
    }
  }

  openEditPatientForm(patient: Patient): void {
    this.editPatientForm.setPatient(patient);
    this.patientEditFormDisplay = true;
  }

  onPatientSelected(patient: Patient): void {
    this.dataChanged();
    this.patientEditFormDisplay = false;
    this.patient = patient;
    this.accident.patientId = patient.id;
    this.editPatientForm.setPatient(patient);
    this.patientSelector.resetPatient(patient);
  }

  isDoctorAccident(): boolean {
    return this.accident.caseableType === 'doctor';
  }

  isHospitalAccident(): boolean {
    return this.accident.caseableType === 'hospital';
  }

  onAssistantGuaranteeFileUploaded(file: Upload): void {
    this.dataChanged();
    this.assistantGuaranteeFile = file;
    this.accident.assistantGuaranteeId = file.id;
    this.autoSave();
  }

  /**
   * Saving on data changed if accident exists and loaded
   */
  autoSave(): void {
    if (this.accident.id) {
      this.onSave(); // update story
    }
  }

  onReportFormChanged(event): void {
    this.dataChanged();
    this.accident.formReportId = event.id;
  }

  onAssistantRefNumChanged(): void {
    this.dataChanged();
  }

  onHandlingTimeChanged(): void {
    this.dataChanged();
  }

  onSymptomsChanged(): void {
    this.dataChanged();
  }

  onParentChanged(event): void {
    this.dataChanged();
    this.accident.parentId = event.value;
  }

  onPatientDataChanged(): void {
    this.dataChanged();
  }

  onAppliedTimeChanged(): void {
    this.dataChanged();
  }

  onDiagnosisChanged(): void {
    this.dataChanged();
  }

  onAdditionalInvestigationChanged(): void {
    this.dataChanged();
  }

  onGuaranteeFormChanged(event): void {
    this.dataChanged();
    this.hospitalAccident.hospitalGuaranteeId = event.id;
  }

  onHospitalInvoiceChanged(event): void {
    this.dataChanged();
    this.hospitalAccident.hospitalInvoiceId = event.id;
    this.caseFinance.reloadPayments(['income', 'assistant', 'caseable']);
    this.autoSave();
  }

  onInvoiceToAssistantChanged(event): void {
    this.dataChanged();
    this.caseFinance.reloadPayments(['income', 'assistant', 'caseable']);
    this.accident.assistantInvoiceId = event.id;
    this.autoSave();
  }

  onDocumentsChanged(): void {
    this.dataChanged();
    this.loadDocuments();
  }
}
