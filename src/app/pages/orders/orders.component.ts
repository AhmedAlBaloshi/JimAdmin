
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  dummOrders: any[] = [];
  dummy = Array(5);
  page = 1;
  selectedDriver:any;
  drivers:any[]= [];
  orderId:number|null = null;
  closeResult = '';
  storeId = '';
  driverId = '';
  reason:string = '';
  userType: string = localStorage.getItem('type');
  city: string = localStorage.getItem('city_id');
  loggedInId: string = localStorage.getItem('uid');

  private modalService = inject(NgbModal);

  constructor(
    public api: ApisService,
    private router: Router,
    public util: UtilService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,

  ) {
    this.route.queryParams.subscribe((data: any) => {
      this.storeId = data.storeId;
      this.driverId = data.driverId;
    })
    this.api.auth();
    this.getOrders();
    this.getDrivers()
  }

  getDrivers() {
    this.drivers = [];

    this.api
      .get('drivers')
      .then(
        (datas: any) => {
          if (datas && datas.data.length) {
            this.drivers = datas.data;
            console.warn(this.drivers);
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

  getOrders() {
    let queryParam = '';
    if (this.userType == 'agent') {
      queryParam = '?city_id=' + this.city;
    }
    else if (this.userType == 'branch_manager') {
      queryParam = '?manager_id=' + this.loggedInId;
    }
    else if (this.userType == 'store') {
      queryParam = '?storeId=' + this.loggedInId;
    }
    if(this.storeId){
      queryParam = '?store_id=' + this.storeId;
    }else if(this.driverId){
      queryParam = '?driver_id=' + this.driverId;
    }
    this.api.get('orders'+queryParam).then((data: any) => {
      this.dummy = [];
      if (data && data.status === 200 && data.data) {
        const orders = data.data;
        orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
          if (element.did != 0 && element.did != null) {
            this.api.post('drivers/getById', { id: element.did }).then((data: any) => {
              if (data && data.status === 200 && data.data.length) {
                const obj = data.data[0];
                Object.assign(element, { driverfullName: obj.first_name + " " + (obj.last_name? obj.last_name :'') });
              }
            });
          }
          element.grand_total = (+element.grand_total).toFixed(3);
        });
        this.orders = orders;
        this.dummOrders = this.orders;
      } else {
        this.error(this.api.translate('Something went wrong'));
      }
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.error(this.api.translate('Something went wrong'));
    });
  }

  ngOnInit(): void {
  }

  open(content: TemplateRef<any>, item) {
    this.orderId = item.id;
    this.selectedDriver = item.did
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  search(string) {
    this.resetChanges();
    console.log('string', string);
    this.orders = this.filterItems(string);
  }

  protected resetChanges = () => {
    this.orders = this.dummOrders;
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

  setFilteredItems() {
    console.log('clear');
    this.orders = [];
    this.orders = this.dummOrders;
  }

  filterItems(searchTerm) {
    return this.orders.filter((item) => {
      return item.str_name_en.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.paid.indexOf(searchTerm) > -1 || item.id.indexOf(searchTerm)> -1;
    });
  }

  getBadgeClass(item){
    return item.paid == 0?'bg-danger':'bg-success';
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

  openOrder(item) {
    console.log(item);
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['manage-orders'], navData);
  }
  getDates(date) {
    return moment(date).format('llll');
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }


  openUser(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.uid
      }
    };
    this.router.navigate(['manage-users'], navData);
  }

  transfer() {

    let driver = this.drivers.filter((d) => d.id === this.selectedDriver);
    let reason = `Changed driver to ${driver[0].first_name} ${driver[0].last_name} because "${this.reason}"`;

    const param = {
      id: this.orderId,
      selectedDriver: this.selectedDriver,
      reason: reason
    };
    this.spinner.show();
    console.log(param);
    this.api
      .post('drivers/changeDriver', param)
      .then(
        (datas) => {
          this.selectedDriver = null;
          this.spinner.hide();
          this.getOrders();
          this.success('Products are copied to ' + driver[0].first_name+ ' ' +driver[0].last_name);
          this.modalService.dismissAll();
        },
        (error) => {
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
          console.log(error);
        }
      )
      .catch((error) => {
        this.spinner.hide();
        console.log(error);
        this.error(this.api.translate('Something went wrong'));
      });
  }
}
