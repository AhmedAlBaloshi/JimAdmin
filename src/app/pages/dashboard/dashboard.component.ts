
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
    this.api.get('users/adminHome').then((res: any) => {
      this.dummy = [];
      if (res && res.status === 200) {
        const orders = res.data.orders;
        this.stores = res.data.stores;
        this.allUsers = res.data.allUsers[0]?.totalUsers;
        this.allOrders = res.data.allOrders[0]?.totalOrders;
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
    this.router.navigate([item]);
  }
}
