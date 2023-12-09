
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MajorCategoriesRoutingModule } from './major-categories-routing.module';
import { MajorCategoriesComponent } from './major-categories.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [MajorCategoriesComponent],
  imports: [
    CommonModule,
    MajorCategoriesRoutingModule,
    SharedModule
  ]
})
export class MajorCategoriesModule { }
