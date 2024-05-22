import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ApisService } from 'src/app/services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-major-categories',
  templateUrl: './major-categories.component.html',
  styleUrls: ['./major-categories.component.scss']
})
export class MajorCategoriesComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;
  majorCategories: any;
  dummy = Array(5);
  dummyCates: any[] = [];
  page: number = 1;
  cuisineName: any = '';
  cuisineId: any;

  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private modalService: NgbModal,
  ) {
    this.api.auth();
    this.getMajorCategories();
  }

  ngOnInit(): void {
  }

  getMajorCategories() {
    this.majorCategories = [];
    this.dummy = Array(10);
    this.api.get('majorcategories').then((res: any) => {
      this.dummy = [];
      if (res && res.data && res.data.length) {
        this.majorCategories = res.data;
        this.dummyCates = this.majorCategories;
      }
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
      this.dummy = [];
    }).catch(error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  search(str) {
    this.resetChanges();
    this.majorCategories = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.majorCategories = this.dummyCates;
  }

  setFilteredItems() {
    this.majorCategories = [];
    this.majorCategories = this.dummyCates;
  }

  filterItems(searchTerm) {
    return this.majorCategories.filter((item) => {
      return item.name_en.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
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

  getClass(item) {
    if (item === '1') {
      return 'btn btn-primary btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  createNew() {
    const navData: NavigationExtras = {
      queryParams: {
        register: true
      }
    };
    this.router.navigate(['manage-major-categories'], navData);
  }

  changeStatus(item) {
    const text = item.status === '1' ? 'deactive' : 'active';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + text + this.api.translate(' this major categories!'),
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
        const query = item.status === '1' ? '0' : '1';
        const param = {
          id: item.id,
          status: query
        };
        this.spinner.show();
        this.api.post('majorcategories/editList', param).then((res) => {
          this.spinner.hide();
          this.getMajorCategories();
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

  view(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id,
        register: false
      }
    };
    this.router.navigate(['manage-major-categories'], navData);
  }

  deleteIt(item) {
    Swal.fire({
      title: this.api.translate('Are you sure'),
      text: this.api.translate('to delete') + ' ' + item.name_en + ' ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: this.api.translate('Delete'),
      backdrop: false,
      background: 'white'
    }).then(status => {
      if (status && status.value) {
        const param = {
          id: item.id,
        };
        this.spinner.show();
        this.api.post('majorcategories/deleteList', param).then((res: any) => {
          this.spinner.hide();
          if (res && res.status === 200) {
            this.getMajorCategories();
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              }
            });
            Toast.fire({
              icon: 'success',
              title: this.api.translate('deleted')
            });
          } else {
            this.error(this.api.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        });
      }
    });
  }
}
