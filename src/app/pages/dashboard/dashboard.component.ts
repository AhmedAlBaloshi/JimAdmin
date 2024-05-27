
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dummy = Array(5);
  page: number = 1;
  userType: string = localStorage.getItem('type');
  zone_id: string = localStorage.getItem('zone_id');
  loggedInId: string = localStorage.getItem('uid');

  orders: any[] = [];
  stores: any[] = [];
  allUsers: any = 0;
  allOrders: any = 0;

  constructor(
    public api: ApisService,
    private router: Router,
    public util: UtilService
  ) {
    this.api.auth();
    this.getData();
  }

  getData() {
    let queryParam = '';
    if (this.userType == 'agent') {
      queryParam = '?zone_id=' + this.zone_id;
    }
    if (this.userType == 'branch_manager') {
      queryParam = '?manager_id=' + this.loggedInId;
    }

    if (this.userType == 'store') {
      queryParam = '?store_id=' + this.loggedInId;
    }
    this.api.get('users/adminHome'+queryParam).then((res: any) => {
      this.dummy = [];
      if (res && res.status === 200) {
        const orders = res.data.orders;
        this.stores = res.data.stores;
        this.allUsers = res.data.allUsers;
        this.allOrders = res.data.allOrders;
        orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
          if (element.did != 0  && element.did != null) {
            this.api.post('drivers/getById', { id: element.did }).then((res: any) => {
              if (res && res.status === 200 && res.data.length) {
                const obj = res.data[0];
                Object.assign(element, { driverfullName: obj.first_name + " " + obj.last_name });
              }
            });
          }
          element.grand_total = (+element.grand_total).toFixed(3);
        });
        this.orders = orders;
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  ngOnInit(): void {
  }

  getCurrency() {
    // return this.api.getCurrencySymbol();
  }

  getClass(item) {
    if (item === 'created' || item === 'accepted' || item === 'picked') {
      return 'btn btn-primary btn-round';
    } else if (item === 'delivered') {
      return 'btn btn-success btn-round';
    } else if (item === 'rejected' || item === 'cancel') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  getDates(date) {
    return moment(date).format('llll');
  }

  openOrder(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['manage-orders'], navData);
  }

  openIt(item) {
    if(item === this.userType){
      if(this.userType == 'admin'){
        item = 'users';
      }else if(this.userType== 'store'){
        item = 'products';
      }else{
        item = 'drivers';
      }
    }
    this.router.navigate([item]);
  }
}
