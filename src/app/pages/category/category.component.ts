import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ApisService } from 'src/app/services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;
  categories: any;
  dummy = Array(5);
  dummyCates: any[] = [];
  page: number = 1;
  catNameEn: any = '';
  catNameAr: any = '';
  cateId: any;
  userType: string = localStorage.getItem('type');
  loggedInId: string = localStorage.getItem('uid');

  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private modalService: NgbModal,
  ) {
    this.api.auth();
    this.getCategory();
  }

  ngOnInit(): void {
  }

  getCategory() {
    this.categories = [];
    this.dummy = Array(10);
    let queryParam = '';
    if (this.userType == 'store') {
      queryParam = '?store_id=' + this.loggedInId;
    }
    this.api.get('categories'+queryParam).then((datas: any) => {
      this.dummy = [];
      if (datas && datas.data && datas.data.length) {
        this.categories = datas.data;
        this.dummyCates = this.categories;
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
    this.categories = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.categories = this.dummyCates;
  }

  setFilteredItems() {
    this.categories = [];
    this.categories = this.dummyCates;
  }

  filterItems(searchTerm) {
    return this.categories.filter((item) => {
      return item.name_en.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.name_ar.indexOf(searchTerm) > -1 ||
        item.store_name_en.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.store_name_ar.indexOf(searchTerm) > -1;
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

  changeStatus(item) {
    const text = item.status === '1' ? 'deactive' : 'active';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + text + this.api.translate(' this category!'),
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
          id: item.cid,
          status: query
        };
        this.spinner.show();
        this.api.post('categories/editList', param).then((datas) => {
          this.spinner.hide();
          this.getCategory();
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
    console.log(item);
    this.catNameEn = item.name_en;
    this.catNameAr = item.name_ar;
    this.cateId = item.cid;
    try {
      this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.modalService.dismissAll();
    const param = {
      id: this.cateId,
      name_en: this.catNameEn,
      name_ar: this.catNameAr,
    };
    this.spinner.show();
    this.api.post('categories/editList', param).then((datas: any) => {
      console.log(datas);
      this.spinner.hide();
      if (datas && datas.status === 200) {
        this.getCategory();
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
          title: this.api.translate('saved')
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

  deleteIt(item) {
    Swal.fire({
      title: this.api.translate('Are you sure'),
      text: this.api.translate('to delete') + ' ' + item.name_en + ' - ' + item.name_ar + ' ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: this.api.translate('Delete'),
      backdrop: false,
      background: 'white'
    }).then(status => {
      if (status && status.value) {
        const param = {
          id: item.cid,
        };
        this.spinner.show();
        this.api.post('categories/deleteList', param).then((datas: any) => {
          console.log(datas);
          this.spinner.hide();
          if (datas && datas.status === 200) {
            this.getCategory();
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

  createNew() {
    const navData: NavigationExtras = {
      queryParams: {
        register: true,
        isCategory: true
      }
    };
    this.router.navigate(['manage-major-categories'], navData);
  }
}
