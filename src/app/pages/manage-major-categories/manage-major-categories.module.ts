import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageMajorCategoriesRoutingModule } from './manage-major-categories-routing.module';
import { ManageMajorCategoriesComponent } from './manage-major-categories.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageMajorCategoriesComponent],
  imports: [
    CommonModule,
    ManageMajorCategoriesRoutingModule,
    SharedModule,
  ]
})
export class ManageMajorCategoriesModule { }
