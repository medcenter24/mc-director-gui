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

import { ObjectHelper } from '../../../helpers/object.helper';

export class Configurable {

  /**
   * List of fields that required for current configuration
   * @type {string[]}
   */
  protected static required: string[] = [];

  /**
   *
   * @param {Object} configuration
   * @param {Configurable} m Object
   * @returns {any}
   */
  static factory(configuration: Object, m: any): any {
    const config = m;
    if (configuration) {
      config.eachProp(prop => config.update(prop, configuration));
    }
    // check if all of the required configurations provided
    const missedConfigurations = this.checkRequired(config);
    if (missedConfigurations.length) {
      throw new Error(`This type of configuration `
        + `require this parameters to be filled: ${missedConfigurations.join(', ')}`);
    }

    return config;
  }

  /**
   * Checks if config doesn't have any of the required parameters
   * @param config
   * @returns {string[]}
   */
  private static checkRequired(config: any): string[] {
    const missed = [];
    this.required.forEach(v => {
      if (!config.hasOwnProperty(v) || !config[v]) {
        missed.push(v);
      }
    });
    return missed;
  }

  /**
   * To generate new Instance for the current class
   *
   * FYI I can't use Configurable instead of any because warning appears that inherited class not Configurable
   * something weird with syntax analyzer
   *
   * @param {Object} config
   * @returns {any}
   */
  static instance(config: Object = {}): any {

    /**
     * @type {any}
     */
    const selfModel: any = new this();
    return this.factory(config, selfModel);
  }

  update(key: string, fromConf: Object) {
    if (fromConf.hasOwnProperty(key)) {
      this[key] = fromConf[key];
    }
  }

  /**
   * apply method to each property
   * @param {Function} f
   */
  private eachProp(f: Function): void {
    ObjectHelper.eachProp(this, f);
  }
}
