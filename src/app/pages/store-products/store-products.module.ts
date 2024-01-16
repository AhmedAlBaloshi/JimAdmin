import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreProductsComponent } from './store-products.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
  {
    path: '',
    component: StoreProductsComponent
  }
];

@NgModule({
  declarations: [StoreProductsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    CKEditorModule,
    NgMultiSelectDropDownModule
  ]
})
export class StoreProductsModule { }
