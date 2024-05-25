import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';

import Swal from 'sweetalert2';

import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-manage-stores',
  templateUrl: './manage-stores.component.html',
  styleUrls: ['./manage-stores.component.scss'],
})
export class ManageStoresComponent implements OnInit {
  private mapbox: mapboxgl.Map;
  private marker: mapboxgl.Marker;
  banner_to_upload: any = '';
  id: any;
  new: boolean;
  address_en: any = '';
  address_ar: any = '';
  latitude: any;
  longitude: any;

  coverImage: any;
  gender: any = 1;

  name_en: any = '';
  name_ar: any = '';
  descriptions_en: any = '';
  descriptions_ar: any = '';
  haveData: boolean = false;
  time: any = '';
  minOrderPrice: any = '0.000';
  email: any = '';
  openTime;
  closeTime;
  fname: any = '';
  lname: any = '';
  password: any = '';
  phone: any = '';
  city: any = '';
  totalSales: any = 0;
  totalOrders: any = 0;
  reviews: any[] = [];
  cities: any[] = [];
  fileURL: any;
  orders: any[] = [];
  zones: any[] = [];
  zone_id: any = '';
  shippingPrice: any;
  shipping: any = 'fixed';
  deliveryTime: any;
  mobileCcode: any = this.api.default_country_code;
  user_id: any;
  notes_en: any = '';
  notes_ar: any = '';

  userName: any = '';
  userEmail: any = '';
  userPassword: any = '';

  majorCategoriesList = [];
  selectedMajorCategory: any;
  minorCategoriesList = [];
  selectedMinorCategory = [];
  restCuisinesList = [];
  selectedRestCuisines = [];
  paymentMethod = [
    { type: 'cash', title_en: 'Cash', title_ar: 'الدفع عند الاستلام' },
    { type: 'online', title_en: 'Credit Card', title_ar: 'بطاقة الإئتمان' },
  ];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private chMod: ChangeDetectorRef,
    public util: UtilService
  ) {
    this.api.auth();
    this.getCity();
    this.getMajorCategories();
    this.getRestCuisines();
  }

  ngOnInit() {
    this.initMap();
    this.route.queryParams.subscribe((data) => {
      this.new = data.register === 'true' ? true : false;
      if (data && data.id && data.register) {
        this.id = data.id;
        this.getVenue();
      }
    });
  }

  initMap() {
    if (mapboxgl.getRTLTextPluginStatus() !== 'loaded') {
      mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true // Lazy load the plugin
      );
    }
    this.mapbox = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'mapbox',
      style: `mapbox://styles/mrsolver/ckzn30k9a001n14o4w11inoow`,
      zoom: 12,
      center: [58.545284, 23.614328],
      attributionControl: false,
    });
    this.mapbox.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );
    this.marker = new mapboxgl.Marker();
    this.mapbox.on('click', (ev) => {
      this.marker.setLngLat(ev.lngLat).addTo(this.mapbox);
      fetch(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
          ev.lngLat.lng +
          ',' +
          ev.lngLat.lat +
          '.json?country=om&limit=1&types=place&language=ar%2Cen&access_token=' +
          environment.mapbox.accessToken
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {
          this.address_en = responseJson.features[0].place_name_en;
          this.address_ar = responseJson.features[0].place_name_ar;
          this.latitude = responseJson.query[1];
          this.longitude = responseJson.query[0];
        })
        .catch((error) => {
          console.error(error);
          this.error(error);
        });
    });

    this.mapbox.on('load', () => {
      if (!this.new) {
        this.marker
          .setLngLat([this.longitude, this.latitude])
          .addTo(this.mapbox);
        this.mapbox.flyTo({
          center: [this.longitude, this.latitude],
        });
      }
    });
  }

  getOrders() {
    const param = {
      id: this.id,
    };
    this.api
      .post('orders/getByStore', param)
      .then(
        (data: any) => {
          console.log(data);
          let total = 0;
          if (data && data.status === 200 && data.data.length > 0) {
            data.data.forEach(async (element) => {
              element.grand_total = (+element.grand_total).toFixed(3);
              total = total + parseFloat(element.total);
              element.orders = JSON.parse(element.orders);
              this.orders.push(element);
            });
            this.totalSales = (+total).toFixed(3);
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

  getReviews() {
    const param = {
      id: this.id,
      where: 'sid = ' + this.id,
    };
    this.api
      .post('rating/getFromIDs', param)
      .then(
        (data: any) => {
          if (data && data.status === 200) {
            this.reviews = data.data;
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

  getProfile(id) {
    const param = {
      id: this.user_id,
    };
    this.api.post('users/getById', param).then(
      (data: any) => {
        if (data && data.status === 200 && data.data && data.data.length) {
          const info = data.data[0];
          this.userEmail = info.email;
          this.userName = info.full_name + ' ' + info.last_name;
          this.userPassword = this.api.mediaURL + info.cover;
        }
      },
      (error) => {
        console.log(error);
        this.error('Something went wrong');
      }
    );
  }

  getVenue() {
    this.spinner.show();
    const param = {
      id: this.id,
    };
    this.api
      .post('stores/getById', param)
      .then(
        (datas: any) => {
          this.spinner.hide();
          if (datas && datas.status === 200 && datas.data.length) {
            const info = datas.data[0];
            this.city = info.cid;
            this.zone_id = info.zone_id;
            this.user_id = info.user_id;
            this.name_en = info.name_en;
            this.name_ar = info.name_ar;
            this.address_en = info.address_en;
            this.address_ar = info.address_ar;
            this.latitude = info.lat;
            this.longitude = info.lng;
            this.fileURL = info.cover;
            this.coverImage = environment.mediaURL + info.cover;
            this.descriptions_en = info.descriptions_en;
            this.descriptions_ar = info.descriptions_ar;
            this.openTime = info.open_time;
            this.closeTime = info.close_time;
            this.minOrderPrice = info.min_order_price;
            this.shippingPrice = info.shipping_price;
            this.shipping = info.shipping;
            this.deliveryTime = info.time;
            this.selectedMajorCategory = JSON.parse(info.major_categories);
            this.selectedMinorCategory = JSON.parse(info.minor_categories);
            this.selectedRestCuisines = JSON.parse(info.rest_cuisines);
            this.notes_en = info.notes_en;
            this.notes_ar = info.notes_ar;
            this.getOrders();
            this.getReviews();
            this.getZones()
            this.getProfile(info.user_id);
          } else {
            this.spinner.hide();
            this.error(this.api.translate('Something went wrong'));
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
          this.error(this.api.translate('Something went wrong'));
        }
      )
      .catch((error) => {
        this.spinner.hide();
        console.log(error);
        this.error(this.api.translate('Something went wrong'));
      });
  }

  getZones() {
    this.zones = []
    this.api
      .get('zones/getAllZones?city_id='+this.city)
      .then(
        (data: any) => {
          // console.log(data);
          if (data && data.status === 200 && data.data.length) {
            this.zones = data.data;
            console.warn(
              '---------------------------------------------' + this.zones
            );
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


  getImage(cover) {
    return cover ? cover : 'assets/icon.png';
  }

  getDate(date) {
    return moment(date).format('llll');
  }

  getCity() {
    this.api
      .get('cities')
      .then(
        (datas: any) => {
          if (datas && datas.data.length) {
            this.cities = datas.data;
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

  updateVenue() {
    if (
      this.name_en === '' ||
      this.name_ar === '' ||
      this.address_en === '' ||
      this.address_ar === '' ||
      this.descriptions_en === '' ||
      this.descriptions_ar === '' ||
      this.openTime === '' ||
      this.closeTime === '' ||
      !this.openTime ||
      !this.closeTime ||
      this.deliveryTime === '' ||
      this.shippingPrice === ''
      || this.zone_id === ''
    ) {
      this.error(this.api.translate('All Fields are required'));
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.error(this.api.translate('Please add your cover image'));
      return false;
    }
    this.spinner.show();
    const param = {
      name_en: this.name_en,
      name_ar: this.name_ar,
      address_en: this.address_en,
      address_ar: this.address_ar,
      descriptions_en: this.descriptions_en,
      descriptions_ar: this.descriptions_ar,
      lat: this.latitude,
      lng: this.longitude,
      cover: this.fileURL,
      cover_hr: this.fileURL,
      open_time: this.openTime,
      close_time: this.closeTime,
      cid: this.city,
      id: this.id,
      zone_id: this.zone_id,
      min_order_price: this.minOrderPrice,
      shipping_price: this.shippingPrice,
      shipping: this.shipping,
      time: this.deliveryTime,
      major_categories: JSON.stringify(this.selectedMajorCategory),
      minor_categories: JSON.stringify(this.selectedMinorCategory),
      rest_cuisines: JSON.stringify(this.selectedRestCuisines),
      notes_en: this.notes_en,
      notes_ar: this.notes_ar,
    };
    this.api
      .post('stores/editList', param)
      .then(
        (datas: any) => {
          this.spinner.hide();
          if (datas && datas.status === 200) {
            this.navCtrl.back();
          } else {
            this.spinner.hide();
            this.error(this.api.translate('Something went wrong'));
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
          this.error(this.api.translate('Something went wrong'));
        }
      )
      .catch((error) => {
        this.spinner.hide();
        console.log(error);
        this.error(this.api.translate('Something went wrong'));
      });
  }

  create() {
    if (
      this.email === '' ||
      this.fname === '' ||
      this.lname === '' ||
      this.phone === '' ||
      this.password === '' ||
      this.name_en === '' ||
      this.name_ar === '' ||
      this.address_en === '' ||
      this.address_ar === '' ||
      this.descriptions_en === '' ||
      this.descriptions_ar === '' ||
      this.city === '' ||
      !this.city ||
      this.openTime === '' ||
      this.closeTime === '' ||
      !this.openTime ||
      !this.closeTime ||
      this.minOrderPrice === '' ||
      this.deliveryTime === '' ||
      this.zone_id === '' ||
      this.shippingPrice === ''
    ) {
      this.error(this.api.translate('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error(this.api.translate('Please enter valid email'));
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.error(this.api.translate('Please add your cover image'));
      return false;
    }
    this.spinner.show();
    const userParam = {
      full_name: this.fname,
      last_name: this.lname,
      email: this.email,
      password: this.password,
      gender: this.gender,
      fcm_token: 'NA',
      type: 'store',
      lat: this.latitude,
      lng: this.longitude,
      cover: this.fileURL,
      mobile: this.phone,
      status: 1,
      role_id: 3,
      verified: 1,
      others: 1,
      date: moment().format('YYYY-MM-DD'),
      stripe_key: '',
      country_code: '+' + this.mobileCcode,
    };
    this.api
      .post('users/registerUser', userParam)
      .then(
        (data: any) => {
          if (data && data.data && data.status === 200) {
            const storeParam = {
              uid: data.data.id,
              name_en: this.name_en,
              name_ar: this.name_ar,
              mobile: this.phone,
              zone_id: this.zone_id,
              lat: this.latitude,
              lng: this.longitude,
              verified: 1,
              address_en: this.address_en,
              address_ar: this.address_ar,
              descriptions_en: this.descriptions_en,
              descriptions_ar: this.descriptions_ar,
              images: '[]',
              cover: this.fileURL,
              cover_hr: this.fileURL,
              status: 1,
              is_busy: 0,
              open_time: this.openTime,
              close_time: this.closeTime,
              isClosed: 0,
              certificate_url: '',
              certificate_type: '',
              rating: 0,
              total_rating: 0,
              cid: this.city,
              min_order_price: this.minOrderPrice,
              shipping_price: this.shippingPrice,
              shipping: this.shipping,
              time: this.deliveryTime,
              major_categories: JSON.stringify(this.selectedMajorCategory),
              minor_categories: JSON.stringify(this.selectedMinorCategory),
              rest_cuisines: JSON.stringify(this.selectedRestCuisines),
              payment_method: JSON.stringify(this.paymentMethod),
              featured: 0,
              notes_en: this.notes_en,
              notes_ar: this.notes_ar,
            };
            this.api
              .post('stores/save', storeParam)
              .then(
                (salons: any) => {
                  console.log('0000', salons);
                  this.spinner.hide();
                  this.navCtrl.back();
                },
                (error) => {
                  this.spinner.hide();
                  console.log(error);
                  this.error(this.api.translate('Something went wrong'));
                }
              )
              .catch((error) => {
                this.spinner.hide();
                console.log(error);
                this.error(this.api.translate('Something went wrong'));
              });
          } else {
            this.spinner.hide();
            if (data && data.data && data.data.message) {
              this.error(data.data.message);
              return false;
            }
            this.error(data.message);
            return false;
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
          this.error(this.api.translate('Something went wrong'));
        }
      )
      .catch((error) => {
        this.spinner.hide();
        console.log(error);
        this.error(this.api.translate('Something went wrong'));
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
      },
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  preview_banner(files) {
    this.banner_to_upload = [];
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    this.banner_to_upload = files;
    if (this.banner_to_upload) {
      this.spinner.show();
      this.api.uploadFile(this.banner_to_upload).subscribe(
        (data: any) => {
          this.spinner.hide();
          if (data && data.status === 200 && data.data) {
            this.fileURL = data.data;
            this.coverImage = environment.mediaURL + data.data;
          }
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
        }
      );
    } else {
      console.log('no');
    }
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }

  getMajorCategories() {
    this.majorCategoriesList = [];
    this.api
      .get('majorcategories')
      .then(
        (res: any) => {
          if (res && res.data && res.data.length) {
            this.majorCategoriesList = res.data;
            this.dropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'name_en',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              enableCheckAll: false,
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

  getRestCuisines() {
    this.restCuisinesList = [];
    this.api
      .get('restcuisines')
      .then(
        (res: any) => {
          if (res && res.data && res.data.length) {
            this.restCuisinesList = res.data;
            this.dropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'name_en',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true,
              enableCheckAll: false,
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

  onItemSelect(item: any) {
    console.log('onItemSelect', this.selectedMajorCategory);
  }

  onSelectAll(items: any) {
    console.log('onSelectAll', this.selectedMajorCategory);
  }

  getMajorCategoriesList() {
    return this.majorCategoriesList;
  }

  getRestCuisinesList() {
    return this.restCuisinesList;
  }

  changeStatus(item) {
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate(`You want to delete this comment`),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText:
        this.api.translate('Yes') + this.api.translate(' delete it!'),
    }).then((result) => {
      if (result.value) {
        const param = {
          id: item.id,
        };
        this.spinner.show();
        this.api
          .post('rating/deleteList', param)
          .then(
            (datas: any) => {
              this.spinner.hide();
              if (datas && datas.status === 200) {
                this.getReviews();
              } else {
                this.spinner.hide();
                this.error(this.api.translate('Something went wrong'));
              }
            },
            (error) => {
              this.spinner.hide();
              console.log(error);
              this.error(this.api.translate('Something went wrong'));
            }
          )
          .catch((error) => {
            this.spinner.hide();
            console.log(error);
            this.error(this.api.translate('Something went wrong'));
          });
      }
    });
  }
}
