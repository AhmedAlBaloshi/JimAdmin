import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css'],
})
export class ManageAdminComponent implements OnInit {
  banner_to_upload: any;
  fileURL: any;
  cities: any[] = [];
  zones: any[] = [];
  new: boolean;
  branchManager: boolean = false;
  isAgent: boolean = false;
  id: any;
  fname: any = '';
  lname: any = '';
  email: any = '';
  password: any = '';
  mobile: any;
  fname2: any = '';
  lname2: any = '';
  email2: any = '';
  password2: any = '';
  mobile2: any;
  city: any = '';
  zone_id: any = '';
  coverImage: any = 'NA';
  status: any = '';
  address: any = '';
  lat: any = '';
  others: any = '';
  lng: any = '';
  gender: any = '1';
  gender2: any = '1';

  shift_start:any;
  shift_start2:any;
  shift_end:any;
  shift_end2:any;

  imageUrl: any;
  mobileCcode: any = this.api.default_country_code;
  mobileCcode2: any = this.api.default_country_code;
  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    public util: UtilService
  ) {
    this.api.auth();
    this.route.queryParams.subscribe((data: any) => {
      this.new = data.register === 'true' ? true : false;
      this.branchManager = data.branch_manager === 'true' ? true : false;
      this.isAgent = data.agent === 'true' ? true : false;

      if (this.isAgent) {
        this.getCities();
      }

      if (!this.new && data.id) {
        this.id = data.id;
        this.getAdmin();
      }
    });
  }

  getAdmin() {
    const param = {
      id: this.id,
    };
    this.spinner.show();
    this.api
      .post('users/getById', param)
      .then(
        (data: any) => {
          console.log(data);
          this.spinner.hide();
          if (data && data.status === 200 && data.data.length) {
            const info = data.data[0];
            this.fname = info.full_name;
            this.lname = info.last_name;
            this.email = info.email;
            this.city = info.city;
            this.zone_id = info.zone_id;
            this.gender = info.gender;
            this.coverImage = info.cover;
            this.imageUrl = this.api.mediaURL + this.coverImage;
            this.mobile = info.mobile;
            this.others = info.others;
            this.lat = info.lat;
            this.lng = info.lng;
            this.address = info.address;
            this.shift_start = info.shift_start;
            this.shift_end = info.shift_end;

            this.getZones();
          } else {
            this.error('Something went wrong');
          }
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          this.error('Something went wrong');
        }
      )
      .catch((error) => {
        console.log(error);
        this.spinner.hide();
        this.error('Something went wrong');
      });
  }

  getCities() {
    this.api
      .get('cities')
      .then(
        (data: any) => {
          // console.log(data);
          if (data && data.status === 200 && data.data.length) {
            this.cities = data.data;
            console.warn(
              '---------------------------------------------' + this.cities
            );
          } else {
            this.error('Something went wrong');
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

  getZones() {
    this.zones = [];
    this.api
      .get('zones/getAllZones?city_id=' + this.city)
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

  ngOnInit(): void {}

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
      },
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
      },
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  create() {
    if (this.isAgent) {
      this.createSecondAgent();
    }
    console.log(this.coverImage);
    if (
      this.email === '' ||
      this.password === '' ||
      this.fname === '' ||
      this.lname === '' ||
      this.gender === '' ||
      this.mobile === '' ||
      !this.mobile ||
      this.coverImage === ''
    ) {
      this.error('All Fields are required');
      return false;
    }
    if (this.isAgent) {
      if (this.city === '' || this.zone_id === '' ||
      !this.shift_start ||
      !this.shift_end) {
        this.error('All Fields are required');
        return false;
      }

    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error('Please enter valid email');
      return false;
    }

    this.spinner.show();

    this.lat = '';
    this.lng = '';
    console.log('----->', this.lat, this.lng);
    let user_type = 'admin';
    let role_id = 1;
    if (this.branchManager) {
      user_type = 'branch_manager';
      role_id = 5;
    } else if (this.isAgent) {
      user_type = 'agent';
      role_id = 6;
    }

    const param = {
      full_name: this.fname,
      last_name: this.lname,
      gender: 1,
      email: this.email,
      password: this.password,
      type: user_type,
      created_by: this.isAgent ? localStorage.getItem('uid') : null,
      status: 1,
      lat: '0',
      lng: '0',
      cover: this.coverImage,
      mobile: this.mobile,
      verified: 1,
      fcm_token: 'NA',
      others: '1',
      date: moment().format('YYYY-MM-DD'),
      stripe_key: '',
      city: this.isAgent ? this.city : null,
      zone_id: this.isAgent ? this.zone_id : null,
      role_id: role_id,
      shift_start: this.shift_start,
      shift_end: this.shift_end,
      country_code: '+' + this.mobileCcode,
    };
    console.log('patrama-----------------' + JSON.stringify(param));
    this.spinner.show();
    this.api.post('users/registerUser', param).then((data: any) => {
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

  update() {
    if (
      this.fname === '' ||
      this.lname === '' ||
      this.gender === '' ||
      this.mobile === '' ||
      !this.mobile ||
      this.coverImage === ''
    ) {
      this.error('All Fields are required');
      return false;
    }
    if (this.isAgent) {
      if (this.city === '' || this.zone_id === '' || this.zone_id == null|| !this.shift_end || !this.shift_start) {
        this.error('All Fields are required');
        return false;
      }
      if(this.shift_start >= this.shift_end){
        this.error('The shift end time must be later than the shift start time');
        return false;
      }
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error('Please enter valid email');
      return false;
    }

    this.spinner.show();

    this.lat = '';
    this.lng = '';
    console.log('----->', this.lat, this.lng);

    let user_type = 'admin';
    let role_id = 1;
    if (this.branchManager) {
      user_type = 'branch_manager';
      role_id = 5;
    } else if (this.isAgent) {
      user_type = 'agent';
      role_id = 6;
    }

    const param = {
      full_name: this.fname,
      last_name: this.lname,
      gender: this.gender,
      lat: this.lat,
      lng: this.lng,
      city: this.city,
      cover: this.coverImage,
      type: user_type,
      zone_id: this.zone_id,
      mobile: this.mobile,
      others: this.others,
      shift_start: this.shift_start,
      shift_end: this.shift_end,
      id: this.id,
    };

    this.api.post('users/edit_profile', param).then((data: any) => {
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

  preview_banner(files) {
    this.banner_to_upload = [];
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;

    this.banner_to_upload = files;
    if (this.banner_to_upload) {
      this.spinner.show();
      this.api.uploadFile(this.banner_to_upload).subscribe(
        (data: any) => {
          this.spinner.hide();
          if (data && data.status === 200 && data.data) {
            this.fileURL = data.data;
            this.coverImage = environment.mediaURL + data.data;
          }
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
        }
      );
    } else {
      console.log('no');
    }
  }

  createSecondAgent() {
    if (this.isAgent) {
    }
    console.log(this.coverImage);
    if (
      this.email === '' ||
      this.password === '' ||
      this.fname === '' ||
      this.lname === '' ||
      this.gender === '' ||
      this.mobile === '' ||
      !this.mobile ||
      this.coverImage === ''
    ) {
      this.error('All Fields are required');
      return false;
    }
    if (this.isAgent) {
      if (this.city === '' || this.zone_id === '' || !this.shift_start || !this.shift_end) {
        this.error('All Fields are required');
        return false;
      }
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error('Please enter valid email');
      return false;
    }

    this.spinner.show();

    this.lat = '';
    this.lng = '';
    console.log('----->', this.lat, this.lng);
    let user_type = 'admin';
    let role_id = 1;
    if (this.branchManager) {
      user_type = 'branch_manager';
      role_id = 5;
    } else if (this.isAgent) {
      user_type = 'agent';
      role_id = 6;
    }

    const param = {
      full_name: this.fname2,
      last_name: this.lname2,
      gender: 1,
      email: this.email2,
      password: this.password2,
      type: user_type,
      created_by: this.isAgent ? localStorage.getItem('uid') : null,
      status: 1,
      lat: '0',
      lng: '0',
      cover: this.coverImage,
      mobile: this.mobile2,
      verified: 1,
      fcm_token: 'NA',
      others: '1',
      date: moment().format('YYYY-MM-DD'),
      stripe_key: '',
      city: this.isAgent ? this.city : null,
      zone_id: this.isAgent ? this.zone_id : null,
      role_id: role_id,
      shift_start: this.shift_start2,
      shift_end: this.shift_end2,
      country_code: '+' + this.mobileCcode2,
    };
    console.log('patrama-----------------' + JSON.stringify(param));
    this.spinner.show();
    this.api.post('users/registerUser', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
    });
  }
}
