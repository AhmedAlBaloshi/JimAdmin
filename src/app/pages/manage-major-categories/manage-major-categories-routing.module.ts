import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageMajorCategoriesComponent } from './manage-major-categories.component';


const routes: Routes = [
  {
    path: '',
    component: ManageMajorCategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageMajorCategoriesRoutingModule { }
