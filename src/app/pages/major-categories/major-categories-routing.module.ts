
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MajorCategoriesComponent } from './major-categories.component';


const routes: Routes = [
  {
    path: '',
    component: MajorCategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MajorCategoriesRoutingModule { }
