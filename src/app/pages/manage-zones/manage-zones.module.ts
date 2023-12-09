
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageZonesRoutingModule } from './manage-zones-routing.module';
import { ManageZonesComponent } from './manage-zones.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageZonesComponent],
  imports: [
    CommonModule,
    ManageZonesRoutingModule,
    SharedModule,
  ]
})
export class ManageZonesModule { }
