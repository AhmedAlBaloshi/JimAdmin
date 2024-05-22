
import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { _, orderBy } from 'lodash';

import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  stores: any[] = [];
  products: any[] = [];
  dummProducts: any[] = [];
  dummy = Array(5);
  page = 1;

  sortByNameOrder: any = '';
  sortByStoreOrder: any = '';

  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    public util: UtilService
  ) {
    this.api.auth();
    this.getProducts();
    this.getStores();
  }

  ngOnInit(): void {
  }

  getProducts() {
    // this.dummy = Array(5);
    // this.products = [];
    this.api.get('products').then((data: any) => {
      console.log('products', data);
      this.dummy = [];
      if (data && data.status === 200 && data.data && data.data.length > 0) {
        this.products = data.data;
        this.dummProducts = data.data;
      }
    }).catch(error => {
      console.log(error);
    });
  }

  getStores() {
    this.stores = [];
    this.api.get('stores').then((storesRes: any) => {
      if (storesRes && storesRes.data.length) {
        console.log("Stores", storesRes)
        this.stores = storesRes.data;
      }
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  getStoreName(id) {
    let matchedStore = this.stores.filter((item) => {
      return (item.id === id);
    });
    return matchedStore.length > 0 ? matchedStore[0].name_en : '-';
  }

  search(string) {
    this.resetChanges();
    this.products = this.filterItems(string);
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

  protected resetChanges = () => {
    this.products = this.dummProducts;
  }

  setFilteredItems() {
    this.products = [];
    this.products = this.dummProducts;
  }

  filterItems(searchTerm) {
    return this.products.filter((item) => {
      return item.name_en.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.name_ar.indexOf(searchTerm) > -1;
    });
  }

  sortByName() {
    this.sortByNameOrder = this.sortByNameOrder !== 'asc' ? 'asc' : 'desc';
    this.products = orderBy(this.products, ['name_en'], [this.sortByNameOrder]);
  }

  sortByStoreName() {
    this.sortByStoreOrder = this.sortByStoreOrder !== 'asc' ? 'asc' : 'desc';
    this.products = orderBy(this.products, ['storeId'], [this.sortByStoreOrder]);
  }

  sortByRating() {
    this.products = orderBy(this.products, ['rating'], ['desc']);
  }

  formatPrice(price) {
    return (+price).toFixed(3);
  }

  getClass(item) {
    if (item === '1') {
      return 'btn btn-primary btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  openOrder(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        storeId: item.storeId,
      }
    };
    this.router.navigate(['manage-products'], navData);
  }

  getDates(date) {
    return moment(date).format('llll');
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }

  update(item, value) {
    if (value === 'home') {
      console.log('home', item);
      Swal.fire({
        title: this.api.translate('Are you sure?'),
        text: 'To change it',
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: this.api.translate('Yes'),
        showCancelButton: true,
        cancelButtonText: this.api.translate('Cancel'),
        backdrop: false,
        background: 'white'
      }).then((data) => {
        if (data && data.value) {
          console.log('update it');
          const param = {
            id: item.id,
            in_home: item.in_home === '1' ? 0 : 1
          };
          this.spinner.show();
          this.api.post('products/editList', param).then((datas) => {
            this.spinner.hide();
            this.getProducts();
          }, error => {
            this.spinner.hide();
            this.error(this.api.translate('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
            this.error(this.api.translate('Something went wrong'));
          });
        }
      });
      // this.sp
    } else if (value === 'status') {
      console.log('status', item);
      Swal.fire({
        title: this.api.translate('Are you sure?'),
        text: 'To change it',
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: this.api.translate('Yes'),
        showCancelButton: true,
        cancelButtonText: this.api.translate('Cancel'),
        backdrop: false,
        background: 'white'
      }).then((data) => {
        if (data && data.value) {
          console.log('update it');
          const param = {
            id: item.id,
            status: item.status === '1' ? 0 : 1
          };
          this.spinner.show();
          this.api.post('products/editList', param).then((datas) => {
            this.spinner.hide();
            this.getProducts();
          }, error => {
            this.spinner.hide();
            this.error(this.api.translate('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
            this.error(this.api.translate('Something went wrong'));
          });
        }
      });
    }
  }
}
