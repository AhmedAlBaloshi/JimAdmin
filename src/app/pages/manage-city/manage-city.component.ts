import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
@Component({
  selector: 'app-manage-city',
  templateUrl: './manage-city.component.html',
  styleUrls: ['./manage-city.component.scss']
})
export class ManageCityComponent implements OnInit {
  name_en: any;
  name_ar: any;
  lat: any;
  lng: any;
  address: any;
  wilayatsData: any;

  cities: any[] = [];

  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location
  ) {
    this.api.auth();
    this.getWilayatsData();
  }

  ngOnInit() {
    this.getCities();
  }

  getWilayatsData() {
    fetch("./assets/data/wilayats.json")
      .then(res => res.json())
      .then(json => {
        this.wilayatsData = json.wilayats;
        console.log("wilayats");
        console.log(this.wilayatsData);
      });
  }

  getCities() {
    this.api.get('cities').then((datas: any) => {
      if (datas && datas.data.length) {
        this.cities = datas.data;
      }
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  public handleAddressChange($event) {
    this.name_en = this.address.wilayat_enName;
    this.name_ar = this.address.wilayat_arName;
    this.lat = this.address.latitude;
    this.lng = this.address.longitude;
  }

  confirmAvailability(searchTerm) {
    return this.cities.filter((item) => {
      return (item.name_en.toLowerCase() === searchTerm.toLowerCase());
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

  create() {
    if (!this.name_en || this.name_en === '') {
      this.error(this.api.translate('Please select city first'));
      return false;
    }
    if (this.confirmAvailability(this.address.wilayat_enName).length > 0){
      this.error(this.api.translate('Selected city is already added!'));
      return false;
    }
    const param = {
      name_en: this.name_en,
      name_ar: this.name_ar,
      status: 1,
      lat: this.lat,
      lng: this.lng
    };
    this.spinner.show();
    this.api.post('cities/save', param).then(data => {
      this.spinner.hide();
      this.api.alerts(this.api.translate('Success'), this.api.translate('City Added'), 'success');
      this.navCtrl.back();
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }
}
