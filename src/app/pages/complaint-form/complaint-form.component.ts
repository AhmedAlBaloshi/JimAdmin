import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-complaint-form',
  templateUrl: './complaint-form.component.html',
  styleUrls: ['./complaint-form.component.scss']
})
export class ComplaintFormComponent implements OnInit {

  title: any;
  descriptions: any;
  created_by:any = localStorage.getItem('uid');
  constructor(
    private spinner: NgxSpinnerService,
    public api: ApisService,
    private toastyService: ToastyService,
  ) {
    this.api.auth();
  }

  ngOnInit() {
  }
  create() {
    if (!this.title || !this.descriptions) {
      this.error(this.api.translate('All Fields are required'));
      return false;
    }
    const params:object = {
      created_by: this.created_by,
      title: this.title,
      description: this.descriptions
    }


    this.spinner.show();
    this.api.post('general/createComplaint', params).then((res: any) => {
      this.spinner.hide();
      if (res && res.data && res.status === 200) {
        this.success('Compaint sent to admin')
        this.title = '';
        this.descriptions = '';
      } else {
        if (res && res.data && res.data.message) {
          this.error(res.data.message);
          return false;
        }
        this.error(res.message);
        return false;
      }
    });
  }

  error(message) {
    const toastOptions: ToastOptions = {
      title: 'Error',
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }
  success(message) {
    const toastOptions: ToastOptions = {
      title: 'Success',
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

}
