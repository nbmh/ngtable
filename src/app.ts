import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgTable } from './components/table.component';
import { NgTableHeaderRow } from './components/header-row.component';
import { NgTableHeaderCell } from './components/header-cell.component';
import { NgTableRow } from './components/row.component';
import { NgTableCell } from './components/cell.component';
import { NgTablePaginator } from './components/paginator.component';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

export { NgTableInitEvent, NgTableDestroyEvent, NgTableBeforeConnectEvent, NgTableAfterConnectEvent, NgTableRangeEvent } from './ngtable.events';
export { NgTableSource } from './ngtable.source';
export { INgTableSourceParams } from './ngtable.params';
export { NgTableSourceResult } from './ngtable.result';
export { NgTable } from './components/table.component';
export { NgTableHeaderRow } from './components/header-row.component';
export { NgTableHeaderCell } from './components/header-cell.component';
export { NgTableRow } from './components/row.component';
export { NgTableCell } from './components/cell.component';
export { NgTablePaginator } from './components/paginator.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class NgTableRoutingModule { }

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    NgTableRoutingModule
  ],
  declarations: [
    NgTable,
    NgTableHeaderRow,
    NgTableHeaderCell,
    NgTableRow,
    NgTableCell,
    NgTablePaginator
  ],
  providers: [

  ],
  exports: [
    NgTable,
    NgTableHeaderRow,
    NgTableHeaderCell,
    NgTableRow,
    NgTableCell,
    NgTablePaginator
  ]
})
export class NgTableModule { }
