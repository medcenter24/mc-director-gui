/*
 * Copyright (c) 2018.
 *
 * @author Zagovorychev Olexandr <zagovorichev@gmail.com>
 */

import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'nga-picture-uploader',
  styleUrls: ['./upload.picture.scss'],
  templateUrl: './upload.picture.html',
})
export class UploadPictureComponent {

  @Input() defaultPicture: string = '';
  @Input() picture: string = '';
  @Input() uploaderOptions: UploaderOptions;
  @Input() canDelete: boolean = true;
  @Input() eventToUpload: UploadInput;

  @ViewChild('fileUpload') _fileUpload: ElementRef;

  @Output() onDelete = new EventEmitter<any>();
  @Output() onUpload = new EventEmitter<any>();
  @Output() onUploadCompleted = new EventEmitter<any>();

  uploadInput: EventEmitter<UploadInput>;
  uploadInProgress: boolean;
  dragOver: boolean;

  constructor(private renderer: Renderer2) {
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  startUpload(): void {
    this.uploadInProgress = true;
    this.uploadInput.emit(this.eventToUpload);
    this.onUpload.emit();
  }

  stopUpload(file: UploadFile): void {
    this.uploadInProgress = false;
    this.removeAllFiles();
    this.onUploadCompleted.emit(file);
  }

  bringFileSelector(): boolean {
    const uploadEl = this.renderer.selectRootElement(this._fileUpload.nativeElement);
    uploadEl.click();
    return false;
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      this.startUpload();
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      this._changePicture(output.file);
      if (!this._canUploadOnServer()) {
        this.uploadInput.emit({ type: 'cancelAll' });
      }
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      this.stopUpload(output.file);
    } else if (output.type === 'removed') {
      this.picture = '';
      this.onDelete.emit('');
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  _changePicture(file: UploadFile): void {
    const reader = new FileReader();
    reader.addEventListener('load', (event: Event) => {
      this.picture = (<any> event.target).result;
    }, false);
    reader.readAsDataURL(file.nativeFile);
  }

  _canUploadOnServer(): boolean {
    return false; // return !this.eventToUpload.url;
  }

  removePicture(): boolean {
    this.picture = '';
    this.onDelete.emit('');
    return false;
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}
