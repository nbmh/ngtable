import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import 'hammerjs';
import {NgTableCell} from './components/cell.component';
import {NgTableHeaderCell} from './components/header-cell.component';
import {NgTableHeaderRow} from './components/header-row.component';
import {NgTableMore} from './components/more.component';
import {NgTablePaginator} from './components/paginator.component';
import {NgTableRow} from './components/row.component';
import {NgTable} from './components/table.component';


export {
  NgTableInitEvent,
  NgTableDestroyEvent,
  NgTableBeforeConnectEvent,
  NgTableAfterConnectEvent,
  NgTableRangeEvent
} from './ngtable.events';
export {NgTableSource} from './ngtable.source';
export {INgTableSourceParams} from './ngtable.params';
export {NgTableSourceResult} from './ngtable.result';
export {NgTable} from './components/table.component';
export {NgTableHeaderRow} from './components/header-row.component';
export {NgTableHeaderCell} from './components/header-cell.component';
export {NgTableRow} from './components/row.component';
export {NgTableCell} from './components/cell.component';
export {NgTablePaginator} from './components/paginator.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class NgTableRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgTableRoutingModule,
    FormsModule
  ],
  declarations: [
    NgTable,
    NgTableHeaderRow,
    NgTableHeaderCell,
    NgTableRow,
    NgTableCell,
    NgTablePaginator,
    NgTableMore
  ],
  providers: [],
  exports: [
    NgTable,
    NgTableHeaderRow,
    NgTableHeaderCell,
    NgTableRow,
    NgTableCell,
    NgTablePaginator,
    NgTableMore
  ]
})
export class NgTableModule {
}
