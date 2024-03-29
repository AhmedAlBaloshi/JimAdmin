
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  myOrders: any[] = [];
  id: any;
  myaddress: any[] = [];
  reviews: any[] = [];
  name: any = '';
  email: any = '';
  mobile: any = '';
  photo: any = '';
  constructor(
    public api: ApisService,
    private route: ActivatedRoute,
    private toastyService: ToastyService,
    public util: UtilService
  ) {
    this.api.auth();
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getProfile();
        this.getMyOrders();
        this.getAddress();
        this.getReviews();
      }
    });
  }

  ngOnInit() {

  }
  getProfile() {
    const param = {
      id: this.id
    };
    this.api.post('users/getById', param).then((data: any) => {
      console.log('user info=>', data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data[0];
        console.log('info', info);
        this.email = info.email;
        this.mobile = info.country_code + " " + info.mobile;
        this.name = info.full_name + ' ' + info.last_name;
        this.photo = this.api.mediaURL + info.cover;
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  getReviews() {
    const param = {
      id: this.id,
      where: 'uid = ' + this.id
    };

    this.api.post('rating/getFromIDs', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.reviews = data.data;
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  getAddress() {
    const param = {
      id: this.id
    }
    this.myaddress = [];
    this.api.post('address/getByUid', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length) {
        this.myaddress = data.data;
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  getMyOrders() {
    const param = {
      id: this.id
    }
    this.api.post('orders/getByUid', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length > 0) {
        // this.orders = data.data;
        const orders = data.data;
        orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            if (element && element.address) {
              element.address = JSON.parse(element.address);
            }
          }
          element.grand_total = (+element.grand_total).toFixed(3);
        });
        this.myOrders = orders;
        console.log('orderss==>?', this.myOrders);
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  getDate(date) {
    return moment(date).format('llll');
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
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
