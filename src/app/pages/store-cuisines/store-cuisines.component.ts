import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { _, orderBy } from 'lodash';

@Component({
  selector: 'app-store-cuisines',
  templateUrl: './store-cuisines.component.html',
  styleUrls: ['./store-cuisines.component.scss']
})
export class StoreCuisinesComponent implements OnInit {

  id: any;
  stores: any[] = [];
  products: any[] = [];
  dummProducts: any[] = [];
  dummy = Array(5);
  page = 1;
  selectedProducts: any[] = [];
  sortByNameOrder: any = '';
  sortByStoreOrder: any = '';
  selectAllProducts: boolean = false;
  restaurants: any[] = [];
  selectedRestaurant: any;

  private modalService = inject(NgbModal);
  closeResult = '';


  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    public util: UtilService,
    private route: ActivatedRoute
  ) {
    this.api.auth();
    this.getStores();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      if (data && data.id && data.register) {
        this.id = data.id;
        this.getProducts();
      }
    });
    this.getRestaurants();
  }


  getProducts() {
    const param = {
      id: this.id,
    };
    this.api
      .post('restcuisines/getByStoreId', param)
      .then((data: any) => {
        console.log('products', data);
        this.dummy = [];
        if (data && data.status === 200 && data.data && data.data.length > 0) {
          this.products = data.data;

          this.dummProducts = data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  toggleSelectAll() {
    this.selectAllProducts = this.selectAllProducts ? true : false;
    this.products.forEach((item) => (item.isSelected = this.selectAllProducts));
  }

  getStores() {
    this.stores = [];
    this.api
      .get('stores')
      .then(
        (storesRes: any) => {
          if (storesRes && storesRes.data.length) {
            console.log('Stores', storesRes);
            this.stores = storesRes.data;
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

  setFilteredItems() {
    this.products = [];
    this.products = this.dummProducts;
  }

  filterItems(searchTerm) {
    return this.products.filter((item) => {
      return (
        item.name_en.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        item.name_ar.indexOf(searchTerm) > -1
      );
    });
  }


  search(string) {
    this.resetChanges();
    this.products = this.filterItems(string);
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

  protected resetChanges = () => {
    this.products = this.dummProducts;
  };

  sortByName() {
    this.sortByNameOrder = this.sortByNameOrder !== 'asc' ? 'asc' : 'desc';
    this.products = orderBy(this.products, ['name_en'], [this.sortByNameOrder]);
  }

  sortByStoreName() {
    this.sortByStoreOrder = this.sortByStoreOrder !== 'asc' ? 'asc' : 'desc';
    this.products = orderBy(
      this.products,
      ['storeId'],
      [this.sortByStoreOrder]
    );
  }

  sortByRating() {
    this.products = orderBy(this.products, ['rating'], ['desc']);
  }

  formatPrice(price) {
    return (+price).toFixed(3);
  }

  open(content: TemplateRef<any>) {
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

  checkSelectedProd() {
    let selectedProd = this.products.filter((p) => p.isSelected === true);
    return selectedProd.length > 0 ? false : true;
  }

  getRestaurants() {
    this.restaurants = [];

    this.api
      .get('stores')
      .then(
        (datas: any) => {
          if (datas && datas.data.length) {
            this.restaurants = datas.data;
            console.warn(this.restaurants);
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

  copyMeal() {
    let selectedProd = this.products.filter((p) => p.isSelected === true);
    let rest = this.restaurants.filter((r) => r.id === this.selectedRestaurant);
    const param = {
      id: this.selectedRestaurant,
      cuisines: selectedProd,
    };
    this.spinner.show();
    console.log(param);
    this.api
      .post('stores/addCuisines', param)
      .then(
        (datas) => {
          this.spinner.hide();
          this.success('Products are copied to ' + rest[0].name_en);
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


}
