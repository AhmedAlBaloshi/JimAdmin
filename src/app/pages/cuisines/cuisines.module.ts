
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuisinesRoutingModule } from './cuisines-routing.module';
import { CuisinesComponent } from './cuisines.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CuisinesComponent],
  imports: [
    CommonModule,
    CuisinesRoutingModule,
    SharedModule
  ]
})
export class CuisinesModule { }
