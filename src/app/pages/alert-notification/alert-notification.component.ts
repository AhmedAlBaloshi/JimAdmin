import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-alert-notification',
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.scss'],
})
export class AlertNotificationComponent implements OnInit {
  title: string = '';
  message: string = '';
  messageFor: any = '';
  displayedUsers: any[] = [];
  selectedUsers: any = [];
  users: any = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private chMod: ChangeDetectorRef
  ) {
    this.api.auth();
  }

  ngOnInit(): void {
    this.spinner.hide();
  }

  getUsers(event) {
    this.selectedUsers = [];
    if (this.messageFor === 'driver') this.getDrivers();
    else if (this.messageFor === 'vendor') this.getVendors();
    else if (this.messageFor === 'customer') this.getCustomers();
  }
  getCustomers() {
    this.users = [];

    this.api
      .get('users/getUsers')
      .then((data: any) => {
        if (data && data.status === 200 && data.data.length) {
          this.users = data.data;
          this.displayedUsers = this.users.slice(0, 100);

          this.setDrop('full_name');
        }
      })
      .catch((error) => {
        console.log(error);
        this.error('Something went wrong');
      });
  }
  getVendors() {
    this.users = [];

    this.api
      .get('stores')
      .then(
        (datas: any) => {
          if (datas && datas.data.length) {
            this.users = datas.data;
            this.displayedUsers = this.users.slice(0, 100);
            this.setDrop('name_en');
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

  setDrop(textField) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: textField,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      enableCheckAll: true,
    };
    this.chMod.detectChanges();
  }

  getDrivers() {
    this.users = [];

    this.api
      .get('drivers')
      .then(
        (data: any) => {
          console.log(data);
          if (data && data.status === 200 && data.data.length) {
            this.users = data.data;
            this.displayedUsers = this.users.slice(0, 100);
            this.setDrop('first_name');
          }
        },
        (error) => {
          console.log(error);
          this.error('Something went wrong');
        }
      )
      .catch((error) => {
        console.log(error);
        this.error('Something went wrong');
      });
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
      },
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

  onChange(event) {}

  onEditorChange(event) {}

  onSelectAll(items: any) {
    this.selectedUsers = [...this.users];
    console.log('onSelectAll', this.selectedUsers);
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', this.selectedUsers);
  }

  onFilterChange(filter: string) {
    if (filter) {
      this.displayedUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase())
      );
    } else {
      this.displayedUsers = this.users.slice(0, 100);
    }
  }

  submit() {
    if (
      !this.messageFor ||
      this.message === '' ||
      this.selectedUsers.length < 1 ||
      this.title === ''
    ) {
      this.error(this.api.translate('All Fields are required'));
      return false;
    }
    const params = {
      for: this.messageFor,
      title: this.title,
      message: this.message,
      users: this.selectedUsers,
    };
    console.warn(params);

    this.api
      .post('users/sendNotification', params)
      .then(
        (data: any) => {
          console.log(data);

          if (data && data.status === 200) {
            this.success('Notification sent')
            this.title = '';
            this.message = '';
            this.messageFor = '';
            this.selectedUsers = [];
          }

        },
        (error) => {
          console.log(error);
          this.error('Something went wrong');
        }
      )
      .catch((error) => {
        console.log(error);
        this.error('Something went wrong');
      });
  }
}
