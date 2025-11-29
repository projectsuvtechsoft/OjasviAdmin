import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UnitMaster } from 'src/app/Models/unitmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-addunit',
  templateUrl: './addunit.component.html',
  styleUrls: ['./addunit.component.css'],
})
export class AddunitComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: UnitMaster = new UnitMaster();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
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

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}
  ///
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
    this.data = new UnitMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    // this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.UNIT_NAME.trim() == '' &&
      this.data.UNIT_NAME_MR.trim() == '' &&
      this.data.SEQUENCE_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.data.UNIT_NAME == null ||
      this.data.UNIT_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Unit Name', '');
    } else if (
      this.data.SEQUENCE_NO == undefined ||
      this.data.SEQUENCE_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number. ', '');
    }

  if (this.isOk) {
    this.isSpinning = true;

    this.api.getAllUnitMaster(0, 0, '', 'desc', '').subscribe(
      (allData: any) => {
        const countries = allData?.data || [];

        // const nameExists = countries.some(
        //   (c: any) =>
        //     c.NAME.trim().toLowerCase() === this.data.NAME.trim().toLowerCase() &&
        //     c.ID !== this.data.ID
        // );
        // const shortCodeExists = countries.some(
        //   (c: any) =>
        //     c.SHORT_CODE.trim().toLowerCase() === this.data.SHORT_CODE.trim().toLowerCase() &&
        //     c.ID !== this.data.ID
        // );
       const sequenceExists = countries.some(
          (c: any) =>
            Number(c.SEQUENCE_NO) === Number(this.data.SEQUENCE_NO) &&
            c.ID !== this.data.ID
        );

        // if (nameExists) {
        //   this.message.error('Name already exists', '');
        //   this.isSpinning = false;
        //   return;
        // }
        // if (shortCodeExists) {
        //   this.message.error('Short code already exists', '');
        //   this.isSpinning = false;
        //   return;
        // }
       
        if (sequenceExists) {
          this.message.error('Sequence no. already exists', '');
          this.isSpinning = false;
          return;
        }

        if (this.data.ID) {
        this.api.updateUnitMaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .createUnitMaster(this.data)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new UnitMaster();
                this.resetDrawer(websitebannerPage);
                this.api.getAllUnitMaster(1, 1, '', 'desc', '').subscribe(
                  (data) => {
                    if (data['count'] == 0) {
                      this.data.SEQUENCE_NO = 1;
                    } else {
                      this.data.SEQUENCE_NO =
                        data['data'][0]['SEQUENCE_NO'] + 1;
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
      },
      () => {
        this.message.error('Something went wrong, please try again later', '');
        this.isSpinning = false;
      }
    );
  }
  }
}
