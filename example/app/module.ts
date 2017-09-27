import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import 'hammerjs';

import {NgTableModule} from '../ngtable.wrapper';

import {AppComponent} from './components/app.component';
import {HttpClient} from './services/httpClient.service';
import {FilterSource} from './sources/filter.source';
import {PaginationSource} from './sources/pagination.source';
import {SimpleSource} from './sources/simple.source';
import {SortSource} from './sources/sort.source';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    HttpModule,
    MaterialModule,
    NgTableModule
  ],
  providers: [
    SimpleSource,
    PaginationSource,
    FilterSource,
    SortSource,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
