import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CountryMaster } from 'src/app/Models/CountryMaster';
import { StateMaster } from 'src/app/Models/StateMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-addstate',
  templateUrl: './addstate.component.html',
  styleUrls: ['./addstate.component.css'],
})
export class AddstateComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: StateMaster = new StateMaster();
  @Input()
  drawerVisible: boolean = false;
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

  ngOnInit(): void 
  {
    this.loadCountry() 
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
    this.data = new StateMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
 
 save(addNew: boolean, websitebannerPage: NgForm): void {
  this.isOk = true;

  if (
    (this.data.NAME?.trim() == '' || !this.data.NAME) &&
    (this.data.SHORT_CODE?.trim() == '' || !this.data.SHORT_CODE) &&
    (!this.data.COUNTRY_ID || this.data.COUNTRY_ID <= 0)
  ) {
    this.isOk = false;
    this.message.error('Please Fill All Required Fields ', '');
  } 
  else if (!this.data.COUNTRY_ID || this.data.COUNTRY_ID <= 0) {
    this.isOk = false;
    this.message.error('Please Select Country', '');
  } 
  else if (!this.data.NAME?.trim()) {
    this.isOk = false;
    this.message.error('Please Enter State Name', '');
  } 
  else if (!this.data.SHORT_CODE?.trim()) {
    this.isOk = false;
    this.message.error('Please Enter Short Code', '');
  } 
  else if (!this.data.SEQUENCE_NO || this.data.SEQUENCE_NO <= 0) {
    this.isOk = false;
    this.message.error('Please Enter Sequence Number', '');
  }

  if (!this.isOk) return;

  this.isSpinning = true;
  this.api.getAllStateMaster(0, 0, '', 'desc', '').subscribe(
    (allData: any) => {
      const states = allData?.data || [];

      const nameExists = states.some(
        (s: any) =>
          s.COUNTRY_ID === this.data.COUNTRY_ID &&
          s.NAME.trim().toLowerCase() === this.data.NAME.trim().toLowerCase() &&
          s.ID !== this.data.ID
      );

      const shortCodeExists = states.some(
        (s: any) =>
          s.SHORT_CODE.trim().toLowerCase() === this.data.SHORT_CODE.trim().toLowerCase() &&
          s.ID !== this.data.ID
      );

      const sequenceExists = states.some(
        (s: any) =>
          Number(s.SEQUENCE_NO) === Number(this.data.SEQUENCE_NO) &&
          s.ID !== this.data.ID
      );

      if (nameExists) {
        this.message.error('State name already exists for the selected country', '');
        this.isSpinning = false;
        return;
      }
      if (shortCodeExists) {
        this.message.error('Short code already exists', '');
        this.isSpinning = false;
        return;
      }
      if (sequenceExists) {
        this.message.error('Sequence number already exists', '');
        this.isSpinning = false;
        return;
      }

      if (this.data.ID) {
        this.api.updateStateMaster(this.data).subscribe(
          (successCode) => {
            if (successCode.code == '200') {
              this.message.success('State Updated Successfully...', '');
              if (!addNew) this.drawerClose();
            } else {
              this.message.error('State Updation Failed...', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error('Something went wrong, please try again later', '');
            this.isSpinning = false;
          }
        );
      } else {
        this.api.createStateMaster(this.data).subscribe(
          (successCode) => {
            if (successCode.code == '200') {
              this.message.success('State Created Successfully...', '');
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new StateMaster();
                this.resetDrawer(websitebannerPage);
                this.api.getAllStateMaster(1, 1, '', 'desc', '').subscribe(
                  (data) => {
                    if (data['count'] == 0) {
                      this.data.SEQUENCE_NO = 1;
                    } else {
                      this.data.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
                    }
                  },
                  () => {
                    this.message.error('Something went wrong, please try again later', '');
                  }
                );
              }
            } else {
              this.message.error('State Creation Failed...', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error('Something went wrong, please try again later', '');
            this.isSpinning = false;
          }
        );
      }
    },
    () => {
      this.message.error('Something went wrong, please try again later', '');
      this.isSpinning = false;
    }
  );
}

}
