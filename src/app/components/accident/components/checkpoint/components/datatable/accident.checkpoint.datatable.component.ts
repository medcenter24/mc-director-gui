/*
 * Copyright (c) 2018.
 *
 * @author Zagovorychev Olexandr <zagovorichev@gmail.com>
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableCol } from '../../../../../ui/datatable';
import { DatatableConfig } from '../../../../../ui/datatable';
import { DatatableAction } from '../../../../../ui/datatable';
import { TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from '../../../../../core/components/componentLoader';
import { Logger } from 'angular2-logger/core';
import { GlobalState } from '../../../../../../global.state';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { DatatableComponent } from '../../../../../ui/datatable';
import { AccidentCheckpoint } from '../../checkpoint';
import { AccidentCheckpointsService } from '../../checkpoints.service';

@Component({
  selector: 'nga-accident-checkpoint-datatable',
  templateUrl: './accident.checkpoint.datatable.html',
})
export class AccidentCheckpointDatatableComponent extends LoadingComponent implements OnInit {

  protected componentName: string = 'AccidentCheckpointDatatableComponent';

  @ViewChild('datatable')
  private datatable: DatatableComponent;

  datatableConfig: DatatableConfig;
  langLoaded: boolean = false;
  displayDialog: boolean = false;
  checkpoint: AccidentCheckpoint;

  constructor(
    protected _logger: Logger,
    protected _state: GlobalState,
    protected loadingBar: SlimLoadingBarService,
    private translateService: TranslateService,
    private checkpointService: AccidentCheckpointsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.translateService.get('Yes').subscribe(() => {
      this.langLoaded = true;
      const cols = [
        new DatatableCol('title', this.translateService.instant('Title')),
        new DatatableCol('description', this.translateService.instant('Description')),
      ];

      this.datatableConfig = DatatableConfig.factory({
        dataProvider: (filters: Object) => {
          return this.checkpointService.search(filters);
        },
        cols,
        refreshTitle: this.translateService.instant('Refresh'),
        controlPanel: true,
        controlPanelActions: [
          new DatatableAction(this.translateService.instant('Add'), 'fa fa-plus', () => {
            this.showDialogToAdd();
          }),
        ],
        onRowSelect: event => {
          this.onRowSelect(event);
        },
        sort: true,
        sortBy: 'title',
      });
    });
  }

  showDialogToAdd() {
    this.setCheckpoint(new AccidentCheckpoint());
    this.displayDialog = true;
  }

  private setCheckpoint(checkpoint: AccidentCheckpoint = null): void {
    this.checkpoint = checkpoint;
  }

  onRowSelect(event) {
    this.setCheckpoint(this.cloneCheckpoint(event.data));
    this.displayDialog = true;
  }

  private cloneCheckpoint(checkpoint: AccidentCheckpoint): AccidentCheckpoint {
    const checkpoint1 = new AccidentCheckpoint();
    for (const prop of Object.keys(checkpoint)) {
      checkpoint1[prop] = checkpoint[prop];
    }
    return checkpoint1;
  }

  onChanged(event): void {
    this.displayDialog = false;
    this.datatable.refresh();
  }

  delete () {
    this._state.notifyDataChanged('confirmDialog',
      {
        header: this.translateService.instant('Delete'),
        message: this.translateService.instant('Are you sure that you want to delete this checkpoint?'),
        accept: () => {
          const postfix = 'Delete';
          this.startLoader(postfix);
          this.checkpointService.destroy(this.checkpoint)
            .then(() => {
              this.stopLoader(postfix);
              this.setCheckpoint();
              this.displayDialog = false;
              this.datatable.refresh();
            })
            .catch(() => this.stopLoader(postfix));
        },
        icon: 'fa fa-window-close-o red',
      },
    );
  }

  save () {
    const postfix = 'Save';
    this.startLoader(postfix);
    this.checkpointService.save(this.checkpoint)
      .then(() => {
        this.stopLoader(postfix);
        this.setCheckpoint();
        this.displayDialog = false;
        this.datatable.refresh();
      })
      .catch(() => this.stopLoader(postfix));
  }
}
