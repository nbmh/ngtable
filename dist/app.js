import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
export { NgTableSourceResult } from './ngtable.result';
export { NgTable } from './components/table.component';
export { NgTableHeaderRow } from './components/header-row.component';
export { NgTableHeaderCell } from './components/header-cell.component';
export { NgTableRow } from './components/row.component';
export { NgTableCell } from './components/cell.component';
export { NgTablePaginator } from './components/paginator.component';
var routes = [];
var NgTableRoutingModule = (function () {
    function NgTableRoutingModule() {
    }
    return NgTableRoutingModule;
}());
export { NgTableRoutingModule };
NgTableRoutingModule.decorators = [
    { type: NgModule, args: [{
                imports: [RouterModule.forRoot(routes)],
                exports: [RouterModule]
            },] },
];
/** @nocollapse */
NgTableRoutingModule.ctorParameters = function () { return []; };
var NgTableModule = (function () {
    function NgTableModule() {
    }
    return NgTableModule;
}());
export { NgTableModule };
NgTableModule.decorators = [
    { type: NgModule, args: [{
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
                providers: [],
                exports: [
                    NgTable,
                    NgTableHeaderRow,
                    NgTableHeaderCell,
                    NgTableRow,
                    NgTableCell,
                    NgTablePaginator
                ]
            },] },
];
/** @nocollapse */
NgTableModule.ctorParameters = function () { return []; };
//# sourceMappingURL=app.js.map