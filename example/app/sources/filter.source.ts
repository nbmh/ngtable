import { Injectable } from '@angular/core';
import { NgTableSource, NgTableSourceResult, INgTableSourceParams } from '../../ngtable.wrapper';
import { HttpClient } from '../services/httpClient.service';

export class FilterSourceParams implements INgTableSourceParams {

  offset: number = 0;
  query: string = '';

}

@Injectable()
export class FilterSource extends NgTableSource {

  constructor(private httpClient: HttpClient) {
    super();

    this.params = new FilterSourceParams;
  }

  protected source(params: FilterSourceParams): void {
    this.httpClient.request({
      method: 'GET',
      url: 'rest'
    }).subscribe(response => {
      let data = response.json();
      let filtered: Array<any> = [];
      let query = params.query.toLowerCase();

      data.forEach(item => {
        if (params.query.length >= 2) {
          if (item.firstname.toLowerCase().indexOf(query) == -1 &&
            item.lastname.toLowerCase().indexOf(query) == -1 &&
            item.email.toLowerCase().indexOf(query) == -1) {
            return;
          }
        }
        filtered.push(item);
      });

      this.updateData(NgTableSourceResult.singlePage(this, filtered));
    });
  }

}
