import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss'],
})
export class ManageOffersComponent implements OnInit {
  name: any;
  off: any;
  type: any;
  min: any;
  title: any;
  date_time: any;
  descriptions: any;
  upto: any;
  status: any;
  promo: any;
  freeDelivery: any;
  coverImage: any;
  productsList = [];
  dropdownList = [];
  selectedStore: any;
  selectedProduct: any;
  dropdownSettings: IDropdownSettings = {};
  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private route: ActivatedRoute,
    private chMod: ChangeDetectorRef
  ) {
    this.api.auth();
  }

  ngOnInit(): void {
    this.api
      .get('stores')
      .then(
        (data) => {
          if (data && data.data.length) {
            data = data.data.filter((x) => x.status === '1');
            this.dropdownList = data;
            this.dropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'name_en',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
            };
            this.chMod.detectChanges();
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.log(error);
      });
    this.getProducts();
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
      this.api.uploadFile(files).subscribe(
        (data: any) => {
          this.spinner.hide();
          if (data && data.status === 200 && data.data) {
            this.coverImage = data.data;
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

  getProducts() {
    this.api
      .get('products/getForSelect')
      .then(
        (data) => {
          if (data && data.data.length) {
            this.productsList = data.data;
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }
  create() {
    // const storeId = [...new Set(this.selectedStore.map(item => item.id))];
    // console.log(storeId)
    if (!this.freeDelivery) {
      if (
        !this.name ||
        this.name === '' ||
        !this.off ||
        this.off === '' ||
        !this.type ||
        this.type === '' ||
        !this.min ||
        this.min === '' ||
        !this.date_time ||
        this.date_time === '' ||
        !this.descriptions ||
        this.descriptions === '' ||
        !this.upto ||
        this.upto === ''
      ) {
        this.error('All Fields are required');
        return false;
      }
    } else {
      if (
        !this.name ||
        this.name === '' ||
        !this.date_time ||
        this.date_time === '' ||
        !this.descriptions ||
        this.descriptions === '' ||
        !this.freeDelivery ||
        this.freeDelivery === ''
      ) {
        this.error('All Fields are required');
        return false;
      }
    }

    if (!this.coverImage || this.coverImage === '') {
      this.error(this.api.translate('Please add your cover image'));
      return false;
    }
    // if (storeId.length === 0) {
    //   this.error('Please select restaurant');
    //   return false;
    // }
    const param = {
      title: this.title,
      store_id: this.selectedStore,
      product_id: this.selectedProduct,
      is_promo: this.promo ? 1 : 0,
      code: this.name,
      image: this.coverImage,
      details: this.descriptions,
      discount: this.off,
      expire: this.date_time,
      min: this.min,
      type: this.type,
      upto: this.upto,
      status: 1,
      free_delivery: this.freeDelivery ? 1 : 0,
    };
    console.log(param);
    this.spinner.show();
    this.api.post('offers/save', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.navCtrl.back();
      } else {
        this.error('Something went wrong');
      }
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
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

  onItemSelect(item: any) {
    console.log(item, this.selectedStore);
  }
  onSelectAll(items: any) {
    console.log(items, this.selectedStore);
  }
  getList() {
    return this.dropdownList;
  }
}
