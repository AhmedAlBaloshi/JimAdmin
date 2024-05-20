import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/app/services/util.service';
// importing the fonts and icons needed
import pdfFonts from "./../../../assets/vfs_fonts.js";
import { pdfCustomFonts } from "./../../config/pdfFonts";
import { styles, defaultStyle } from "./../../config/customStyles";

// import the pdfmake library
import pdfMake from "pdfmake/build/pdfmake";

// PDFMAKE fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = pdfCustomFonts;
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// pdfMake.fonts = {
//   ReadexPro: {
//     normal: 'ReadexPro-Regular.ttf',
//     bold: 'ReadexPro-Medium.ttf',
//     italics: 'ReadexPro-Regular.ttf',
//     bolditalics: 'ReadexPro-Medium.ttf'
//   }
// };

class Order {
  id: string;
  description: string;
  status: string;
  paymentMethod: string;
  dateTime: string;
  unitPrice: number;
  delivery: number;
  discount: number;
  total: number;
  serviceTax: number;

  constructor(id = null, description = null, status = null, paymentMethod = null, dateTime = null, unitPrice = null, delivery = null, discount = null, total = null, serviceTax = null) {
    this.id = id;
    this.description = description;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.dateTime = dateTime;
    this.unitPrice = unitPrice;
    this.delivery = delivery;
    this.discount = discount;
    this.total = total;
    this.serviceTax = serviceTax;
  }
}
class Invoice {
  storeName: string;
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
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  stores: any[] = [];
  storeId: any;
  storecommission: any;
  from: any;
  to: any;
  allOrders: any[] = [];
  storeOrder: any[] = [];
  totalAmount: any = 0;
  commisionAmount: any = 0;
  toPay: any = 0;
  apiCalled: boolean;
  storename: any;
  totalAmountsFromOrder: any = 0;
  groundTotalServiceTax = 0;

  cashPaidOrders = true;
  visaPaidOrders = true;

  invoice = new Invoice();

  dtOptions: DataTables.Settings = {};

  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private util: UtilService
  ) {
    this.api.auth();
    this.getRest();
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20
    };
  }

  getRest() {
    this.stores = [];
    this.spinner.show();
    this.api.get('stores').then((datas: any) => {
      this.spinner.hide();
      console.log(datas);
      if (datas && datas.data.length) {
        this.stores = datas.data;
      }
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

  getStats() {
    this.groundTotalServiceTax = 0;
    if (this.storeId && this.from && this.to && this.storecommission) {
      const filteredStore = this.stores.filter(x => x.uid === this.storeId);
      if (filteredStore && filteredStore.length) {
        this.storename = filteredStore[0].name_en + " - " + filteredStore[0].name_ar;
        //this.storecommission = 19; // parseFloat(filteredStore[0].commission);
        // invoice store details
        this.invoice.storeName = filteredStore[0].name_en;
        this.invoice.contactNo = filteredStore[0].mobile;
        this.invoice.address = filteredStore[0].address_en;
      }
      const param = {
        sid: this.storeId,
        start: moment(this.from).format('YYYY-MM-DD 00:00:00'),
        end: moment(this.to).format('YYYY-MM-DD 23:59:59'),
        cashPaidOrders: this.cashPaidOrders == true ? 1 : 0,
        visaPaidOrders: this.visaPaidOrders == true ? 1 : 0,
      };
      this.spinner.show();
      this.apiCalled = false;
      this.storeOrder = [];
      this.invoice.orders = [];
      this.api.post('orders/storeStats', param).then((data: any) => {
        this.apiCalled = true;
        this.spinner.hide();
        if (data && data.status === 200 && data.data.length) {
          let total = 0;
          data.data.forEach((element) => {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
              element.orders = JSON.parse(element.orders);
              element.time = moment(element.time).format('YYYY-MM-DD HH:mm');
              if (element.status === 'delivered' || element.status === 'undefined') {
                total = total + (parseFloat(element.total));
                this.storeOrder.push(element);
                let description = "";
                element.orders.forEach((elem) => {
                  if (elem.crt_price_type == 'single')
                    description = description + "Name: " + elem.prdct_name_en + " , Price: " + parseFloat((elem.crt_price - elem.product_tax).toString()).toFixed(3) + " , Qty: " + elem.crt_pqty + "\n"
                  else if (elem.crt_price_type == 'selection')
                    description = description + "Name: " + elem.prdct_name_en + " , Price: " + parseFloat((elem.crt_price.price - elem.product_tax).toString()).toFixed(3) + " , Qty: " + elem.crt_pqty + "\n"
                });
                var totalServiceTax : number = 0;
                element.orders.forEach((elem) => {
                  totalServiceTax = totalServiceTax + (parseFloat((Number(elem.product_tax) * Number(elem.crt_pqty)).toString()));
                  this.groundTotalServiceTax = this.groundTotalServiceTax + (parseFloat((Number(elem.product_tax) * Number(elem.quantity)).toString()));
                });
                element.total = (element.total - Number(totalServiceTax));
                element.grand_total = (element.grand_total - Number(totalServiceTax));
                this.invoice.orders.push(new Order(element.paid, description, element.status, element.pay_method, element.time, parseFloat(element.total).toFixed(3), parseFloat(element.delivery_charge).toFixed(3), parseFloat(element.discount).toFixed(3), parseFloat(element.grand_total).toFixed(3), parseFloat(element.serviceTax).toFixed(3)));
                description = "";
              }
            }
          });

          setTimeout(() => {
            function percentage(num, per) {
              return (num / 100) * per;
            }
            const totalPrice = percentage(total, parseFloat(this.storecommission));
            this.commisionAmount = totalPrice.toFixed(3);
            this.totalAmount = total;
            this.toPay = this.commisionAmount;
          }, 1000);
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

  getCommisions(total) {
    return ((parseFloat(total) * this.storecommission) / 100).toFixed(3);
  }

  today() {
    return moment().format('ll');
  }
  getDate(date) {
    return moment(date).format('ll');
  }
  getName() {
    return this.storeOrder[0].name + '_' + moment(this.from).format('DDMMYYYY') + '_' + moment(this.to).format('DDMMYYYY');
  }
  getCurrency() {
    return this.util.currecny;
  }


  generatePDF(action = 'open') {
    let totalPrice: any = this.invoice.orders.reduce((sum, item) => (sum + parseFloat(item.unitPrice + "")), 0).toFixed(3);
    let totalDelivery: any = this.invoice.orders.reduce((sum, item) => (sum + parseFloat(item.delivery + "")), 0).toFixed(3);
    let totalAmount: any = this.invoice.orders.reduce((sum, item) => (sum + parseFloat(item.total + "")), 0).toFixed(3);
    let totalCommission: any = this.getCommisions(this.invoice.orders.reduce((sum, item) => (sum + parseFloat(item.unitPrice + "")), 0));

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
          text: 'Store Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: "Name: " + this.invoice.storeName,
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
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [{ text: '#', style: 'tableHeader' },
              { text: 'ID', style: 'tableHeader' },
              { text: 'Description', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' },
              { text: 'Payment', style: 'tableHeader' },
              { text: 'Date/Time', style: 'tableHeader' },
              { text: 'Price', style: 'tableHeader' },
              { text: 'Delivery', style: 'tableHeader' },
              { text: 'Discount', style: 'tableHeader' },
              { text: 'Tax', style: 'tableHeader' },
              { text: 'Amount', style: 'tableHeader' }],
              ...this.invoice.orders.map((item, i) => ([
                { text: i, bold: false, fontSize: 9 },
                { text: item.id, bold: false, fontSize: 9 },
                { text: item.description, bold: false, fontSize: 9 },
                { text: item.status, bold: false, fontSize: 9 },
                { text: item.paymentMethod, bold: false, fontSize: 9 },
                { text: item.dateTime, bold: false, fontSize: 9 },
                { text: item.unitPrice, bold: false, fontSize: 9 },
                { text: item.delivery, bold: false, fontSize: 9 },
                { text: item.discount, bold: false, fontSize: 9 },
                { text: 0, bold: false, fontSize: 9 },
                { text: item.total, bold: false, fontSize: 9 }
              ])),
              [{ text: 'Total Price', colSpan: 10, style: 'tableFooter' }, {}, {}, {}, {}, {}, {}, {}, {}, {}, { text: parseFloat(totalPrice).toFixed(3), fontSize: 12 }],
              [{ text: 'Total Delivery', colSpan: 10, style: 'tableFooter' }, {}, {}, {}, {}, {}, {}, {}, {}, {}, { text: parseFloat(totalDelivery).toFixed(3), fontSize: 12 }],
              [{ text: 'Total Amount', colSpan: 10, style: 'tableFooter' }, {}, {}, {}, {}, {}, {}, {}, {}, {}, { text: parseFloat(totalAmount).toFixed(3), fontSize: 12 }],
              [{ text: 'Commission (' + this.storecommission + '%)', colSpan: 10, style: 'tableFooter' }, {}, {}, {}, {}, {}, {}, {}, {}, {}, { text: parseFloat(totalCommission).toFixed(3), fontSize: 12 }]
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
            [{ qr: `${this.invoice.storeName}`, fit: '50' }],
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
            'Commission formula = ((total) * storecommission) / 100).',
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
      // pdfMake.createPdf(
      //   docDefinition,
      //   null, // tableLayouts
      //   {
      //     MyFontName: {
      //       normal: 'Roboto-Regular.ttf',
      //       bold: 'Roboto-Medium.ttf',
      //       italics: 'Roboto-Italic.ttf',
      //       bolditalics: 'Roboto-MediumItalic.ttf'
      //     }
      //   },
      //   pdfFonts.pdfMake.vfs).open();
      pdfMake.createPdf(docDefinition).open();
    }
  }
}
