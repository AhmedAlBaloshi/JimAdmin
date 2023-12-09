import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCuisinesComponent } from './manage-cuisines.component';


const routes: Routes = [
  {
    path: '',
    component: ManageCuisinesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCuisinesRoutingModule { }
