import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationExtras, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
})
export class AgentComponent implements OnInit {
  filterValue: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  users: any[] = [];
  dummy = Array(5);
  dummyUsers: any[] = [];
  page: number = 1;
  userType: string = localStorage.getItem('type');
  loggedInId: string = localStorage.getItem('uid');
  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastyService: ToastyService
  ) {
    this.api.auth();
    this.getUsers();
  }

  ngOnInit() {}

  getUsers() {
    this.spinner.show();
    let queryParam = '';
    if (this.userType == 'branch_manager') {
      queryParam = '?created_by=' + this.loggedInId;
    }
    this.api
      .get('users/getAgents' + queryParam)
      .then((data: any) => {
        console.log('users', data);
        this.dummy = [];
        if (data && data.status === 200 && data.data.length) {
          this.users = data.data;
          this.dummyUsers = data.data;
        }
        this.spinner.hide();
      })
      .catch((error) => {
        this.spinner.hide();

        console.log(error);
        this.error('Something went wrong');
      });
  }

  search(str) {
    this.resetChanges();
    console.log('string', str);
    this.users = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.users = this.dummyUsers;
  };

  setFilteredItems() {
    console.log('clear');
    this.users = [];
    this.users = this.dummyUsers;
  }

  filterItems(searchTerm) {
    return this.users.filter((item) => {
      const name =
        item.full_name +
        ' ' +
        item.last_name +
        ' ' +
        item.email +
        ' ' +
        item.country_code +
        item.mobile +
        ' ' +
        item.branch_manager;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
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
    console.log(text);
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text:
        this.api.translate('To ') + text + this.api.translate(' this user!'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.api.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.api.translate('Cancel'),
      backdrop: false,
      background: 'white',
    }).then((data) => {
      if (data && data.value) {
        console.log('update it');
        const newStatus = item.status === '1' ? 0 : 1;
        const param = {
          id: item.id,
          status: newStatus,
        };
        console.log('param', param);
        this.spinner.show();
        this.api
          .post('users/edit_profile', param)
          .then(
            (data) => {
              this.spinner.hide();
              this.getUsers();
            },
            (error) => {
              console.log(error);
              this.spinner.hide();
            }
          )
          .catch((error) => {
            this.spinner.hide();
            console.log(error);
          });
      }
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

  createNew() {
    const navData: NavigationExtras = {
      queryParams: {
        register: true,
        agent: true,
      },
    };
    this.router.navigate(['manage-administrantor'], navData);
  }

  openUser(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
      },
    };
    this.router.navigate(['manage-users'], navData);
  }

  editAgent(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        agent: true,
        register: false,
      },
    };
    this.router.navigate(['manage-administrantor'], navData);
  }

  deleteIt(item) {
    Swal.fire({
      title: this.api.translate('Are you sure'),
      text:
        this.api.translate('to delete') +
        ' ' +
        item.full_name +
        ' ' +
        item.last_name +
        ' ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: this.api.translate('Delete'),
      backdrop: false,
      background: 'white',
    }).then((status) => {
      if (status && status.value) {
        const param = {
          original_id: item.id,
          email: item.email,
        };
        this.spinner.show();
        this.api
          .post('users/deleteUser', param)
          .then(
            (datas: any) => {
              console.log(datas);
              this.spinner.hide();
              if (datas && datas.status === 200) {
                this.getUsers();
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                  },
                });
                Toast.fire({
                  icon: 'success',
                  title: this.api.translate('deleted'),
                });
              } else {
                this.error(this.api.translate('Something went wrong'));
              }
            },
            (error) => {
              console.log(error);
              this.spinner.hide();
              this.error(this.api.translate('Something went wrong'));
            }
          )
          .catch((error) => {
            console.log(error);
            this.spinner.hide();
            this.error(this.api.translate('Something went wrong'));
          });
      }
    });
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn = column;
    this.updateDataSource();
  }

  updateDataSource() {
    let filteredData = this.users.filter(item => {
      return Object.values(item).some(val =>
        val.toString().toLowerCase().includes(this.filterValue)
      );
    });

    if (this.sortColumn) {
      filteredData = filteredData.sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];
        let comparison = 0;
        if (valueA > valueB) {
          comparison = 1;
        } else if (valueA < valueB) {
          comparison = -1;
        }
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    this.users = filteredData;
  }

  convertTimeTo12HourFormat(time) {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}
