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
export class Accident {

    constructor(
        public id: number = 0,
        public createdBy: number = 0,
        public parentId: number = 0,
        public patientId: number = 0,
        public accidentTypeId: number = 0,
        public accidentStatusId: number = 0,
        public cityId: number = 0,
        public formReportId: number = 0,
        public caseableId: number = 0,
        public caseableType: string = 'doctor',
        public caseableCost: number = 0,
        public fixedIncome: number = 0,
        public refNum: string = '',
        public assistantId: number = 0,
        public assistantRefNum: string = '',
        public assistantInvoiceId: number = 0,
        public assistantGuaranteeId: number = 0,
        public title: string = '',
        public address: string = '',
        public contacts: string = '',
        public symptoms: string = '',
        public createdAt: string = '',
        public updatedAt: string = '',
        public deletedAt: string = '',
        public closedAt: string = '',
        public handlingTime: string = '',
    ) {}

  static fromData(data: object): Accident
  {
    return new Accident(
      data['id'],
      data['createdBy'],
      data['parentId'],
      data['patientId'],
      data['accidentTypeId'],
      data['accidentStatusId'],
      data['cityId'],
      data['formReportId'],
      data['caseableId'],
      data['caseableType'],
      data['caseableCost'],
      data['fixedIncome'],
      data['refNum'],
      data['assistantId'],
      data['assistantRefNum'],
      data['assistantInvoiceId'],
      data['assistantGuaranteeId'],
      data['title'],
      data['address'],
      data['contacts'],
      data['symptoms'],
      data['createdAt'],
      data['updatedAt'],
      data['deletedAt'],
      data['closedAt'],
      data['handlingTime'],
    );
  }
}
