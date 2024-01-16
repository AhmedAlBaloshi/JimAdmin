import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSortComponent } from './custom-sort.component';
import { AppWebRoutingModule } from '../app-web/app-web-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CustomSortComponent
  }
];

@NgModule({
  declarations: [CustomSortComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class CustomSortModule { }
