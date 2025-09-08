import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CountryMaster } from 'src/app/Models/CountryMaster';
import { FAQMasterData } from 'src/app/Models/FAQ_DATA';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-faqadd',
  templateUrl: './faqadd.component.html',
  styleUrls: ['./faqadd.component.css'],
})
export class FAQAddComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: FAQMasterData = new FAQMasterData();
  @Input()
  drawerVisible: boolean = false;
  @Input()
  productId: any;
  isSpinning = false;
  isOk = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^[6-9]\d{9}$/;
  openingdate = new Date();
  current = new Date();
  dateFormat = 'dd-MM-yyyy';
  parentaccount: any;
  parentgroup: any;
  parenttype: any;
  type: any;
  group: any;
  main: any;
  isFocused: string = '';
  country: CountryMaster[] = [];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadCountry();
    this.data.PRODUCT_ID = this.productId;
  }
  ///

  loadCountry() {
    this.api.getAllCountryMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        this.country = data['data'];
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
      }
    );
  }

  close(): void {
    this.drawerClose();
  }
  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ///Allow only characters
  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  ///// Allow only number and character
  numchar(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 32) return true;
    if (48 <= charCode && charCode <= 57) return true;
    if (65 <= charCode && charCode <= 90) return true;
    if (97 <= charCode && charCode <= 122) return true;
    return false;
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new FAQMasterData();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.data.QUESTION?.trim() == '' || !this.data.QUESTION) &&
      (this.data.ANSWER?.trim() == '' || !this.data.ANSWER)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields ', '');
    } else if (
      !this.data.QUESTION ||
      this.data.QUESTION == '' ||
      this.data.QUESTION == null ||
      this.data.QUESTION == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Question', '');
    } else if (
      !this.data.ANSWER ||
      this.data.ANSWER == '' ||
      this.data.ANSWER == null ||
      this.data.ANSWER == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Answer', '');
    }
    if (!this.isOk) return;
    this.isSpinning = true;

    if (this.data.ID) {
      this.api.updateFAQ(this.data).subscribe(
        (successCode) => {
          if (successCode.code == '200') {
            this.message.success('FAQ Updated Successfully...', '');
            if (!addNew) this.drawerClose();
          } else {
            this.message.error('FAQ Updation Failed...', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSpinning = false;
        }
      );
    } else {
      this.api.createFAQ(this.data).subscribe(
        (successCode) => {
          if (successCode.code == '200') {
            this.message.success('FAQ Created Successfully...', '');
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new FAQMasterData();
              this.resetDrawer(websitebannerPage);
            }
          } else {
            this.message.error('FAQ Creation Failed...', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSpinning = false;
        }
      );
    }
  }
}
