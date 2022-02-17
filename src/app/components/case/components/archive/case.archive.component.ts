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
 * Copyright (c) 2022 (original work) MedCenter24.com;
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
import {LoadingComponent} from '../../../core/components/componentLoader';
import {Patient} from '../../../patient/patient';
import {PatientsService} from '../../../patient/patients.service';
import {Assistant, AssistantsService} from '../../../assistant';
import {
  AccidentScenarioLineComponent
} from '../../../accident/components/scenario/components/line/accident.scenario.line.component';
import {Service} from '../../../service';
import {CitiesService, City} from '../../../city';
import {Hospital, HospitalsService} from '../../../hospital';
import {LoggerComponent} from '../../../core/logger/LoggerComponent';
import {Breadcrumb} from '../../../../theme/components/baContentTop/breadcrumb';
import {UiToastService} from '../../../ui/toast/ui.toast.service';
import {PaymentViewer} from "../../../finance/components/payment/components/block/payment.viewer";
import {AccidentsRefNumService} from "../../../accident/accidents.refNum.service";
import {AccidentTypesService} from "../../../accident/components/type/types.service";
import {BaToolboxAction} from "../../../../theme/components";
import {DocumentsService} from "../../../document/documents.service";

@Component({
  selector: 'nga-case-archive',
  templateUrl: './case.archive.html',
  styleUrls: ['./case.archive.scss'],
})
export class CaseArchiveComponent extends LoadingComponent implements OnInit {
  protected componentName: string = 'CaseArchiveComponent';

  @ViewChild('scenario')
  private scenarioComponent: AccidentScenarioLineComponent;

  @ViewChild('hospitalInvoiceEditor')
  private hospitalInvoiceEditor: InvoiceEditorComponent;

  @ViewChild('invoiceEditorComponent')
  private invoiceEditorComponent: InvoiceEditorComponent;

  accident: Accident;
  assistant: Assistant;
  city: City;
  appliedTime: string = '';
  doctorAccident: DoctorAccident;
  hospitalAccident: HospitalAccident;
  services: Service[] = [];
  diagnostics: Diagnostic[] = [];
  surveys: Survey[] = [];
  documents: Document[] = [];
  checkpoints: string[] = []; // ids of checkpoints
  handlingTime: string = '';
  createdTime: string = '';
  updatedTime: string = '';
  deletedTime: string = '';
  closedTime: string = '';
  patient: Patient;
  assistantInvoice: Invoice;
  assistantGuaranteeFile: Upload;
  financeStateData: PaymentViewer[] = [];
  doctor: Doctor;
  hospital: Hospital;
  accidentType: AccidentType;

  constructor(private route: ActivatedRoute,
              private translate: TranslateService,
              protected _logger: LoggerComponent,
              protected _state: GlobalState,
              public accidentsService: AccidentsService,
              public accidentRefNumService: AccidentsRefNumService,
              public caseService: CasesService,
              public doctorService: DoctorsService,
              private router: Router,
              private patientService: PatientsService,
              public assistantService: AssistantsService,
              public cityService: CitiesService,
              public hospitalService: HospitalsService,
              public formService: FormService,
              private uiToastService: UiToastService,
              private accidentTypeService: AccidentTypesService,
              private documentsService: DocumentsService,
  ) {
    super();
    this.translate.get('Case Loading').subscribe((text: string) => {
      this._state.notifyDataChanged('changeTitle', text);
    });
  }

  ngOnInit() {
    this.accident = new Accident();

    this.doctorAccident = new DoctorAccident();
    this.hospitalAccident = new HospitalAccident();

    this.route.params
      .subscribe((params: Params) => {
        this._state.notifyDataChanged('menu.activeLink', {title: 'Cases'});

        // start of loading data and the page
        const mainPostfix = 'Main';
        this.startLoader(mainPostfix);

        if (!+params['id']) {
          this.redirectIfNotClosed(mainPostfix);
        }

        this.accidentsService.getAccident(+params['id']).subscribe({
          next: (accident: Accident) => {

            this.accident = accident ? accident : new Accident();
            this.redirectIfNotClosed(mainPostfix);

            this._state.notifyDataChanged('changeTitle', this.accident.refNum);

            this.translate.get('Cases').subscribe((trans: string) => {
              const breadcrumbs = [];
              breadcrumbs.push(new Breadcrumb(trans, '/pages/cases'));
              breadcrumbs.push(new Breadcrumb(accident.refNum, `/pages/cases/archive/${accident.id}`, true, false));
              this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
            });

            this.showToolbox();

            if (this.accident.assistantId) {
              const assistantPostfix = 'Assistant';
              this.startLoader(assistantPostfix)
              this.assistantService
                .getAssistant(this.accident.assistantId)
                .subscribe({
                  next: assistant => {
                    this.assistant = assistant;
                    this.stopLoader(assistantPostfix);
                  },
                  error: () => this.stopLoader(assistantPostfix),
                });
            }

            if (this.accident.cityId) {
              const cityPostfix = 'City';
              this.startLoader(cityPostfix)
              this.cityService
                .getCity(this.accident.cityId)
                .subscribe({
                  next: city => {
                    this.city = city;
                    this.stopLoader(cityPostfix);
                  },
                  error: () => this.stopLoader(cityPostfix),
                });
            }

            const accidentTypePostfix = 'AccidentType';
            this.startLoader(accidentTypePostfix)
            this.accidentTypeService
              .getType(this.accident.accidentTypeId)
              .subscribe({
                next: accidentType => {
                  this.accidentType = accidentType;
                  this.stopLoader(accidentTypePostfix);
                },
                error: () => this.stopLoader(accidentTypePostfix),
              });

            this.caseService.getFinance(this.accident, ['income', 'assistant', 'caseable'])
              .subscribe(finance => {
                this.financeStateData = finance;
              });

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
              this.router.navigate(['pages/cases']).then();
            } else {
              this._logger.error(err);
            }
          },
        });

      });
  }

  private showToolbox(): void {
    this.translate.get('Back').subscribe((backText: string) => {
      const actions: BaToolboxAction[] = [];
      actions.push(new BaToolboxAction(backText, 'fa fa-angle-left', () => {
        this.goToList().then();
      }, 'navigation'));
      actions.push(new BaToolboxAction(this.translate.instant('Preview'), 'fa fa-eye', () => {
        this.previewCase();
      }, 'content'));
      this._state.notifyDataChanged('toolbox.actions', actions);
    });
  }

  private goToList(): Promise<boolean> {
    return this.router.navigate(['pages/cases']);
  }

  previewCase(): void {
    if (this.invoiceEditorComponent && typeof this.invoiceEditorComponent['preview'] === 'function') {
      this.invoiceEditorComponent.preview();
    } else {
      this.uiToastService.errorMessage(this.translate.instant('Form not selected'));
    }
  }

  private loadDocuments(): void {
    const postfix = 'getDocuments';
    this.startLoader(postfix);
    this.caseService.getDocuments(this.accident.id)
      .subscribe({
        next: (documents: Document[]) => {
          this.documents = documents;
          this.stopLoader(postfix);
        }, error: err => {
          this._logger.error(err);
          this.stopLoader(postfix);
        }
      });
  }

  private loadCheckpoints(): void {
    this.startLoader('getCheckpoints');
    this.caseService.getCheckpoints(this.accident.id)
      .subscribe({
        next: (checkpoints: AccidentCheckpoint[]) => {
          this.checkpoints = checkpoints.map(x => x.title);
          this.stopLoader('getCheckpoints');
        }, error: () => {
          this.stopLoader('getCheckpoints');
        }
      });
  }

  private loadPatient(): void {
    if (+this.accident.patientId) {
      this.startLoader('getPatient');
      this.patientService.getPatient(this.accident.patientId)
        .subscribe({
          next: (patient: Patient) => {
            this.stopLoader('getPatient');
            this.patient = patient;
          }, error: () => this.stopLoader('getPatient')
        });
    }
  }

  private loadDoctorAccidentCaseable(): void {
    const postfix = '_GetDoctorCaseable';
    this.startLoader(postfix);
    this.caseService.getDoctorCase(this.accident.id)
      .subscribe({
        next: (doctorAccident: DoctorAccident) => {
          this.doctorAccident = doctorAccident;
          if (+this.doctorAccident.doctorId) {
            // get doctor
            this.doctorService.getDoctor(+this.doctorAccident.doctorId)
              .subscribe(doctor => this.doctor = doctor);
          }
          if (doctorAccident.visitTime) {
            this.appliedTime = DateHelper.toEuropeFormatWithTime(doctorAccident.visitTime);
          }
          this.stopLoader(postfix);
        }, error: err => {
          this._logger.error(err);
          this.stopLoader(postfix);
        }
      });
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
            if (+this.hospitalAccident.hospitalId) {
              this.hospitalService.getHospital(+this.hospitalAccident.hospitalId)
                .subscribe(hospital => this.hospital = hospital);
            }
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

  isDoctorAccident(): boolean {
    return this.accident.caseableType === 'doctor';
  }

  isHospitalAccident(): boolean {
    return this.accident.caseableType === 'hospital';
  }

  private redirectIfNotClosed(loaderPostfix: string) {
    if (!this.accident.isClosed) {
      this.stopLoader(loaderPostfix);
      this.router.navigate([`pages/cases/${this.accident.id}`]).then()
    }
  }

  onOpen() {
    const reopenPostfix = 'Reopen';
    this.startLoader(reopenPostfix);
    this.caseService.reopen(this.accident)
      .subscribe(() => {
        this.accident.isClosed = false;
        this.redirectIfNotClosed(reopenPostfix);
      });
  }

  downloadDocument(document: Document) {
    this.documentsService.download(document);
  }
}
