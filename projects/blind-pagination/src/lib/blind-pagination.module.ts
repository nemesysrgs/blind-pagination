import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MetroPaginationComponent } from './blind-pagination.component';



@NgModule({
  declarations: [MetroPaginationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [MetroPaginationComponent]
})
export class MetroPaginationModule { }
