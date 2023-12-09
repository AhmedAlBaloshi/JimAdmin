
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinorCategoriesRoutingModule } from './minor-categories-routing.module';
import { MinorCategoriesComponent } from './minor-categories.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [MinorCategoriesComponent],
  imports: [
    CommonModule,
    MinorCategoriesRoutingModule,
    SharedModule
  ]
})
export class MinorCategoriesModule { }
