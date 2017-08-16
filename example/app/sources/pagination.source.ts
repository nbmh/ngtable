import { Injectable } from '@angular/core';
import { NgTableSource, NgTableSourceResult, INgTableSourceParams } from '../../ngtable.wrapper';
import { HttpClient } from '../services/httpClient.service';

export class PaginationSourceParams implements INgTableSourceParams {

  offset: number = 0;

}

@Injectable()
export class PaginationSource extends NgTableSource {

  constructor(private httpClient: HttpClient) {
    super();

    this.params = new PaginationSourceParams;
  }

  protected source(params: PaginationSourceParams): void {
    this.httpClient.request({
      method: 'GET',
      url: 'rest'
    }).subscribe(response => {
      let data = response.json();

      this.updateData(NgTableSourceResult.singlePage(this, data));
    });
  }

}
