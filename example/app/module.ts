import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MdButtonModule, MdCardModule, MdInputModule, MdSelectModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    HttpModule,
    MdSelectModule,
    MdInputModule,
    MdButtonModule,
    MdCardModule,
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
