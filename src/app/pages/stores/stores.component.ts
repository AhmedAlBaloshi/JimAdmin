import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
})
export class StoresComponent implements OnInit {
  searchText: any = '';
  stores: any[] = [];
  dummyStores: any[] = [];
  dummy = Array(5);
  page: number = 1;
  majorCategoriesList = [];
  userType: string = localStorage.getItem('type');
  zone_id: string = localStorage.getItem('zone_id');
  loggedInId: string = localStorage.getItem('uid');

  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private chMod: ChangeDetectorRef,
    private toastyService: ToastyService
  ) {
    this.api.auth();
    this.getStores();
    this.getMajorCategories();
  }

  ngOnInit(): void {}

  search(string) {
    this.resetChanges();
    this.stores = this.filterItems(string);
  }

  getStores() {
    this.stores = [];
    this.dummy = Array(10);
    let queryParam = '';
    if (this.userType == 'agent') {
      queryParam = '?zone_id=' + this.zone_id;
    }
    if (this.userType == 'branch_manager') {
      queryParam = '?manager_id=' + this.loggedInId;
    }

    this.api
      .get('stores'+queryParam)
      .then(
        (datas: any) => {
          this.dummy = [];
          if (datas && datas.data.length) {
            datas.data.forEach((element) => {
              if (element.cusine && element.cusine !== '') {
                element.cusine = JSON.parse(element.cusine);
                //element.cusine = element.cusine.split(',');
              } else {
                element.cusine = [];
              }
            });
            this.stores = datas.data;
            this.dummyStores = this.stores;
          }
        },
        (error) => {
          console.log(error);
          this.error(this.api.translate('Something went wrong'));
          this.dummy = [];
        }
      )
      .catch((error) => {
        console.log(error);
        this.error(this.api.translate('Something went wrong'));
      });
  }

  protected resetChanges = () => {
    this.stores = this.dummyStores;
  };

  setFilteredItems() {
    this.stores = [];
    this.stores = this.dummyStores;
  }

  filterItems(searchTerm) {
    return this.stores.filter((item) => {
      return (
        item.name_en.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        item.name_ar.indexOf(searchTerm) > -1
      );
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

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  getBusyClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  getFeaturedClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  openRest(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        register: false,
      },
    };
    this.router.navigate(['manage-stores'], navData);
  }

  viewCuisines(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        register: false,
      },
    };
    this.router.navigate(['restaurant-cuisines'], navData);
  }

  viewProducts(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        register: false,
      },
    };
    this.router.navigate(['restaurant-products'], navData);
  }

  changeStatus(item) {
    const text = item.status === '1' ? 'Deactivate' : 'Activate';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate(`You can change it later`),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText:
        this.api.translate('Yes, ') + text + this.api.translate(' it!'),
    }).then((result) => {
      if (result.value) {
        const query = item.status === '1' ? '0' : '1';
        const param = {
          id: item.id,
          status: query,
        };
        this.spinner.show();
        this.api
          .post('stores/editList', param)
          .then(
            (datas: any) => {
              this.spinner.hide();
              if (datas && datas.status === 200) {
                this.getStores();
              } else {
                this.spinner.hide();
                this.error(this.api.translate('Something went wrong'));
              }
            },
            (error) => {
              this.spinner.hide();
              console.log(error);
              this.error(this.api.translate('Something went wrong'));
            }
          )
          .catch((error) => {
            this.spinner.hide();
            console.log(error);
            this.error(this.api.translate('Something went wrong'));
          });
      }
    });
  }

  changeBusy(item) {
    const text = item.is_busy === '1' ? 'Not Busy' : 'Busy';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate(`You can change it later`),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.api.translate('Yes, ') + text,
    }).then((result) => {
      if (result.value) {
        const query = item.is_busy === '1' ? '0' : '1';
        const param = {
          id: item.id,
          is_busy: query,
        };
        this.spinner.show();
        this.api
          .post('stores/editList', param)
          .then(
            (datas: any) => {
              this.spinner.hide();
              if (datas && datas.status === 200) {
                this.getStores();
              } else {
                this.spinner.hide();
                this.error(this.api.translate('Something went wrong'));
              }
            },
            (error) => {
              this.spinner.hide();
              console.log(error);
              this.error(this.api.translate('Something went wrong'));
            }
          )
          .catch((error) => {
            this.spinner.hide();
            console.log(error);
            this.error(this.api.translate('Something went wrong'));
          });
      }
    });
  }

  changeFatured(item) {
    const text = item.featured === '1' ? 'Not Featured' : 'Featured';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate(`You can change it later`),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.api.translate('Yes, ') + text,
    }).then((result) => {
      if (result.value) {
        const query = item.featured === '1' ? '0' : '1';
        const param = {
          id: item.id,
          featured: query,
        };
        this.spinner.show();
        this.api
          .post('stores/editList', param)
          .then(
            (datas: any) => {
              this.spinner.hide();
              if (datas && datas.status === 200) {
                this.getStores();
              } else {
                this.spinner.hide();
                this.error(this.api.translate('Something went wrong'));
              }
            },
            (error) => {
              this.spinner.hide();
              console.log(error);
              this.error(this.api.translate('Something went wrong'));
            }
          )
          .catch((error) => {
            this.spinner.hide();
            console.log(error);
            this.error(this.api.translate('Something went wrong'));
          });
      }
    });
  }

  createNew() {
    const navData: NavigationExtras = {
      queryParams: {
        register: true,
      },
    };
    this.router.navigate(['manage-stores'], navData);
  }
  ViewOrders(item) {
    const navData: NavigationExtras = {
      queryParams: {
        storeId: item.id,
      },
    };
    this.router.navigate(['orders'], navData);
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }

  getTime(time) {
    return moment('2020-12-05 ' + time).format('hh:mm a');
  }

  getMajorCategories() {
    this.majorCategoriesList = [];
    this.api
      .get('majorcategories')
      .then(
        (res: any) => {
          if (res && res.data && res.data.length) {
            this.majorCategoriesList = res.data;
            this.chMod.detectChanges();
          }
        },
        (error) => {
          console.log(error);
          this.error(this.api.translate('Something went wrong'));
        }
      )
      .catch((error) => {
        console.log(error);
        this.error(this.api.translate('Something went wrong'));
      });
  }

  getCusineName(id) {
    let matchedMajorCategories = this.majorCategoriesList.filter((item) => {
      return item.id === id;
    });
    return matchedMajorCategories.length > 0
      ? matchedMajorCategories[0].name_en
      : '-';
  }

  changeStoreStatus(type:string) {
    let msg = "";
    if(type === 'close'){
      msg = "You want to make all the restaurants closed"
    }else{
      msg = "You want to make all the restaurants busy";
    }
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate(msg),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.api.translate('Yes'),
    }).then((result) => {

      if (result.value) {

        let param = {
          type:type,
          zone_id:this.zone_id
        }

        this.spinner.show();
        this.api
          .post('stores/changeAllStatus', param)
          .then(
            (datas: any) => {
              this.spinner.hide();
              if (datas && datas.status === 200) {
                this.getStores();
              } else {
                this.spinner.hide();
                this.error(this.api.translate('Something went wrong'));
              }
            },
            (error) => {
              this.spinner.hide();
              console.log(error);
              this.error(this.api.translate('Something went wrong'));
            }
          )
          .catch((error) => {
            this.spinner.hide();
            console.log(error);
            this.error(this.api.translate('Something went wrong'));
          });
      }
    });
  }
}
