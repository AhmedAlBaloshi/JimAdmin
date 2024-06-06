import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-drivers',
  templateUrl: './manage-drivers.component.html',
  styleUrls: ['./manage-drivers.component.scss']
})
export class ManageDriversComponent implements OnInit {
  cities: any[] = [];
  new: boolean = false;
  zones: any[] = [];
  id: any;
  fname: any = '';
  lname: any = '';
  email: any = '';
  password: any = '';
  mobile: any;
  city: any;
  coverImage: any = '';
  status: any = '';
  address: any = '';
  lat: any = '';
  working_start_time: any = '';
  working_end_time: any = '';
  maximumOrders: any = '';
  lng: any = '';
  zone: any = '';
  gender: any = '1';
  country_code: any;
  imageUrl: any;

  orders: any[] = [];
  reviews: any[] = [];

  userType = localStorage.getItem('type')

  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    public util: UtilService
  ) {

    if(this.userType === 'agent'){
      this.city = localStorage.getItem('city')
      this.getZones()
      this.zone = localStorage.getItem('zone_id')
    }
    this.api.auth();
    this.route.queryParams.subscribe((data: any) => {
      this.new = data.register === 'true' ? true : false;
      if (!this.new && data.id) {
        this.id = data.id;
        this.getDriver();
        this.getOrders();
      }
      this.getCity();
    });
  }

  getDriver() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('drivers/getById', param).then((data: any) => {
      this.spinner.hide();
      if (data && data.status === 200 && data.data.length) {
        const info = data.data[0];
        this.fname = info.first_name;
        this.lname = info.last_name;
        this.email = info.email;
        this.city = info.city;
        this.zone = info.zone;
        this.gender = info.gender;
        this.working_start_time = info.working_start_time;
        this.working_end_time = info.working_end_time;
        this.coverImage = info.cover;
        this.imageUrl = this.api.mediaURL + this.coverImage;
        this.mobile = info.mobile;
        this.maximumOrders = info.others;
        this.lat = info.lat;
        this.lng = info.lng;
        this.address = info.address;
        this.country_code = info.country_code;
        this.country_code = this.country_code.replace('+', '');
        this.getZones()

      } else {
        this.error('Something went wrong');
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    });
  }

  ngOnInit(): void {
  }

  getZones() {
    this.zones = []
    this.api
      .get('zones/getAllZones?city_id='+this.city)
      .then(
        (data: any) => {
          // console.log(data);
          if (data && data.status === 200 && data.data.length) {
            this.zones = data.data;
            console.warn(
              '---------------------------------------------' + this.zones
            );
          }
        },
        (error) => {
          console.log(error);
          this.error('Something went wrong');
        }
      )
      .catch((error) => {
        console.log(error);
        this.error('Something went wrong');
      });
  }

  getCity() {
    this.api.get('cities').then((datas: any) => {
      console.log(datas);
      if (datas && datas.status === 200 && datas.data.length) {
        this.cities = datas.data;
      }
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  getOrders() {
    const param = {
      id: this.id
    };
    this.api.post('orders/getByDriverIdForAdmin', param).then((data: any) => {
      let total = 0;
      if (data && data.status === 200 && data.data.length > 0) {
        data.data.forEach(async (element) => {
          element.grand_total = (+element.grand_total).toFixed(3);
          total = total + parseFloat(element.total);
          element.orders = JSON.parse(element.orders);
          this.orders.push(element);
        });
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
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
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  create() {
    if (this.email === '' || this.password === '' || this.fname === '' || this.lname === '' || this.gender === '' ||
      this.mobile === '' || !this.mobile || this.country_code === ''|| this.zone === '' || this.working_start_time === '' ||this.working_end_time === '') {
      this.error('All Fields are required');
      return false;
    }
    if(this.working_start_time >= this.working_end_time){
      this.error('The working end time must be later than the working start time');
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.error('Please enter valid email');
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.error('Please add your cover image');
      return false;
    }
    this.spinner.show();
    const param = {
      first_name: this.fname,
      last_name: this.lname,
      email: this.email,
      password: this.password,
      city: this.city,
      gender: this.gender,
      address: this.address,
      working_start_time: this.working_start_time,
      working_end_time: this.working_end_time,
      lat: this.lat,
      lng: this.lng,
      mobile: this.mobile,
      status: 1,
      cover: this.coverImage,
      others: this.maximumOrders,
      date: moment().format('YYYY-MM-DD'),
      last_active: 0,
      language: '',
      zone: this.zone,
      fcm_token: '',
      current: 'active',
      rating: 0,
      total_rating: 0,
      country_code: '+' + this.country_code
    };

    this.spinner.show();
    this.api.post('drivers/registerUser', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.data && data.status === 200) {
        this.navCtrl.back();
      } else {
        if (data && data.data && data.data.message) {
          this.error(data.data.message);
          return false;
        }
        this.error(data.message);
        return false;
      }
    });
  }

  preview_banner(files) {
    console.log('fle', files);
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    if (files) {
      console.log('ok');
      this.spinner.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        console.log('==>>', data);
        this.spinner.hide();
        if (data && data.status === 200 && data.data) {
          // this.fileURL = data.data;
          this.coverImage = data.data;
          this.imageUrl = this.api.mediaURL + this.coverImage;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }

  update() {
    if (this.fname === '' || this.lname === '' || this.gender === '' ||
      this.mobile === '' || !this.mobile || this.country_code === '' || this.zone === '' || this.working_start_time === '' ||this.working_end_time === '') {
      this.error('All Fields are required');
      return false;
    }
    if(this.working_start_time >= this.working_end_time){
      this.error('The working end time must be later than the working start time');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.error('Please enter valid email');
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.error('Please add your cover image');
      return false;
    }
    this.spinner.show();
    const param = {
      first_name: this.fname,
      last_name: this.lname,
      city: this.city,
      gender: this.gender,
      address: this.address,
      working_start_time: this.working_start_time,
      working_end_time: this.working_end_time,
      lat: this.lat,
      lng: this.lng,
      mobile: this.mobile,
      cover: this.coverImage,
      zone: this.zone,
      others: this.maximumOrders,
      id: this.id,
      country_code: '+' + this.country_code
    };

    this.api.post('drivers/edit_profile', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.data && data.status === 200) {
        this.navCtrl.back();
      } else {
        if (data && data.data && data.data.message) {
          this.error(data.data.message);
          this.navCtrl.back();
          return false;
        }
        this.navCtrl.back();
        this.error(data.message);
        return false;
      }
    });
  }
}
