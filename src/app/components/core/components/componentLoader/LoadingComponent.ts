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
import { LoadableComponent } from './LoadableComponent';
import { GlobalState } from '../../../../global.state';
import { LoggerComponent } from '../../logger/LoggerComponent';

/**
 * Pages could implement this realization to wait till all components will be loaded
 *
 * In case that loading block don't want to be used on each of using of this component that is the best solution
 * I mean that I don't need to use LoadingService or something similar
 */
@Injectable()
export abstract class LoadingComponent extends LoadableComponent {
    protected abstract componentName;

    protected abstract _logger: LoggerComponent;
    protected abstract _state: GlobalState;
    protected onComponentsLoadingCompleted(): void { }
    private componentsList: string[] = [];
    private loading: boolean = false;

    startLoader(postfix: string = ''): void {
        const name = `${this.componentName}${postfix}`;
        this._logger.debug(`+ ${name}`);

        this.loading = true;

        if (!this.componentsList.length) {
          // if I use here setTimeout it is an issue that startLoader works after the stop loader
          this._state.notifyDataChanged('blocker', true);
          this._state.notifyDataChanged('runLoadingProcess', true);
        }

        if (this.componentsList.indexOf(name) !== -1) {
            postfix = this.generateName(name);
        }

        this.componentsList.push(postfix);
    }

    stopLoader(postfix: string = ''): void {
        const name = `${this.componentName}${postfix}`;
        this._logger.debug(`- ${name}`);

        if (!this.deleteName(postfix)) {
            this._logger.error(`Loading is trying to stop component which has not been launched => ${name}`);
        }

        if (this.componentsList.length === 0) {
          this.loading = false;
          this._state.notifyDataChanged('blocker', false);
          this._state.notifyDataChanged('runLoadingProcess', false);
          this.onComponentsLoadingCompleted();
        }
    }

    hardStopAllLoaders(): void {
      this.componentsList.forEach((name: string) => {
        this.stopLoader(name);
      });
      this.componentsList = [];
      this.loading = false;
      this._state.notifyDataChanged('blocker', false);
      this._state.notifyDataChanged('runLoadingProcess', false);
    }

    isLoading(): boolean {
        return this.loading;
    }

    private deleteName(componentName: string): boolean {
        let deleted = false;
        const filtered = [];
        for (const name of this.componentsList) {
            if (name === componentName && !deleted) {
                deleted = true;
            } else {
                filtered.push(name);
            }
        }
        this.componentsList = filtered;
        return deleted;
    }

    private generateName(name: string): string {
        const defName = name;
        let i = 0;
        while (this.componentsList.indexOf(name) !== -1) {
            name = `${defName}_${++i}`;
        }
        return name;
    }
}
