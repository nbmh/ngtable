import { Injectable } from '@angular/core';
import { Http, RequestOptions, Request, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class HttpClient {

  constructor(private http: Http) {
  }

  wynik: any;
  request(requestConfig: {method: string; url: string; queryParams?: any; data?: any;}): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("Accept", '*/*');
    let tempUrl = '/euslugi-app/rest/';
    let requestOptions = new RequestOptions({
      method: requestConfig.method,
      url: '/' + requestConfig.url,
      headers: headers,
      body: JSON.stringify(requestConfig.data),
      params: requestConfig.queryParams
    });
    return this.http.request(new Request(requestOptions));
  };
}
