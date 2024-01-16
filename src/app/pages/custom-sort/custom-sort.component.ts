import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-custom-sort',
  templateUrl: './custom-sort.component.html',
  styleUrls: ['./custom-sort.component.scss']
})
export class CustomSortComponent implements OnInit {
  type:any;
  selectedSortOrder:any;
  selectedOrder:any;
  customAmount:any;
  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,

  ) { }

  ngOnInit(): void {
    this.getData()
  }
  getData(){
    this.spinner.show();
    this.api.get('general').then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        if (data && data.data && data.data.length) {
          const info = data.data[0];
         this.type = info.sort_column;
         this.selectedSortOrder = info.sort_order;
         this.selectedOrder = info.sort_value;
         this.customAmount = info.sort_range;
        }
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
  submit() {
      console.log('update');
      const param = {
       type:this.type,
       selectedOrder:this.selectedOrder,
       selectedSortOrder:this.selectedSortOrder,
       customAmount:this.customAmount,
      };
console.log(param)
      // console.log('param', param);
      // this.spinner.show();
      // this.api.post('general/editList', param).then((data: any) => {
      //   console.log('data', data);
      //   this.spinner.hide();
      //   if (data && data.status === 200) {
      //     this.success('Setting updated');
      //     this.haveSave = true;
      //   } else {
      //     this.spinner.hide();
      //     this.error(this.api.translate('Something went wrong'));
      //   }
      // }, error => {
      //   console.log(error);
      //   this.spinner.hide();
      //   this.error(this.api.translate('Something went wrong'));
      // }).catch(error => {
      //   console.log(error);
      //   this.spinner.hide();
      //   this.error(this.api.translate('Something went wrong'));
      // });
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
}
