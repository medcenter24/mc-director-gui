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

import { Injectable } from '@angular/core';

@Injectable()
export class TimezoneService {

  getTimezones(): string[] {
    return [
      'Africa/Abidjan',
      'Africa/Accra',
      'Africa/Addis_Ababa',
      'Africa/Algiers',
      'Africa/Asmara',
      'Africa/Asmera',
      'Africa/Bamako',
      'Africa/Bangui',
      'Africa/Banjul',
      'Africa/Bissau',
      'Africa/Blantyre',
      'Africa/Brazzaville',
      'Africa/Bujumbura',
      'Africa/Cairo',
      'Africa/Casablanca',
      'Africa/Ceuta',
      'Africa/Conakry',
      'Africa/Dakar',
      'Africa/Dar_es_Salaam',
      'Africa/Djibouti',
      'Africa/Douala',
      'Africa/El_Aaiun',
      'Africa/Freetown',
      'Africa/Gaborone',
      'Africa/Harare',
      'Africa/Johannesburg',
      'Africa/Kampala',
      'Africa/Khartoum',
      'Africa/Kigali',
      'Africa/Kinshasa',
      'Africa/Lagos',
      'Africa/Libreville',
      'Africa/Lome',
      'Africa/Luanda',
      'Africa/Lubumbashi',
      'Africa/Lusaka',
      'Africa/Malabo',
      'Africa/Maputo',
      'Africa/Maseru',
      'Africa/Mbabane',
      'Africa/Mogadishu',
      'Africa/Monrovia',
      'Africa/Nairobi',
      'Africa/Ndjamena',
      'Africa/Niamey',
      'Africa/Nouakchott',
      'Africa/Ouagadougou',
      'Africa/Porto-Novo',
      'Africa/Sao_Tome',
      'Africa/Timbuktu',
      'Africa/Tripoli',
      'Africa/Tunis',
      'Africa/Windhoek',
      'America/Adak',
      'America/Anchorage',
      'America/Anguilla',
      'America/Antigua',
      'America/Araguaina',
      'America/Argentina/Buenos_Aires',
      'America/Argentina/Catamarca',
      'America/Argentina/ComodRivadavia',
      'America/Argentina/Cordoba',
      'America/Argentina/Jujuy',
      'America/Argentina/La_Rioja',
      'America/Argentina/Mendoza',
      'America/Argentina/Rio_Gallegos',
      'America/Argentina/Salta',
      'America/Argentina/San_Juan',
      'America/Argentina/San_Luis',
      'America/Argentina/Tucuman',
      'America/Argentina/Ushuaia',
      'America/Aruba',
      'America/Asuncion',
      'America/Atikokan',
      'America/Atka',
      'America/Bahia',
      'America/Barbados',
      'America/Belem',
      'America/Belize',
      'America/Blanc-Sablon',
      'America/Boa_Vista',
      'America/Bogota',
      'America/Boise',
      'America/Buenos_Aires',
      'America/Cambridge_Bay',
      'America/Campo_Grande',
      'America/Cancun',
      'America/Caracas',
      'America/Catamarca',
      'America/Cayenne',
      'America/Cayman',
      'America/Chicago',
      'America/Chihuahua',
      'America/Coral_Harbour',
      'America/Cordoba',
      'America/Costa_Rica',
      'America/Cuiaba',
      'America/Curacao',
      'America/Danmarkshavn',
      'America/Dawson',
      'America/Dawson_Creek',
      'America/Denver',
      'America/Detroit',
      'America/Dominica',
      'America/Edmonton',
      'America/Eirunepe',
      'America/El_Salvador',
      'America/Ensenada',
      'America/Fort_Wayne',
      'America/Fortaleza',
      'America/Glace_Bay',
      'America/Godthab',
      'America/Goose_Bay',
      'America/Grand_Turk',
      'America/Grenada',
      'America/Guadeloupe',
      'America/Guatemala',
      'America/Guayaquil',
      'America/Guyana',
      'America/Halifax',
      'America/Havana',
      'America/Hermosillo',
      'America/Indiana/Indianapolis',
      'America/Indiana/Knox',
      'America/Indiana/Marengo',
      'America/Indiana/Petersburg',
      'America/Indiana/Tell_City',
      'America/Indiana/Vevay',
      'America/Indiana/Vincennes',
      'America/Indiana/Winamac',
      'America/Indianapolis',
      'America/Inuvik',
      'America/Iqaluit',
      'America/Jamaica',
      'America/Jujuy',
      'America/Juneau',
      'America/Kentucky/Louisville',
      'America/Kentucky/Monticello',
      'America/Knox_IN',
      'America/La_Paz',
      'America/Lima',
      'America/Los_Angeles',
      'America/Louisville',
      'America/Maceio',
      'America/Managua',
      'America/Manaus',
      'America/Marigot',
      'America/Martinique',
      'America/Matamoros',
      'America/Mazatlan',
      'America/Mendoza',
      'America/Menominee',
      'America/Merida',
      'America/Mexico_City',
      'America/Miquelon',
      'America/Moncton',
      'America/Monterrey',
      'America/Montevideo',
      'America/Montreal',
      'America/Montserrat',
      'America/Nassau',
      'America/New_York',
      'America/Nipigon',
      'America/Nome',
      'America/Noronha',
      'America/North_Dakota/Center',
      'America/North_Dakota/New_Salem',
      'America/Ojinaga',
      'America/Panama',
      'America/Pangnirtung',
      'America/Paramaribo',
      'America/Phoenix',
      'America/Port-au-Prince',
      'America/Port_of_Spain',
      'America/Porto_Acre',
      'America/Porto_Velho',
      'America/Puerto_Rico',
      'America/Rainy_River',
      'America/Rankin_Inlet',
      'America/Recife',
      'America/Regina',
      'America/Resolute',
      'America/Rio_Branco',
      'America/Rosario',
      'America/Santa_Isabel',
      'America/Santarem',
      'America/Santiago',
      'America/Santo_Domingo',
      'America/Sao_Paulo',
      'America/Scoresbysund',
      'America/Shiprock',
      'America/St_Barthelemy',
      'America/St_Johns',
      'America/St_Kitts',
      'America/St_Lucia',
      'America/St_Thomas',
      'America/St_Vincent',
      'America/Swift_Current',
      'America/Tegucigalpa',
      'America/Thule',
      'America/Thunder_Bay',
      'America/Tijuana',
      'America/Toronto',
      'America/Tortola',
      'America/Vancouver',
      'America/Virgin',
      'America/Whitehorse',
      'America/Winnipeg',
      'Asia/Aden',
      'Asia/Almaty',
      'Asia/Amman',
      'Asia/Anadyr',
      'Asia/Aqtau',
      'Asia/Aqtobe',
      'Asia/Ashgabat',
      'Asia/Ashkhabad',
      'Asia/Baghdad',
      'Asia/Bahrain',
      'Asia/Baku',
      'Asia/Bangkok',
      'Asia/Beirut',
      'Asia/Bishkek',
      'Asia/Brunei',
      'Asia/Calcutta',
      'Asia/Choibalsan',
      'Asia/Chongqing',
      'Asia/Chungking',
      'Asia/Colombo',
      'Asia/Dacca',
      'Asia/Damascus',
      'Asia/Dhaka',
      'Asia/Dili',
      'Asia/Dubai',
      'Asia/Dushanbe',
      'Asia/Gaza',
      'Asia/Harbin',
      'Asia/Ho_Chi_Minh',
      'Asia/Hong_Kong',
      'Asia/Hovd',
      'Asia/Irkutsk',
      'Asia/Istanbul',
      'Asia/Jakarta',
      'Asia/Jayapura',
      'Asia/Jerusalem',
      'Asia/Kabul',
      'Asia/Kamchatka',
      'Asia/Karachi',
      'Asia/Kashgar',
      'Asia/Kathmandu',
      'Asia/Katmandu',
      'Asia/Kolkata',
      'Asia/Krasnoyarsk',
      'Asia/Kuala_Lumpur',
      'Asia/Kuching',
      'Asia/Kuwait',
      'Asia/Macao',
      'Asia/Macau',
      'Asia/Magadan',
      'Asia/Makassar',
      'Asia/Manila',
      'Asia/Muscat',
      'Asia/Nicosia',
      'Asia/Novokuznetsk',
      'Asia/Novosibirsk',
      'Asia/Omsk',
      'Asia/Oral',
      'Asia/Phnom_Penh',
      'Asia/Pontianak',
      'Asia/Pyongyang',
      'Asia/Qatar',
      'Asia/Qyzylorda',
      'Asia/Rangoon',
      'Asia/Riyadh',
      'Asia/Saigon',
      'Asia/Sakhalin',
      'Asia/Samarkand',
      'Asia/Seoul',
      'Asia/Shanghai',
      'Asia/Singapore',
      'Asia/Taipei',
      'Asia/Tashkent',
      'Asia/Tbilisi',
      'Asia/Tehran',
      'Asia/Tel_Aviv',
      'Asia/Thimbu',
      'Asia/Thimphu',
      'Asia/Tokyo',
      'Asia/Ujung_Pandang',
      'Asia/Ulaanbaatar',
      'Asia/Ulan_Bator',
      'Asia/Urumqi',
      'Asia/Vientiane',
      'Asia/Vladivostok',
      'Asia/Yakutsk',
      'Asia/Yekaterinburg',
      'Asia/Yerevan',
      'Europe/Amsterdam',
      'Europe/Andorra',
      'Europe/Athens',
      'Europe/Belfast',
      'Europe/Belgrade',
      'Europe/Berlin',
      'Europe/Bratislava',
      'Europe/Brussels',
      'Europe/Bucharest',
      'Europe/Budapest',
      'Europe/Chisinau',
      'Europe/Copenhagen',
      'Europe/Dublin',
      'Europe/Gibraltar',
      'Europe/Guernsey',
      'Europe/Helsinki',
      'Europe/Isle_of_Man',
      'Europe/Istanbul',
      'Europe/Jersey',
      'Europe/Kaliningrad',
      'Europe/Kiev',
      'Europe/Lisbon',
      'Europe/Ljubljana',
      'Europe/London',
      'Europe/Luxembourg',
      'Europe/Madrid',
      'Europe/Malta',
      'Europe/Mariehamn',
      'Europe/Minsk',
      'Europe/Monaco',
      'Europe/Moscow',
      'Europe/Nicosia',
      'Europe/Oslo',
      'Europe/Paris',
      'Europe/Podgorica',
      'Europe/Prague',
      'Europe/Riga',
      'Europe/Rome',
      'Europe/Samara',
      'Europe/San_Marino',
      'Europe/Sarajevo',
      'Europe/Simferopol',
      'Europe/Skopje',
      'Europe/Sofia',
      'Europe/Stockholm',
      'Europe/Tallinn',
      'Europe/Tirane',
      'Europe/Tiraspol',
      'Europe/Uzhgorod',
      'Europe/Vaduz',
      'Europe/Vatican',
      'Europe/Vienna',
      'Europe/Vilnius',
      'Europe/Volgograd',
      'Europe/Warsaw',
      'Europe/Zagreb',
      'Europe/Zaporozhye',
      'Europe/Zurich',
      'UTC',
    ];
  }

}
