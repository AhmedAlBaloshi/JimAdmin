import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageOrdersComponent } from './manage-orders.component';


const routes: Routes = [
  {
    path: '',
    component: ManageOrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageOrdersRoutingModule { }
