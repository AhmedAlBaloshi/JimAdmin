import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertNotificationComponent } from './alert-notification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


const routes: Routes = [
  {
    path: '',
    component: AlertNotificationComponent
  }
];

@NgModule({
  declarations: [AlertNotificationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    CKEditorModule,
    NgMultiSelectDropDownModule
  ]
})
export class AlertNotificationModule { }
