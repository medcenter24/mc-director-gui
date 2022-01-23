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

import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { FinanceCurrency } from '../../finance.currency';
import { FinanceCurrencyService } from '../../finance.currency.service';

@Directive({ selector: '[ngaFinanceCurrencyIco]' })
export class FinanceCurrencyIcoDirective implements OnChanges {

  @Input() ngaFinanceCurrencyIco: any;

  /**
   * Generally I need the icon for example fa fa-icon, which has 2 or more classes
   */
  private classParts: string[] = [];

  /**
   * Cached list of currencies
   */
  private currencies = null;

  ngOnChanges(): void {
    this.setSpinner();
    if (this.ngaFinanceCurrencyIco === 'percent') {
      this.setPercent();
    } else {
      this.setCurrency();
    }
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private currencyService: FinanceCurrencyService,
  ) {}

  private setClass(): void {
    this.renderer.removeAttribute(this.el.nativeElement, 'class');
    this.classParts.forEach(val => this.renderer.addClass(this.el.nativeElement, val));
  }

  private setSpinner(): void {
    this.classParts = [];
    this.classParts.push('fa');
    this.classParts.push('fa-spinner');
    this.classParts.push('fa-spin');
    this.setClass();
  }

  private setPercent(): void {
    this.classParts = [];
    this.classParts.push('fa');
    this.classParts.push('fa-percent');
    this.setClass();
  }

  private setCurrency(): void {
    // currencies
    if (this.currencies === null) {
      const obs = this.currencyService.search({});
      obs.subscribe(response => {
        this.currencies = response.data as FinanceCurrency[];
        this.setCurrencyFromCache();
      });
    } else {
      this.setCurrencyFromCache();
    }
  }

  private setCurrencyFromCache(): void {
    this.currencies.forEach((currency: FinanceCurrency) => {
      if (+currency.id === +this.ngaFinanceCurrencyIco) {
        this.classParts = currency.ico.split(' ');
        this.setClass();
      }
    });
  }
}
