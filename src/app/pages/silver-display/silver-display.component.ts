import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  inject,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-silver-display',
  templateUrl: './silver-display.component.html',
  styleUrls: ['./silver-display.component.scss'],
})
export class SilverDisplayComponent implements OnInit {
  searchText: any = '';
  stores: any[] = [];
  dummyStores: any[] = [];
  dummy = Array(5);
  page: number = 1;
  majorCategoriesList = [];
  selectedRestaurants: any[] = [];
  restaurants: any;
  errorMsg: any;

  private modalService = inject(NgbModal);
  closeResult = '';

  dropdownSettings: IDropdownSettings = {};

  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private chMod: ChangeDetectorRef,
    private toastyService: ToastyService
  ) {
    this.api.auth();
    this.getStores();
    this.getStoresForSearch();
  }

  ngOnInit(): void {}

  search(string) {
    this.resetChanges();
    this.stores = this.filterItems(string);
  }

  getStoresForSearch() {
    this.restaurants = [];

    this.api
      .get('stores')
      .then(
        (datas: any) => {
          if (datas && datas.data.length) {
            this.restaurants = datas.data.filter(
              (d) => d.is_silver_display != 1
            );

            this.dropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'name_en',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              enableCheckAll: true,
            };
            this.chMod.detectChanges();
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

  getStores() {
    this.stores = [];
    this.dummy = Array(10);
    this.api
      .get('stores/silver')
      .then(
        (datas: any) => {
          this.dummy = [];
          if (datas && datas.data.length) {
            datas.data.forEach((element) => {
              if (element.cusine && element.cusine !== '') {
                element.cusine = JSON.parse(element.cusine);
                //element.cusine = element.cusine.split(',');
              } else {
                element.cusine = [];
              }
            });
            this.stores = datas.data;
            this.dummyStores = this.stores;
          }
        },
        (error) => {
          console.log(error);
          this.error(this.api.translate('Something went wrong'));
          this.dummy = [];
        }
      )
      .catch((error) => {
        console.log(error);
        this.error(this.api.translate('Something went wrong'));
      });
  }

  addRestaurants() {
    if (this.selectedRestaurants.length > 0) {
      this.spinner.show();
      let ids = this.selectedRestaurants.map((r) => {
        return r.id;
      });
      const params = {
        id: ids,
      };
      this.api
        .post('stores/addToSilver', params)
        .then(
          (data: any) => {
            this.errorMsg = '';

            this.spinner.hide();
            this.modalService.dismissAll('');
            this.selectedRestaurants = [];
            console.log(data);
            this.success('Restaurants added successfully');
            this.getStores();
          },
          (error) => {
            this.spinner.hide();
            console.log(error);
            this.error('Something went wrong');
          }
        )
        .catch((error) => {
          this.spinner.hide();
          console.log(error);
          this.error('Something went wrong');
        });
    } else {
      this.errorMsg = 'please select restaurant first';
    }
  }

  onItemSelect(item: any) {
    this.errorMsg = '';
    console.log('onItemSelect', this.selectedRestaurants);
  }

  onSelectAll(item: any) {
    this.errorMsg = '';
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.errorMsg = '';
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

  protected resetChanges = () => {
    this.stores = this.dummyStores;
  };

  setFilteredItems() {
    this.stores = [];
    this.stores = this.dummyStores;
  }

  filterItems(searchTerm) {
    return this.stores.filter((item) => {
      return (
        item.name_en.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        item.name_ar.indexOf(searchTerm) > -1
      );
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

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  getBusyClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  getFeaturedClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  remove(item) {
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate(
        `You want to delete ${item.name_en} from silver display`
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.api.translate('Yes'),
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api
          .post('stores/removeFromSilver', { id: item.id })
          .then(
            (datas: any) => {
              this.spinner.hide();
              this.success(`${item.name_en} is removed from silver display`);
              this.getStores();
            },
            (error) => {
              console.log(error);
              this.error(this.api.translate('Something went wrong'));
              this.dummy = [];
            }
          )
          .catch((error) => {
            console.log(error);
            this.error(this.api.translate('Something went wrong'));
          });
      }
    });
  }

  getTime(time) {
    return moment('2020-12-05 ' + time).format('hh:mm a');
  }
}
