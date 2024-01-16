import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SilverDisplayComponent } from './silver-display.component';
import { RouterModule, Routes } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
  {
    path: '',
    component: SilverDisplayComponent
  }
];

@NgModule({
  declarations: [SilverDisplayComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule
  ]
})
export class SilverDisplayModule { }
