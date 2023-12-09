import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCityRoutingModule } from './manage-city-routing.module';
import { ManageCityComponent } from './manage-city.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageCityComponent],
  imports: [
    CommonModule,
    ManageCityRoutingModule,
    SharedModule,
  ]
})
export class ManageCityModule { }
