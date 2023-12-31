import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emails-details',
  templateUrl: './emails-details.component.html',
  styleUrls: ['./emails-details.component.css']
})
export class EmailsDetailsComponent implements OnInit {
  email: any;
  message: any;
  name: any;
  reply: any;
  constructor(
    public api: ApisService,
    public util: UtilService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
  ) {
    this.api.auth();
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        const param = {
          id: data.id
        };
        this.spinner.show();
        // contacts/getById
        this.api.post('contacts/getById', param).then((info: any) => {
          this.spinner.hide();
          console.log(info);
          if (info && info.status === 200) {
            const res = info.data[0];
            console.log('res--->', res);
            this.email = res.email;
            this.message = res.message;
            this.name = res.name;
          }
        }).catch(error => {
          console.log(error);
          this.spinner.hide();
        });
      } else {
        this.navCtrl.back();
      }
    });
  }

  ngOnInit(): void {
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


  submit() {
    if (this.reply === '') {
      this.error('please add reply message');
      return false;
    }
    const param = {
      email: this.email,
      reply: this.reply
    };
    this.spinner.show();
    this.api.post('users/replyToContact', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      Toast.fire({
        icon: 'success',
        title: 'message sent successfully'
      });
      this.navCtrl.back();
    }).catch(error => {
      console.log(error);
    });
  }
}
