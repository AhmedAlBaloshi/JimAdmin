import { Location } from '@angular/common';

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import Swal from 'sweetalert2';

// import { Location } from '@angular/common';

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { ApisService } from 'src/app/services/apis.service';
// import { UtilService } from 'src/app/services/util.service';
// import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
// import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit {

  @ViewChild('contentVarient', { static: false }) contentVarient: any;
  @ViewChild('newAddone', { static: false }) newAddone: any;
  categories: any[] = [];
  name_en: any;
  name_ar: any;
  cid: any;
  price: any;
  descriptions_en: any = '';
  descriptions_ar: any = '';
  notes_en: any = '';
  notes_ar: any = '';
  image: any = '';
  coverImage: any;
  ratting: any;
  id: any;
  storeId: any;
  veg: any = '1';
  internalTax: any;
  price_type: any = 'single';
  status: any = '1';
  variations: any[] = [];
  size: any = '0';
  subString: any = '';

  variant_title: any = '';
  variant_price: any;
  variatIndex: any;
  subIndex: any;

  sub: boolean;
  addonName: any;
  addonType: any = 'radio';

  constructor(
    public api: ApisService,
    public util: UtilService,
    public route: ActivatedRoute,
    private navCtrl: Location,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.id) {
        this.id = data.id;
        this.storeId = data.storeId;
        this.getCates();
        this.getProduct();
      }
    });
  }

  getProduct() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('products/getById', param).then((data: any) => {
      this.spinner.hide();
      if (data && data.status === 200 && data.data.length > 0) {
        const info = data.data[0];
        this.name_en = info.name_en;
        this.name_ar = info.name_ar;
        this.descriptions_en = info.descriptions_en;
        this.descriptions_ar = info.descriptions_ar;
        this.notes_en = info.notes_en;
        this.notes_ar = info.notes_ar;
        this.coverImage = info.cover;
        this.cid = info.cid;
        this.price = info.price;
        this.price_type = info.price_type;
        this.size = info.size;
        this.status = info.status;
        this.veg = info.veg;
        this.internalTax = info.internal_tax;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
          this.variations = JSON.parse(info.variations);
        }
      } else {
        this.error(this.api.translate('Product not found'));
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    });
  }

  getCates() {
    const param = {
      id: this.storeId
    };
    this.api.post('categories/getByStoreId', param).then((data: any) => {
      if (data && data.status === 200 && data.data.length) {
        this.categories = data.data;
      }
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  ngOnInit(): void {
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

  changeSize(event) {
    this.size = event;
    if (this.size === '1') {
      const items = this.variations.filter(x => x.title === 'size');
      if (!items.length) {
        const item = {
          title: 'size',
          type: 'radio',
          items: []
        };
        this.variations.push(item);
      }
    } else {
      this.variations = this.variations.filter(x => x.title !== 'size');
    }
  }

  async addItem(index) {
    this.sub = false;
    this.variatIndex = index;
    this.variant_price = 0;
    this.variant_title = '';
    try {
      this.modalService.open(this.contentVarient, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }

  delete(item) {
    if (item.title === 'size') {
      this.size = false;
    }
    this.variations = this.variations.filter(x => x.title !== item.title);
  }

  close3() {
    if (this.sub === false) {
      if (this.variant_title && this.variant_price && this.variant_price !== 0 && this.variant_price > 0) {
        const item = {
          title: this.variant_title,
          price: parseFloat(this.variant_price),
        };
        this.variations[this.variatIndex].items.push(item);
        this.modalService.dismissAll();
        this.variant_title = '';
        this.variant_price = 0;

        this.variatIndex = '';
      } else {
        this.error(this.api.translate('Please add title and price'));
      }
    } else {
      if (this.variant_title && this.variant_price && this.variant_price !== 0 && this.variant_price > 0) {
        this.variations[this.variatIndex].items[this.subIndex].title = this.variant_title;
        this.variations[this.variatIndex].items[this.subIndex].price = parseFloat(this.variant_price);

        this.modalService.dismissAll();
      } else {
        this.error(this.api.translate('Please add title and price'));
      }
    }
  }

  deleteSub(index, item) {
    const selected = this.variations[index].items;
    const data = selected.filter(x => x.title !== item.title);
    this.variations[index].items = data;
  }

  async editSub(index, items, subIndex) {
    this.sub = true;
    this.variatIndex = index;
    this.subIndex = subIndex;
    this.variant_title = this.variations[index].items[subIndex].title;
    this.variant_price = this.variations[index].items[subIndex].price;

    try {
      this.modalService.open(this.contentVarient, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }

  preview_banner(files) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    if (files) {
      this.spinner.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        this.spinner.hide();
        if (data && data.status === 200 && data.data) {
          this.coverImage = data.data;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }

  submit() {
    if (this.name_en === '' || !this.name_en || this.name_ar === '' || !this.name_ar || this.cid === '' ||
      !this.cid || this.price === '' || !this.price) {
      this.error(this.api.translate('All Fields are required'));
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.error(this.api.translate('Please add your cover image'));
      return false;
    }
    this.update();
  }

  update() {
    const param = {
      storeId: this.storeId,
      cid: this.cid,
      name_en: this.name_en,
      name_ar: this.name_ar,
      price: this.price,
      price_type: this.price_type,
      descriptions_en: this.descriptions_en,
      descriptions_ar: this.descriptions_ar,
      notes_en: this.notes_en,
      notes_ar: this.notes_ar,
      cover: this.coverImage,
      veg: this.veg,
      status: this.status,
      variations: JSON.stringify(this.variations),
      size: this.size,
      internal_tax: this.internalTax,
      id: this.id
    };
    this.spinner.show();
    this.api.post('products/editList', param).then((data: any) => {
      this.spinner.hide();
      if (data && data.status === 200) {

        this.navCtrl.back();
      } else {
        this.error(this.api.translate('Something went wrong'));
      }
    }, error => {
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
      console.log('error', error);
    });
  }

  async addNew() {
    try {
      this.modalService.open(this.newAddone, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }

  addNewAddon() {
    if (this.addonName && this.addonName !== '') {
      const item = {
        title: this.addonName,
        type: this.addonType,
        items: []
      };
      this.variations.push(item);
      this.modalService.dismissAll();
    } else {
      this.error(this.api.translate('All Field are required'));
    }
  }

  // isNew: boolean;
  // cateId: any = '';
  // cateName: any = '';

  // subId: any = '';
  // subName: any = '';

  // name_en: any = '';
  // name_ar: any = '';
  // price: any;
  // descriptions_en: any;
  // descriptions_ar: any;
  // notes_en: any;
  // notes_ar: any;

  // realPrice: any;
  // sellPrice: any;
  // discount: any;
  // is_single: any;
  // status: boolean = true;
  // coverImage: any = '';
  // veg: boolean;

  // image1: any;
  // image2: any;
  // image3: any;
  // image4: any;
  // image5: any;
  // image6: any;

  // have_gram: boolean;
  // gram: any;
  // have_kg: boolean;
  // kg: any;
  // have_pcs: boolean;
  // pcs: any;
  // have_liter: boolean;
  // liter: any;
  // have_ml: boolean;
  // ml: any;
  // exp_date: any;

  // in_stoke: any;
  // in_offer: boolean;
  // key_features: any = '';
  // disclaimer: any = '';
  // rating: any;
  // total_rating: any;
  // id: any;
  // images: any[] = [];
  // constructor(
  //   public api: ApisService,
  //   public util: UtilService,
  //   public route: ActivatedRoute,
  //   private navCtrl: Location,
  //   private toastyService: ToastyService,
  //   private spinner: NgxSpinnerService,
  // ) {
  //   this.api.auth();
  //   this.route.queryParams.subscribe((data: any) => {
  //     console.log(data);
  //     if (data && data.id) {
  //       this.id = data.id;
  //       this.getProduct();
  //     }
  //   });
  // }

  // getProduct() {
  //   const param = {
  //     id: this.id
  //   };
  //   this.spinner.show();
  //   this.api.post('products/getById', param).then((data: any) => {
  //     console.log(data);
  //     this.spinner.hide();
  //     if (data && data.status === 200 && data.data.length) {
  //       const info = data.data[0];
  //       console.log('product ->', info);
  //       this.name_en = info.name_en;
  //       this.name_ar = info.name_ar;
  //       this.descriptions_en = info.descriptions_en;
  //       this.descriptions_ar = info.descriptions_ar;
  //       this.notes_en = info.notes_en;
  //       this.notes_ar = info.notes_ar;
  //       this.coverImage = info.cover;
  //       this.key_features = info.key_features;
  //       this.disclaimer = info.disclaimer;
  //       this.price = info.price;

  //       this.exp_date = info.exp_date;
  //       this.gram = info.gram;
  //       this.have_gram = info.have_gram === '1' ? true : false;
  //       this.kg = info.kg;
  //       this.have_kg = info.have_kg === '1' ? true : false;
  //       this.liter = info.liter;
  //       this.have_liter = info.have_liter === '1' ? true : false;
  //       this.ml = info.ml;
  //       this.have_ml = info.have_ml === '1' ? true : false;
  //       this.pcs = info.pcs;
  //       this.have_pcs = info.have_pcs === '1' ? true : false;
  //       this.in_offer = info.in_offer === '1' ? true : false;
  //       this.in_stoke = info.in_stoke === '1' ? true : false;
  //       this.is_single = info.is_single === '1' ? true : false;
  //       this.veg = info.veg === '1' ? true : false;
  //       this.realPrice = parseFloat(info.original_price);
  //       this.sellPrice = parseFloat(info.sell_price);
  //       this.status = info.status === '1' ? true : false;
  //       this.rating = info.rating;
  //       this.total_rating = info.total_rating;
  //       this.images.push(this.coverImage);
  //       if (info.images) {
  //         const images = JSON.parse(info.images);
  //         console.log('images======>>>', images);
  //         if (images[0]) {
  //           this.image1 = images[0];
  //           this.images.push(this.image1);
  //         }
  //         if (images[1]) {
  //           this.image2 = images[1];
  //           this.images.push(this.image2);
  //         }
  //         if (images[2]) {
  //           this.image3 = images[2];
  //           this.images.push(this.image3);
  //         }
  //         if (images[3]) {
  //           this.image4 = images[3];
  //           this.images.push(this.image4);
  //         }
  //         if (images[4]) {
  //           this.image5 = images[4];
  //           this.images.push(this.image5);
  //         }
  //         if (images[5]) {
  //           this.image6 = images[5];
  //           this.images.push(this.image5);
  //         }
  //       }
  //       console.log('----->>>', this.images);
  //     }
  //   }, error => {
  //     this.spinner.hide();
  //     this.error(this.api.translate('Something went wrong'));
  //     console.log(error);
  //   }).catch(error => {
  //     this.spinner.hide();
  //     console.log(error);
  //     this.error(this.api.translate('Something went wrong'));
  //   });
  // }

  // ngOnInit(): void {
  // }

  // formatPrice(price){
  //   return (+price).toFixed(3);
  // }

  // error(message) {
  //   const toastOptions: ToastOptions = {
  //     title: this.api.translate('Error'),
  //     msg: message,
  //     showClose: true,
  //     timeout: 2000,
  //     theme: 'default',
  //     onAdd: (toast: ToastData) => {
  //       console.log('Toast ' + toast.id + ' has been added!');
  //     },
  //     onRemove: () => {
  //       console.log('Toast  has been removed!');
  //     }
  //   };
  //   // Add see all possible types in one shot
  //   this.toastyService.error(toastOptions);
  // }

  // success(message) {
  //   const toastOptions: ToastOptions = {
  //     title: this.api.translate('Success'),
  //     msg: message,
  //     showClose: true,
  //     timeout: 2000,
  //     theme: 'default',
  //     onAdd: (toast: ToastData) => {
  //       console.log('Toast ' + toast.id + ' has been added!');
  //     },
  //     onRemove: () => {
  //       console.log('Toast  has been removed!');
  //     }
  //   };
  //   // Add see all possible types in one shot
  //   this.toastyService.success(toastOptions);
  // }

}
