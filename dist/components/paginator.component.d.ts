import { NgTable } from './table.component';
import { MdSelectChange } from '@angular/material';
export declare class NgTablePaginator {
    table: NgTable;
    private _rangeVisible;
    private _label;
    label: Object;
    ngTable: NgTable;
    rangeVisible: boolean;
    actionRange(e: MdSelectChange): void;
}
