import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintFormComponent } from './complaint-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: ComplaintFormComponent
  }
];

@NgModule({
  declarations: [ComplaintFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ComplaintFormModule { }
