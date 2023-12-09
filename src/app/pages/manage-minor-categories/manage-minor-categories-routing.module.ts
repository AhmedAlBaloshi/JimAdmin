import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageMinorCategoriesComponent } from './manage-minor-categories.component';


const routes: Routes = [
  {
    path: '',
    component: ManageMinorCategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageMinorCategoriesRoutingModule { }
