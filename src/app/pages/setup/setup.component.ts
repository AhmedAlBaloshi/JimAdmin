
import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  email: any = '';
  password: any = '';
  first_name: any = '';
  last_name: any = '';
  mobile: any = '';
  appName: any;
  mobileCcode: any = this.api.default_country_code;

  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private title: Title,
    public util: UtilService
  ) {
    this.appName = this.title.getTitle();
  }

  ngOnInit(): void {
  }

  login() {
    if (!this.first_name || !this.last_name || this.first_name === '' || this.last_name === ''
      || !this.email || this.email === '' || !this.password || this.password === '' || !this.mobile || this.mobile === '') {
      this.error('All Fields are required');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error('Please enter valid email');
      return false;
    }
    const param = {
      first_name: this.first_name,
      last_name: this.last_name,
      gender: 1,
      email: this.email,
      password: this.password,
      type: 'admin',
      status: 1,
      lat: '0',
      lng: '0',
      cover: 'NA',
      mobile: this.mobile,
      verified: 1,
      fcm_token: 'NA',
      others: '1',
      date: moment().format('YYYY-MM-DD'),
      stripe_key: '',
      country_code: '+' + this.mobileCcode
    };
    this.spinner.show();
    this.api.post('users/registerUser', param).then((data: any) => {
      this.spinner.hide();
      if (data && data.status === 200) {
        localStorage.setItem('uid', data.data.id);
        localStorage.setItem('type', 'admin');
        localStorage.setItem('status', 'signedin');
        this.router.navigate(['']);
      } else if (data && data.status === 500) {
        if (data.data && data.data.message) {
          this.error(data.data.message);
        } else {
          this.error(this.api.translate('Something went wrong'));
        }
      } else {
        this.error(this.api.translate('Something went wrong'));
      }
    }).catch(error => {
      this.spinner.hide();
      console.log('Error Msg', error);
      this.error(this.api.translate('Something went wrong'));
    });
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
      }
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
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }
}
