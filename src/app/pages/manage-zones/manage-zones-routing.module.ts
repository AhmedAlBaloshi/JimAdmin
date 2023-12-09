
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageZonesComponent } from './manage-zones.component';


const routes: Routes = [
  {
    path: '',
    component: ManageZonesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageZonesRoutingModule { }
