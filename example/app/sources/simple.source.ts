import { Injectable } from '@angular/core';
import { NgTableSource, NgTableSourceResult, INgTableSourceParams } from '../../ngtable.wrapper';
import { HttpClient } from '../services/httpClient.service';

export class SimpleSourceParams implements INgTableSourceParams {

  offset: number = 0;

}

@Injectable()
export class SimpleSource extends NgTableSource {

  constructor(private httpClient: HttpClient) {
    super();

    this.params = new SimpleSourceParams;
  }

  protected source(params: SimpleSourceParams): void {
    this.httpClient.request({
      method: 'GET',
      url: 'rest'
    }).subscribe(response => {
      let data = response.json();

      this.updateData(new NgTableSourceResult(data, data.length));
    });
  }

}
