import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCuisinesRoutingModule } from './manage-cuisines-routing.module';
import { ManageCuisinesComponent } from './manage-cuisines.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageCuisinesComponent],
  imports: [
    CommonModule,
    ManageCuisinesRoutingModule,
    SharedModule,
  ]
})
export class ManageCuisinesModule { }
