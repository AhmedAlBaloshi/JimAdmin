
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  dummy = Array(5);
  banners: any[] = [];
  stores: any[] = [];
  page = 1;

  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
  ) {
    this.api.auth();
    this.getBanners();
  }

  ngOnInit(): void {
    this.getStores();
  }

  getBanners() {
    this.api.get('banners').then((data: any) => {
      console.log('data', data);
      this.dummy = [];
      this.banners = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.dummy = [];
        this.banners = data.data;
      }
    }).catch((error: any) => {
      console.log('error=>', error);
    });
  }

  getStores() {
    this.api.get('stores').then((datas: any) => {
      if (datas && datas.data.length) {
        this.stores = datas.data;
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
    if (this.stores.length > 0) {
      let matchedStore = this.stores.filter((item) => {
        return (item.id === id);
      });
      return (matchedStore[0].name_en + " - " + matchedStore[0].name_ar);
    }
    return "--";
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
    this.toastyService.success(toastOptions);
  }

  createNew() {
    this.router.navigate(['manage-banners']);
  }

  getClass(item) {
    if (item === '1') {
      return 'btn btn-primary btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  changeStatus(item) {
    const text = item.status === '1' ? 'deactive' : 'active';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + text + this.api.translate(' this banner!'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.api.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.api.translate('Cancle'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        console.log('update it');
        console.log(item);
        const param = {
          id: item.id,
          status: item.status === '1' ? 0 : 1
        };
        this.spinner.show();
        this.api.post('banners/editList', param).then((info) => {
          this.spinner.hide();
          this.getBanners();
        }, error => {
          console.log(error);
          this.spinner.hide();
        }).catch(error => {
          this.spinner.hide();
          console.log(error);
        });
      }
    });
  }
  
  view(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['manage-banners'], param);
  }

}
