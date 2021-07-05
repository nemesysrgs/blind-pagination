import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'blind-pagination',
  template: `
  <div class="align-items-center flex-wrap" [ngClass]="{'d-flex justify-content-between': showRightOptions, 'text-center': !showRightOptions}" *ngIf="totalRecords">
    <div class="d-flex flex-wrap py-2 mr-3"  [ngClass]="{'d-flex flex-wrap': showRightOptions}">
        <a href="javascript:void(0)" (click)="_go_first()" class="btn btn-icon btn-sm btn-light mr-2 my-1"><i class="ki ki-bold-double-arrow-back icon-xs"></i></a>
        <a href="javascript:void(0)" (click)="_sub_one()" class="btn btn-icon btn-sm btn-light mr-2 my-1"><i class="ki ki-bold-arrow-back icon-xs"></i></a>

        <a href="javascript:void(0)" class="btn btn-icon btn-sm border-0 btn-light btn-hover-primary mr-2 my-1" [ngClass]="{'active': current == ( page + 1 )}" *ngFor="let page of _get_pages();let i=index" (click)="_select_page(page)" >{{ page + 1 }}</a>

        <a href="javascript:void(0)" (click)="_add_one()" class="btn btn-icon btn-sm btn-light mr-2 my-1"><i class="ki ki-bold-arrow-next icon-xs"></i></a>
        <a href="javascript:void(0)" (click)="_go_last()" class="btn btn-icon btn-sm btn-light mr-2 my-1"><i class="ki ki-bold-double-arrow-next icon-xs"></i></a>
    </div>
    <div class="d-flex align-items-center py-3" *ngIf="showRightOptions">
        <div class="d-flex align-items-center" *ngIf="loading">
            <div class="mr-2 text-muted">Loading...</div>
            <div class="spinner mr-10"></div>
        </div>

        <select class="form-control form-control-sm font-weight-bold mr-4 border-0 bg-light" [formControl]='_rowsControl' *ngIf="showPageLimits" #limitSelector (change)="_select_limit( limitSelector.value )" style="width: 75px;">
            <option value='10'>10</option>
            <option value='25'>25</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
            <option value='1'>All records</option>
        </select>
        <span class="text-muted">Displaying {{ _rowsCount }} of {{ totalRecords }} records</span>
    </div>
  </div>
  <div class="alert alert-custom alert-notice alert-light-primary fade show" role="alert" *ngIf="!totalRecords">
      <div class="alert-icon"><i class="flaticon-warning"></i></div>
      <div class="alert-text"><b>Required parameters values not received!</b> <br>Please go to the <b><a href='https://blindtechstudio.atlassian.net/l/c/s1GoY5sw'>documentation page</a></b> to learn more about required parameters and functions of this component.</div>
  </div>
  `,
  styles: [
  ]
})
export class MetroPaginationComponent implements OnChanges {

  _minPage: number = 0;
  _maxPage: number = 0;
  _rowsControl = new FormControl();
  _rows:number = 10;
  _pages:number = 0;

  @Input() totalRecords:number = 0;
  @Input() current:number = 1;
  @Input() loading:boolean = false;
  @Input() maxShowPages:number = 5;
  @Input() showPageLimits:boolean = true;
  @Input() showRightOptions:boolean = true;

  @Output() onPageSelected:EventEmitter<number> = new EventEmitter<number>();
  @Output() onLimitSelected:EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnChanges(): void {
    if ( this.totalRecords ){
      if ( this._pages == 0 ) this._pages = Math.ceil(this.totalRecords / this._rows);
      this._set_limits()
      this._rowsControl.setValue(this._rows)
    }else {
      this.showRightOptions = false;
      console.warn("Required parameters values not received!", "Please go to the documentation page to learn more about required parameters and functions of this component.");
    }
    
  }

  get _rowsCount(){
    let _count = (this.current !== this._pages )? this._rows : (this.totalRecords - ( this.current * this._rows ));
    if (this.current == this._pages && _count == 0) _count = this._rows;  
    if (_count < 0) _count = (this.totalRecords - ( (this.current - 1) * this._rows)); 
    return _count;
  }

  _set_limits(){
    this._minPage = ( this.current > Math.trunc(this.maxShowPages / 2) ) ? ( ( this.current - Math.trunc(this.maxShowPages / 2) > (this._pages - this.maxShowPages +1 )  ) ? this._pages - this.maxShowPages : this.current - Math.ceil(this.maxShowPages / 2)) : 0;
    this._maxPage = ( (this.current + Math.trunc(this.maxShowPages / 2)) < this._pages ) ? ( ( (this.current + Math.floor(this.maxShowPages / 2)) < this.maxShowPages ) ? ((this.maxShowPages > this._pages)? this._pages : this.maxShowPages) : this.current + Math.floor(this.maxShowPages / 2) )-1 : this._pages - 1;
  }

  _get_pages(){
    let _pages = [];
    for( let i = 0;i <= this._pages; i++ ) if( this._into_range(i) )_pages.push(i);
    return _pages;
  }

  _into_range( page:number ){
    if ( page >= this._minPage && page <= this._maxPage ) return true;
    return false;
  }

  _select_page( pageIndex:number ){
    this.onPageSelected.emit( pageIndex + 1 );
  }

  _select_limit( pageLimit:any ){
    if ( pageLimit == 1 ) {
      this._rows = this.totalRecords;
      this._pages = 1;
    }
    else{
      this._rows = pageLimit;
      this._pages = Math.ceil(this.totalRecords / this._rows);
    }
    this._set_limits();
    this.onLimitSelected.emit( pageLimit );
  }

  _go_first(){
    this.onPageSelected.emit( 1 );
  }

  _go_last(){
    this.onPageSelected.emit( this._pages );
  }

  _add_one(){
    if ( this.current + 1 > this._pages ) this._go_last();
    else this._select_page( this.current );
  }

  _sub_one(){
    if ( this.current - 1 == 0 ) this._go_first();
    else this._select_page( this.current - 2 );
  }

}
