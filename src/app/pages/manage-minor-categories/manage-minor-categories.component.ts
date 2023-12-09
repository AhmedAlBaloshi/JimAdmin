import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-minor-categories',
  templateUrl: './manage-minor-categories.component.html',
  styleUrls: ['./manage-minor-categories.component.scss']
})
export class ManageMinorCategoriesComponent implements OnInit {
  new: boolean = false;
  id: any;
  name_en: any = '';
  name_ar: any = '';
  coverImage: any = '';
  status: any = '';
  imageUrl: any;

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
      if (!this.new && data.id) {
        this.id = data.id;
        this.getMinorCategories();
      }
    });
  }

  ngOnInit(): void {
  }

  getMinorCategories() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('minorcategories/getById', param).then((res: any) => {
      this.spinner.hide();
      if (res && res.status === 200 && res.data.length) {
        const info = res.data[0];
        this.name_en = info.name_en;
        this.name_ar = info.name_ar;
        this.coverImage = info.cover;
        this.imageUrl = this.api.mediaURL + this.coverImage;
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
    if (this.name_en === '' || this.name_ar === '') {
      this.error('All Fields are required');
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.error('Please add your cover image');
      return false;
    }
    this.spinner.show();
    const param = {
      name_en: this.name_en,
      name_ar: this.name_ar,
      status: 1,
      cover: this.coverImage
    };
    this.spinner.show();
    this.api.post('minorcategories/createCategory', param).then((res: any) => {
      this.spinner.hide();
      if (res && res.data && res.status === 200) {
        this.navCtrl.back();
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
      this.api.uploadFile(files).subscribe((res: any) => {
        this.spinner.hide();
        if (res && res.status === 200 && res.data) {
          // this.fileURL = data.data;
          this.coverImage = res.data;
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
    if (this.name_en === '' || this.name_ar === '') {
      this.error('All Fields are required');
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.error('Please add your cover image');
      return false;
    }
    this.spinner.show();
    const param = {
      name_en: this.name_en,
      name_ar: this.name_ar,
      cover: this.coverImage,
      id: this.id,
    };
    this.api.post('minorcategories/editCategory', param).then((res: any) => {
      this.spinner.hide();
      if (res && res.data && res.status === 200) {
        this.navCtrl.back();
      } else {
        if (res && res.data && res.data.message) {
          this.error(res.data.message);
          this.navCtrl.back();
          return false;
        }
        this.navCtrl.back();
        this.error(res.message);
        return false;
      }
    });
  }
}
