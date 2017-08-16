import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgTable, NgTableBeforeConnectEvent, NgTableAfterConnectEvent } from '../../ngtable.wrapper';
import { SimpleSource } from '../sources/simple.source';
import { PaginationSource } from '../sources/pagination.source';
import { FilterSource, FilterSourceParams } from '../sources/filter.source';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  filterParams: FilterSourceParams = new FilterSourceParams;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('ngTablePagination') ngTablePagination: NgTable;

  constructor(private sourceSimple: SimpleSource, private sourcePagination: PaginationSource, private sourceFilter: FilterSource) {

  }

  ngOnInit() {
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(500)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.sourceFilter) { return; }
      this.filterParams.offset = 0;
      this.filterParams.query = this.filter.nativeElement.value;
      this.sourceFilter.params = this.filterParams;
    });
  }

  goToPage(page: number) {
    this.ngTablePagination.page = page;
  }

  resetFilter() {
    this.filterParams.query = '';
    this.sourceFilter.params = this.filterParams;
  }

}
