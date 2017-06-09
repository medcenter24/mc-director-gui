/*
 * Copyright (c) 2017
 *
 *  @author Alexander Zagovorichev <zagovorichev@gmail.com>
 */

import {Injectable} from '@angular/core';
import {Headers, Http} from "@angular/http";
import { Media } from './media';
import { HttpService } from '../http/http.service';

@Injectable()
export class MediaService extends HttpService {

  protected getPrefix(): string {
    return 'director/media';
  }

  getUploaded(): Promise<any> {

    return this.http.get(this.getUrl(), {headers: this.getAuthHeaders()})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  deleteFile(id: number): Promise<void> {
    let url = `${this.getUrl()}/${id}`;
    return this.http.delete(url, {headers: this.getAuthHeaders()})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
