
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  drivers: any[] = [];
  dummy = Array(5);
  dummyDrivers: any[] = [];
  page: number = 1;
  userType: string = localStorage.getItem('type');
  zone_id: string = localStorage.getItem('zone_id');
  loggedInId: string = localStorage.getItem('uid');

  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
  ) {
    this.api.auth();
    this.getDrivers();
  }

  ngOnInit(): void {
  }

  getDrivers() {
    let queryParam = '';
    if (this.userType == 'agent') {
      queryParam = '?zone_id=' + this.zone_id;
    }
    if (this.userType == 'branch_manager') {
      queryParam = '?manager_id=' + this.loggedInId;
    }

    this.api.get('drivers'+queryParam).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data.length) {
        this.drivers = data.data;
        this.dummyDrivers = this.drivers;
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  search(str) {
    this.resetChanges();
    console.log('string', str);
    this.drivers = this.filterItems(str);
  }


  protected resetChanges = () => {
    this.drivers = this.dummyDrivers;
  }

  setFilteredItems() {
    console.log('clear');
    this.drivers = [];
    this.drivers = this.dummyDrivers;
  }

  filterItems(searchTerm) {
    console.log('searchTerm' + searchTerm);
    return this.drivers.filter((item) => {
      console.log('----------------' +item.first_name)
      return (item.first_name!= null ?item.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1:'' ||
      item.email!= null ?item.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1:''
     );
    });

  }

  createNew() {
    const navData: NavigationExtras = {
      queryParams: {
        register: true
      }
    };
    this.router.navigate(['manage-drivers'], navData);
  }
  getClass(item) {
    if (item === '1') {
      return 'btn btn-primary btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  ViewOrders(item) {
    const navData: NavigationExtras = {
      queryParams: {
        driverId: item.id,
      },
    };
    this.router.navigate(['orders'], navData);
  }

  changeStatus(item) {
    const text = item.status === 'active' ? 'deactive' : 'active';
    console.log(text);
    Swal.fire({
      title: 'Are you sure?',
      text: 'To ' + text + ' this driver!',
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        console.log('update it');
        // item.status = text;
        console.log(item);
        const query = item.status === '1' ? '0' : '1';
        const param = {
          id: item.id,
          status: query
        };
        console.log('param', param);
        this.spinner.show();
        this.api.post('drivers/edit_profile', param).then((datas: any) => {
          console.log(datas);
          this.spinner.hide();
          if (datas && datas.status === 200) {
            this.getDrivers();
          } else {
            this.spinner.hide();
            this.error('Something went wrong');
          }

        }, error => {
          this.spinner.hide();
          console.log(error);
          this.error('Something went wrong');
        }).catch(error => {
          this.spinner.hide();
          console.log(error);
          this.error('Something went wrong');
        });
      }
    });
  }
  openDriver(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        register: false
      }
    };
    this.router.navigate(['manage-drivers'], navData);
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

  convertTimeTo12HourFormat(time) {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}
