import { Injectable } from '@angular/core';
import { NgTableSource, NgTableSourceResult, INgTableSourceParams } from '../../ngtable.wrapper';
import { HttpClient } from '../services/httpClient.service';

export type SortSourceOrder = 'asc' | 'desc';

export class SortSourceSort {
  public static readonly asc: SortSourceOrder = 'asc';
  public static readonly desc: SortSourceOrder = 'desc';
}

export class SortSourceParams implements INgTableSourceParams {

  offset: number = 0;
  sort: string = '';
  order: SortSourceOrder = SortSourceSort.asc;

}

@Injectable()
export class SortSource extends NgTableSource {

  constructor(private httpClient: HttpClient) {
    super();

    this.params = new SortSourceParams;
  }

  protected source(params: SortSourceParams): void {
    this.httpClient.request({
      method: 'GET',
      url: 'rest'
    }).subscribe(response => {
      let data = response.json();

      if (params.sort != '') {
        data.sort((i1, i2) => {
          let v1: any = i1[params.sort];
          let v2: any = i2[params.sort];

          if (v1 > v2) {
            return params.order == SortSourceSort.asc ? 1 : -1;
          }

          if (v1 < v2) {
            return params.order == SortSourceSort.asc ? -1 : 1;
          }

          return 0;
        });
      }

      this.updateData(NgTableSourceResult.singlePage(this, data));
    });
  }

}
