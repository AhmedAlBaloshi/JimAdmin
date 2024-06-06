import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {

  complaints: any;
  dummy = Array(5);
  dummyCates: any[] = [];
  page: number = 1;

  constructor(
    private router: Router,
    private toastyService: ToastyService,
    public api: ApisService,
    private spinner: NgxSpinnerService,
  ) {
    this.api.auth();
    this.getComplaints()
  }

  ngOnInit(): void {
  }

  getComplaints() {
    this.complaints = [];
    this.dummy = Array(10);
    let queryParam = '';
    this.api.get('general/complaintsList').then((datas: any) => {
      this.dummy = [];
      if (datas && datas.data && datas.data.length) {
        this.complaints = datas.data;
        this.dummyCates = this.complaints;
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
    this.complaints = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.complaints = this.dummyCates;
  }

  setFilteredItems() {
    this.complaints = [];
    this.complaints = this.dummyCates;
  }

  filterItems(searchTerm) {
    return this.complaints.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.user_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
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

}
