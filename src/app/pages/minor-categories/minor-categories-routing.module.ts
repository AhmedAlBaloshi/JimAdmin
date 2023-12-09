
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MinorCategoriesComponent } from './minor-categories.component';


const routes: Routes = [
  {
    path: '',
    component: MinorCategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinorCategoriesRoutingModule { }
