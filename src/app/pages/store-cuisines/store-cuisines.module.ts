import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreCuisinesComponent } from './store-cuisines.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
  {
    path: '',
    component: StoreCuisinesComponent
  }
];


@NgModule({
  declarations: [StoreCuisinesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    CKEditorModule,
    NgMultiSelectDropDownModule
  ]
})
export class StoreCuisinesModule { }
