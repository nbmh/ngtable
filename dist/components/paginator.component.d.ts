import { NgTable } from './table.component';
import { MdSelectChange } from '@angular/material';
export declare class NgTablePaginator {
    table: NgTable;
    private _rangeVisible;
    ngTable: NgTable;
    rangeVisible: boolean;
    actionRange(e: MdSelectChange): void;
}
