import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageStoresRoutingModule } from './manage-stores-routing.module';
import { ManageStoresComponent } from './manage-stores.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [ManageStoresComponent],
  imports: [
    CommonModule,
    ManageStoresRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule
  ]
})
export class ManageStoresModule { }
