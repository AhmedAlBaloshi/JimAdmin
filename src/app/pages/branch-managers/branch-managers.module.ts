import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchManagersComponent } from './branch-managers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BranchManagersComponent
  }
];

@NgModule({
  declarations: [BranchManagersComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BranchManagersModule { }
