
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
// importing the fonts and icons needed
import pdfFonts from "./../../../assets/vfs_fonts.js";
import { pdfCustomFonts } from "./../../config/pdfFonts";
import { styles, defaultStyle } from "./../../config/customStyles";
// import the pdfmake library
import pdfMake from "pdfmake/build/pdfmake";

// PDFMAKE fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = pdfCustomFonts;

class Order {
  id: string;
  storeName: string;
  status: string;
  paymentMethod: string;
  customerAddress: string;
  dateTime: string;
  delivery: number;
  total: number;

  constructor(id = null, storeName = null, status = null, paymentMethod = null, customerAddress = null, dateTime = null, delivery = null, total = null) {
    this.id = id;
    this.storeName = storeName;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.customerAddress = customerAddress;
    this.dateTime = dateTime;
    this.delivery = delivery;
    this.total = total;
  }
}
class Invoice {
  driverName: string;
  address: string;
  contactNo: number;

  orders: Order[] = [];
  additionalDetails: string;

  constructor() {
    // Initially one empty product row we will show
    //this.orders.push(new Order());
  }
}

@Component({
  selector: 'app-driver-stats',
  templateUrl: './driver-stats.component.html',
  styleUrls: ['./driver-stats.component.css']
})
export class DriverStatsComponent implements OnInit {
  did: any;
  from: any;
  to: any;
  dname: any;
  driverOrders: any[] = [];
  driverOrdersAll: any[] = [];
  drivers: any[] = [];
  totalShippingAmount = 0;
  totalOrdersAmount = 0;
  totalOrdersAmountWithoutDelivery = 0;
  totalCashOrdersAmount = 0;
  totalCashOrdersAmountWithoutDelivery = 0;
  totalAllOrdersAmount = 0;
  totalAllOrdersAmountWithoutDelivery = 0;
  totalCashAllOrdersAmount = 0;
  totalCashAllOrdersAmountWithoutDelivery = 0;
  includePaidOrders = false;

  apiCalled: boolean;

  invoice = new Invoice();

  dtOptions: DataTables.Settings = {};

  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private util: UtilService
  ) {
    this.api.auth();
    this.getDrivers();
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20
    };
  }

  getDrivers() {
    this.spinner.show();
    this.api.get('drivers').then((data: any) => {
      this.spinner.hide();
      console.log(data);
      if (data && data.status === 200 && data.data.length) {
        this.drivers = data.data.filter(x => x.status === '1');
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    });
  }


  getName() {
    return this.dname + '_' + moment(this.from).format('DDMMYYYY') + '_' + moment(this.to).format('DDMMYYYY');
  }

  getDate(date) {
    return moment(date).format('LL');
  }
  getCurrency() {

  }
  today() {
    return moment().format('LLL');
  }
  getCommisions(total) {

  }

  resetDriverOrders() {
    if (this.did && this.from && this.to) {
      let driverName;
      const filteredDriver = this.drivers.filter(x => x.id === this.did);
      if (filteredDriver && filteredDriver.length) {
        driverName = filteredDriver[0].first_name + ' ' + filteredDriver[0].last_name;
      }
      const param = {
        did: this.did,
        start: moment(this.from).format('YYYY-MM-DD HH:mm:00'), //moment(this.from, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
        end: moment(this.to).format('YYYY-MM-DD HH:mm:59'), //moment(this.to, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
        changeDateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      this.spinner.show();
      this.apiCalled = false;
      this.api.post('orders/setDriverOrdersToPaid', param).then((respData: any) => {
        this.apiCalled = true;
        this.spinner.hide();
        console.log(respData);
        if (respData && respData.status === 200 && respData.data == true) {
          Swal.fire({
            title: "Success",
            text: "Driver: " + driverName + " orders has been set to PAID",
            icon: 'success',
            backdrop: false,
            background: 'white'
          });
        } else {
          Swal.fire({
            title: "Faild",
            text: "Driver: " + driverName + " orders has NOT been set to PAID\nPlease try again!",
            icon: 'error',
            backdrop: false,
            background: 'white'
          });
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
        this.apiCalled = true;
        this.error('Something went wrong');
      }).catch((error) => {
        this.spinner.hide();
        console.log(error);
        this.apiCalled = true;
        this.error('Something went wrong');
      });
    } else {
      console.log('not valid');
      this.error('All Fields are required');
      return false;
    }
  }

  getStats() {
    if (this.did && this.from && this.to) {
      const filteredDriver = this.drivers.filter(x => x.id === this.did);
      if (filteredDriver && filteredDriver.length) {
        this.dname = filteredDriver[0].first_name + ' ' + (filteredDriver[0].last_name != null?filteredDriver[0].last_name:'');
        // invoice store details
        this.invoice.driverName = filteredDriver[0].first_name + " " + (filteredDriver[0].last_name != null?filteredDriver[0].last_name:'');
        this.invoice.contactNo = filteredDriver[0].mobile;
        this.invoice.address = filteredDriver[0].address;
      }
      const param = {
        did: this.did,
        start: moment(this.from).format('YYYY-MM-DD HH:mm:00'), //moment(this.from, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
        end: moment(this.to).format('YYYY-MM-DD HH:mm:59'), //moment(this.to, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
        includePaidOrders: this.includePaidOrders == true ? 1 : 0
      };
      this.spinner.show();
      this.apiCalled = false;
      this.driverOrders = [];
      this.invoice.orders = [];
      this.api.post('drivers/getDriverStat', param).then((respData: any) => {
        this.apiCalled = true;
        this.spinner.hide();
        if (respData && respData.status === 200 && respData.data.calculatedOrdersList) {
          this.totalShippingAmount = respData.data.totalDeliveryAmount;
          this.totalOrdersAmount = respData.data.totalOrdersAmount;
          this.totalOrdersAmountWithoutDelivery = respData.data.totalOrdersAmountWithoutDelivery;
          this.totalCashOrdersAmount = respData.data.totalCashOrdersAmount;
          this.totalCashOrdersAmountWithoutDelivery = respData.data.totalCashOrdersAmountWithoutDelivery;
          respData.data.calculatedOrdersList.forEach((element) => {
            this.driverOrders.push(element);
            this.invoice.orders.push(new Order(element.paid, element.str_name_en + " | " + (element.str_name_ar).split(' ').reverse().join(' '), element.status, element.pay_method, element.customer_adrs_en + " | " + (element.customer_adrs_ar).split(' ').reverse().join(' '), element.time, element.zone_shipping_price, element.zone_shipping_price));
          });
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
        this.apiCalled = true;
        this.error('Something went wrong');
      }).catch((error) => {
        this.spinner.hide();
        console.log(error);
        this.apiCalled = true;
        // this.error('Something went wrong');
      });

      // get all orders
      this.driverOrdersAll = [];
      this.api.post('drivers/getDriverStatWhereAllOrders', param).then((respData: any) => {
        this.apiCalled = true;
        if (respData && respData.status === 200 && respData.data.calculatedOrdersList) {
          this.totalAllOrdersAmount = respData.data.totalOrdersAmount;
          this.totalAllOrdersAmountWithoutDelivery = respData.data.totalOrdersAmountWithoutDelivery;
          this.totalCashAllOrdersAmount = respData.data.totalCashOrdersAmount;
          this.totalCashAllOrdersAmountWithoutDelivery = respData.data.totalCashOrdersAmountWithoutDelivery;
          respData.data.calculatedOrdersList.forEach((element) => {
            this.driverOrdersAll.push(element);
          });
        }
      }, error => {
        console.log(error);
        this.apiCalled = true;
        this.error('Something went wrong');
      }).catch((error) => {
        console.log(error);
        this.apiCalled = true;
        this.error('Something went wrong');
      });
    } else {
      console.log('not valid');
      this.error('All Fields are required');
      return false;
    }
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

  generatePDF(action = 'open') {
    let totalDelivery: any = this.invoice.orders.reduce((sum, item) => (sum + parseFloat(item.delivery + "")), 0).toFixed(3);
    let totalAmount: any = this.invoice.orders.reduce((sum, item) => (sum + parseFloat(item.total + "")), 0).toFixed(3);

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      content: [
        {
          text: 'Jim Gate | ' + "بوابة جيم".split(' ').reverse().join(' '),
          fontSize: 16,
          alignment: 'center',
          color: '#2e3192'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#e08d29'
        },
        {
          text: 'From: ' + moment(this.from).format('M/D/YYYY 00:00:00') + ' To: ' + moment(this.to).format('M/D/YYYY 23:59:59'),
          fontSize: 10,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#000000'
        },
        {
          text: 'Driver Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: "Name: " + this.invoice.driverName,
                bold: true
              },
              { text: "Contact: " + this.invoice.contactNo },
              { text: "Address: " + this.invoice.address }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              {
                text: 'Bill No : ', //`Bill No : ${((Math.random() * 1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Orders Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [{ text: '#', style: 'tableHeader' },
              { text: 'ID', style: 'tableHeader' },
              { text: 'Store Name', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' },
              { text: 'Payment', style: 'tableHeader' },
              { text: 'Customer Address', style: 'tableHeader' },
              { text: 'Date/Time', style: 'tableHeader' },
              { text: 'Delivery', style: 'tableHeader' },
              { text: 'Amount', style: 'tableHeader' }],
              ...this.invoice.orders.map((item, i) => ([
                { text: i, bold: false, fontSize: 9 },
                { text: item.id, bold: false, fontSize: 9 },
                { text: item.storeName, bold: false, fontSize: 9 },
                { text: item.status, bold: false, fontSize: 9 },
                { text: item.paymentMethod, bold: false, fontSize: 9 },
                { text: item.customerAddress, bold: false, fontSize: 9 },
                { text: item.dateTime, bold: false, fontSize: 9 },
                { text: item.delivery, bold: false, fontSize: 9 },
                { text: item.total, bold: false, fontSize: 9 }
              ])),
              [{ text: 'Total Delivery', colSpan: 8, style: 'tableFooter' }, {}, {}, {}, {}, {}, {}, {}, { text: parseFloat(totalDelivery).toFixed(3), fontSize: 12 }],
              [{ text: 'Total Amount', colSpan: 8, style: 'tableFooter' }, {}, {}, {}, {}, {}, {}, {}, { text: parseFloat(totalAmount).toFixed(3), fontSize: 12 }],
            ],
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
          text: this.invoice.additionalDetails,
          margin: [0, 0, 0, 15]
        },
        {
          columns: [
            [{ qr: `${this.invoice.driverName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
          ul: [
            'All prices are in OMR.',
            'This invoice includes ONLY delivered orders.',
            'This is system generated invoice.',
          ],
        }
      ],
      styles,
      defaultStyle
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
}
