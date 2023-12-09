import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageMinorCategoriesRoutingModule } from './manage-minor-categories-routing.module';
import { ManageMinorCategoriesComponent } from './manage-minor-categories.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageMinorCategoriesComponent],
  imports: [
    CommonModule,
    ManageMinorCategoriesRoutingModule,
    SharedModule,
  ]
})
export class ManageMinorCategoriesModule { }
