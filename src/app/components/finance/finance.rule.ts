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

import { Assistant } from '../assistant';
import { City } from '../city';
import { Doctor } from '../doctors';
import { Hospital } from '../hospital';
import { Service } from '../service';
import { Period } from '../period';

export class FinanceRule {
  constructor(
    public id: number = 0,
    public title: string = '',
    public assistants: Assistant[] = [],
    public cities: City[] = [],
    public doctors: Doctor[] = [],
    public services: Service[] = [],
    public hospitals: Hospital[] = [],
    /**
     * from string - formatted string
     * example:
     *    from 'sat 00:00' to 'sun 23:59' # weekend rule
     *    from '21:00' to '6:00' # night rule
     *    # everything other - it's a day rule
     */
    public datePeriods: Period[] = [],
    public value: number = null,
    public currencyId: number = 0, // sub or add value in the currency value (from the FinanceCurrency)
    public currencyMode: string = 'currency', // currency, percent mode
    public type: string = 'add', // add, subtract (+ -)
    public model: string = 'assistant',
    public order: number = 0,
  ) { }

  static canBeSaved(rule: FinanceRule): boolean {
    const res = rule.value > 0 // no reason to save 0 - do nothing ?
      && rule.title
      && (rule.currencyMode === 'percent' || rule.currencyId)
      && rule.model;

    return !!res;
  }

  static fromData(data: object): FinanceRule {
    return new FinanceRule(
      data['id'],
      data['title'],
      this.getAssistantsFromData(data['assistants'] ?? []),
      this.getCitiesFromData(data['cities'] ?? []),
      this.getDoctorsFromData(data['doctors'] ?? []),
      this.getServicesFromData(data['services'] ?? []),
      this.getHospitalsFromData(data['hospitals'] ?? []),
      this.getDatePeriodsFromData(data['datePeriods'] ?? []),
      data['value'],
      data['currencyId'],
      data['currencyMode'],
      data['type'],
      data['model'],
      data['order'],
    );
  }

  private static getAssistantsFromData(assistants: Array<any>) {
    const res = [];
    assistants.forEach(assistant => {
      res.push(Assistant.fromData(assistant));
    });
    return res;
  }

  private static getCitiesFromData(cities: Array<any>) {
    const res = [];
    cities.forEach(city => {
      res.push(City.fromData(city));
    });
    return res;
  }

  private static getDoctorsFromData(doctors: Array<any>) {
    const res = [];
    doctors.forEach(doctor => {
      res.push(Doctor.fromData(doctor));
    });
    return res;
  }

  private static getServicesFromData(services: Array<any>) {
    const res = [];
    services.forEach(service => {
      res.push(Service.fromData(service));
    });
    return res;
  }

  private static getHospitalsFromData(hospitals: Array<any>) {
    const res = [];
    hospitals.forEach(hospital => {
      res.push(Hospital.fromData(hospital));
    });
    return res;

  }

  private static getDatePeriodsFromData(datePeriods: Array<any>) {
    const res = [];
    datePeriods.forEach(datePeriod => {
      res.push(Period.fromData(datePeriod));
    });
    return res;

  }
}
