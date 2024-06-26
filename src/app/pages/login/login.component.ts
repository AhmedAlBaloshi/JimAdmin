import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: any = '';
  password: any = '';
  selected: any;
  constructor(
    private router: Router,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    public util: UtilService
  ) {}

  ngOnInit(): void {}
  login() {
    if (
      !this.email ||
      this.email === '' ||
      !this.password ||
      this.password === ''
    ) {
      this.error('All Fields are required');
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error('Please enter valid email');
      return false;
    }
    const param = {
      email: this.email,
      password: this.password,
    };
    this.spinner.show();
    this.api
      .post('users/login', param)
      .then((data: any) => {
        console.log('datas', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          if (data && data.data && data.data.type) {
            if(data.data.status == 1 && data.data.deleted_at == null){
            if (
              data.data.type === 'admin' ||
              data.data.type === 'branch_manager' ||
              data.data.type === 'agent'||
              data.data.type === 'store'
            ) {
              localStorage.setItem('full_name', data.data.full_name+data.data.last_name);
              localStorage.setItem('uid', data.data.id);
              localStorage.setItem('type', data.data.type);
              localStorage.setItem('zone_id', data.data.zone_id);
              localStorage.setItem('city', data.data.city);
              localStorage.setItem('status', 'signedin');
              this.router.navigate(['']);
            } else {
              this.error(this.api.translate('access denied'));
              return false;
            }
          }
          else{
            this.error(this.api.translate('access denied'))
          }
          } else {
            this.error(this.api.translate('access denied'));
            return false;
          }
        } else if (data && data.status === 500) {
          if (data.data && data.data.message) {
            this.error(data.data.message);
          } else {
            this.error(this.api.translate('Something went wrong'));
          }
        } else {
          this.error(this.api.translate('Something went wrong'));
        }
      })
      .catch((error) => {
        this.spinner.hide();
        console.log('errror', error);
        this.error(this.api.translate('Something went wrong'));
      });
    // localStorage.setItem('uid', 'admin');
    // localStorage.setItem('type', 'admin');
    // this.router.navigate(['admin']);
  }

  error(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Error'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      },
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }
  success(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Success'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      },
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  changeLng(item) {
    console.log(item);
    localStorage.setItem('language', item.file);
    window.location.reload();
  }
}
