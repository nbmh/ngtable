import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { NgTableModule } from '../ngtable.wrapper';

import { AppComponent } from './components/app.component';
import { SimpleSource } from './sources/simple.source';
import { PaginationSource } from './sources/pagination.source';
import { FilterSource, FilterSourceParams } from './sources/filter.source';
import { HttpClient } from './services/httpClient.service';

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
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
