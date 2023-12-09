import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf'
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-zones',
  templateUrl: './manage-zones.component.html',
  styleUrls: ['./manage-zones.component.scss']
})
export class ManageZonesComponent implements OnInit {
  public mapbox: mapboxgl.Map;
  new: boolean = false;
  centeroid: any;
  id: any;
  selectedZone: any;
  name_en: any = '';
  name_ar: any = '';
  coordinates: any;
  type: any = '';
  city: any = '';
  status: any = '';
  shippingPrice: any;
  shipping: any = 'fixed';
  shippingPriority: any = 0;
  driversShippingPrice: any;

  cities: any[] = [];
  types: any[] = [
    {
      name: 'Red',
      value: 'red'
    },
    {
      name: 'Green',
      value: 'green'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    public util: UtilService
  ) {
    this.api.auth();
    this.route.queryParams.subscribe((data: any) => {
      this.new = data.register === 'true' ? true : false;
      if (!this.new && data.id) {
        this.id = data.id;
        this.selectedZone = JSON.parse(data.selectedZone);
        //this.getZones();
        this.name_en = this.selectedZone.name_en;
        this.name_ar = this.selectedZone.name_ar;
        this.coordinates = JSON.parse(this.selectedZone.coordinates);
        this.type = this.selectedZone.type;
        this.city = this.selectedZone.city;
        this.status = this.selectedZone.status;
        this.shipping = this.selectedZone.shipping;
        this.shippingPrice = this.selectedZone.shipping_price;
        this.shippingPriority = this.selectedZone.shipping_priority;
        this.driversShippingPrice = this.selectedZone.drivers_shipping_price;
      }
    });
  }

  ngOnInit(): void {
    this.initMap();
    this.getCities();
  }

  initMap() {
    this.mapbox = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'mapbox',
      style: `mapbox://styles/mapbox/satellite-v9`,
      zoom: 12,
      center: [58.545284, 23.614328],
      attributionControl: false
    });
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: 'draw_polygon'
    });
    this.mapbox.addControl(draw);
    this.mapbox.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
    );

    this.mapbox.on('load', () => {
      if (!this.new) {
        this.mapbox.resize();
        console.log("this.coordinates", this.coordinates)
        this.drawPolygon(this.coordinates);
        let polygon = turf.polygon(this.coordinates);
        this.centeroid = turf.centerOfMass(polygon).geometry.coordinates;
        this.mapbox.flyTo({
          center: this.centeroid
        });
      }
    });

    this.mapbox.on('draw.create', (ev) => {
      let data = draw.getAll();
      const polygonData: any = data.features[0].geometry;
      this.drawPolygon(polygonData.coordinates);
      this.coordinates = JSON.stringify(polygonData.coordinates);
    });

    this.mapbox.on('draw.delete', (ev) => {
      this.mapbox.removeLayer('maine').removeSource('maine');
      this.coordinates = '';
    });

    this.mapbox.on('draw.update', (ev) => {
      let data = draw.getAll();
      this.mapbox.removeLayer('maine').removeSource('maine');
      const polygonData: any = data.features[0].geometry;
      this.drawPolygon(polygonData.coordinates);
      this.coordinates = polygonData.coordinates;
    });
  }

  drawPolygon(points) {
    //var polygonPoints = JSON.parse(points);
    console.log("points", points)
    //console.log("polygonPoints", polygonPoints)
    var mapSource = this.mapbox.getSource('maine');
    if (typeof mapSource !== 'undefined') {
      this.error("You already have a drawn zone, delete it befor adding new one.");
    }
    // Add a data source containing GeoJSON data.
    this.mapbox.addSource('maine', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        "properties": {},
        'geometry': {
          'type': 'Polygon',
          'coordinates': points
        }
      }
    });
    // Add a new layer to visualize the polygon.
    this.mapbox.addLayer({
      'id': 'maine',
      'type': 'fill',
      'source': 'maine', // reference the data source
      'layout': {},
      'paint': {
        'fill-color': '#ffffff', // white color fill
        'fill-opacity': 0.5
      }
    });
  }

  resetPolygon() {
    this.mapbox.removeLayer('maine').removeSource('maine');
    this.coordinates = '';
  }

  getZones() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('zones/getById', param).then((data: any) => {
      this.spinner.hide();
      if (data && data.status === 200 && data.data.length) {
        const info = data.data[0];
        this.name_en = info.name_en;
        this.name_ar = info.name_ar;
        this.coordinates = JSON.parse(info.coordinates);
        this.type = info.type;
        this.city = info.city;
        this.status = info.status;
        this.shipping = info.shipping;
        this.shippingPrice = info.shipping_price;
        this.shippingPriority = info.shipping_priority;
        this.driversShippingPrice = info.drivers_shipping_price;
      } else {
        this.error('Something went wrong');
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error(error);
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

  create() {
    if (this.name_en === '' || this.name_ar === '' || this.coordinates === '' || this.type === '' || this.city === '') {
      this.error('All Fields are required');
      return false;
    }
    this.spinner.show();
    const param = {
      name_en: this.name_en,
      name_ar: this.name_ar,
      coordinates: this.coordinates,
      type: this.type,
      city: this.city,
      shipping: this.shipping,
      shipping_price: this.shippingPrice,
      shipping_priority: this.shippingPriority,
      status: 1,
      drivers_shipping_price: this.driversShippingPrice
    };
    this.spinner.show();
    this.api.post('zones/createZone', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.data && data.status === 200) {
        this.navCtrl.back();
      } else {
        if (data && data.data && data.data.message) {
          this.error(data.data.message);
          return false;
        }
        this.error(data.message);
        return false;
      }
    });
  }

  update() {
    if (this.name_en === '' || this.name_ar === '' || this.coordinates === '' || this.type === '' || this.city === '') {
      this.error('All Fields are required');
      return false;
    }
    this.spinner.show();
    const param = {
      name_en: this.name_en,
      name_ar: this.name_ar,
      coordinates: JSON.stringify(this.coordinates),
      type: this.type,
      city: this.city,
      shipping: this.shipping,
      shipping_price: this.shippingPrice,
      shipping_priority: this.shippingPriority,
      status: 1,
      drivers_shipping_price: this.driversShippingPrice,
      id: this.id
    };
    this.api.post('zones/editZone', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.data && data.status === 200) {
        this.navCtrl.back();
      } else {
        if (data && data.data && data.data.message) {
          this.error(data.data.message);
          //this.navCtrl.back();
          return false;
        }
        //this.navCtrl.back();
        this.error(data.message);
        return false;
      }
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
}
