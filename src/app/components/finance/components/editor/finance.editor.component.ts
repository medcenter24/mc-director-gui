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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadableComponent } from '../../../core/components/componentLoader';
import { Doctor, DoctorsService } from '../../../doctors';
import { HospitalsService } from '../../../hospital';
import { FinanceRule } from '../../finance.rule';
import { FinanceService } from '../../finance.service';
import { Assistant, AssistantsService } from '../../../assistant';
import { CitiesService } from '../../../city';
import { PeriodService } from '../../../period';
import { NumbersHelper } from '../../../../helpers/numbers.helper';
import { ServicesService } from '../../../service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalState } from '../../../../global.state';
import { FinanceCurrencyService } from '../currency/finance.currency.service';
import { Breadcrumb } from '../../../../theme/components/baContentTop/breadcrumb';

@Component({
  selector: 'nga-finance-editor',
  templateUrl: './finance.editor.html',
  styleUrls: ['./finance.editor.scss'],
})
export class FinanceEditorComponent extends LoadableComponent implements OnInit {
  protected componentName: string = 'FinanceEditorComponent';

  @Output() protected init: EventEmitter<string> = new EventEmitter<string>();
  @Output() protected loaded: EventEmitter<string> = new EventEmitter<string>();

  rule: FinanceRule = new FinanceRule();

  isLoaded: boolean = false;

  /**
   * add, sub
   */
  financeTypes: any[] = [];

  /**
   * doctor, accident
   */
  conditionModels: any[] = [];

  constructor(
    protected financeService: FinanceService,
    public doctorService: DoctorsService,
    public cityService: CitiesService,
    public assistantService: AssistantsService,
    public periodService: PeriodService,
    public servicesService: ServicesService,
    private route: ActivatedRoute,
    private router: Router,
    protected _state: GlobalState,
    protected translateService: TranslateService,
    public currencyService: FinanceCurrencyService,
    public hospitalService: HospitalsService,
  ) {
    super();
    this.translateService.get('Condition').subscribe((text: string) => {
      this._state.notifyDataChanged('changeTitle', `${text} · ${this.translateService.instant('Loading')}`);
    });
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this._state.notifyDataChanged('menu.activeLink', { title: 'Finance' });
        const id = +params[ 'id' ];
        this.initTypes();
        this.initModels();
        if (id) {

          this.translateService.get('Condition').subscribe((text: string) => {
            this._state.notifyDataChanged('changeTitle', `${text} · ${id}`);
          });

          this.startLoader();
          this.financeService.getFinanceRule(id).subscribe({next: (financeRule: FinanceRule) => {
            this.stopLoader();

            this.translateService.get('Finance').subscribe((trans: string) => {
              const breadcrumbs = [];
              breadcrumbs.push(new Breadcrumb(trans, '/pages/finance/conditions'));
              breadcrumbs.push(new Breadcrumb(financeRule.title, `/pages/cases/${financeRule.id}`, true, false));
              this._state.notifyDataChanged('menu.activeLink', breadcrumbs);
            });

            this.rule = financeRule;
            this.isLoaded = true;
          }, error: () => this.stopLoader()});
        } else {
            this.isLoaded = true;

            this.translateService.get('Condition').subscribe((text: string) => {
              this._state.notifyDataChanged('changeTitle', `${text} · ${this.translateService.instant('New')}`);
            });
        }
      });
  }

  private initTypes(): void {
    const postfix = 'TypesLang';
    this.startLoader(postfix);
    this.translateService.get('Yes').subscribe(() => {
      this.financeTypes = [];
      this.financeTypes.push({ label: this.translateService.instant('Base Payment'), value: 'base' });
      this.financeTypes.push({ label: this.translateService.instant('Add'), value: 'add' });
      this.financeTypes.push({ label: this.translateService.instant('Subtract'), value: 'sub' });

      this.stopLoader(postfix);

      if (!this.rule.type) {
        this.rule.type = 'add';
      }
    });
  }

  private initModels(): void {
    const postfix = 'ModelsLang';
    this.startLoader(postfix);
    this.translateService.get('Yes').subscribe(() => {
      this.conditionModels = [];

      // condition for the assistant company
      this.conditionModels.push({
        label: this.translateService.instant('Assistant'),
        desc: this.translateService.instant('Invoice the assistant'), // how much assistant needs to pay
        value: 'assistant',
      });

      // condition for the doctor
      this.conditionModels.push({
        label: this.translateService.instant('Doctor'),
        desc: this.translateService.instant('Doctor remuneration'),
        value: 'doctor',
      });

      this.stopLoader(postfix);

      if (!this.rule.model) {
        this.rule.model = 'assistant';
      }
    });
  }

  saveFinanceRule(): void {
    const postfix = 'SaveRule';
    this.startLoader(postfix);
    this.financeService.save(this.rule)
      .subscribe({next: rule => {
        this.stopLoader(postfix);
        if (!this.rule || !this.rule.id) {
          this.router.navigate([`pages/finance/conditions/${rule.id}`]).then();
        } else {
          this.rule = rule;
        }
      }, error: () => {
        this.stopLoader(postfix);
      }});
  }

  deleteFinanceRule(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete this condition?'),
        accept: () => {
          const postfix = 'DeleteRule';
          this.startLoader(postfix);
          this.financeService.destroy(this.rule)
            .subscribe({next: () => {
              this.stopLoader(postfix);
              this.router.navigate([`pages/finance/conditions`]).then();
            }, error: () => {
              this.stopLoader(postfix);
            }});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  copyFinanceRule(): void {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Copy'),
        message: this.translateService.instant('Are you sure you want to copy this condition?'),
        accept: () => {
          const postfix = 'CopyRule';
          this.startLoader(postfix);
          this.financeService.copy(this.rule)
            .subscribe({next: (financeCopy) => {
                this.stopLoader(postfix);
                this.router.navigate([`pages/finance/conditions/${financeCopy.id}`]).then();
              }, error: () => {
                this.stopLoader(postfix);
              }});
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  canBeSaved () {
    return FinanceRule.canBeSaved(this.rule);
  }

  onPriceAmountChanged(event): void {
    const val = event.target.value;
    this.rule.value = event.target.value = FinanceEditorComponent.convertPriceAmount(val);
  }

  priceAmountToFixed(event): void {
    this.rule.value = event.target.value = FinanceEditorComponent.convertPriceAmount(event.target.value, true);
  }

  private static convertPriceAmount(amount: string = '', toFixed: boolean = false): number {
    let result = null;
    if (amount !== '') {
      result = NumbersHelper.getFixedFloat(amount, true, toFixed);
    }
    return result;
  }
}
