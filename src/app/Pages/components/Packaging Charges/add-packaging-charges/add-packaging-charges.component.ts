import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { packagingcharges } from 'src/app/Models/packagingcharges';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-add-packaging-charges',
  templateUrl: './add-packaging-charges.component.html',
  styleUrls: ['./add-packaging-charges.component.css'],
})
export class AddPackagingChargesComponent implements OnInit {
  @Input()
  drawerClose!: Function;


  
  @Input()
  data: packagingcharges = new packagingcharges();
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
  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.gettabledata()
  }
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
    this.data = new packagingcharges();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  dataList3: any[] = [];

  gettabledata() {
    this.api.getAllPackagingMaster(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          this.dataList3 = data['data'];

          // this.loadingRecords = false;
          // if(this.totalRecords==0){
          //   data.SEQUENCE_NO=1;
          // }
        } else {
          // this.notify.error('Something Went Wrong', '');
          // this.loadingRecords = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
   
    this.isSpinning = false;

    this.isOk = true;

    if (this.data.WEIGHT == 0 && this.data.IN_COUNTRY == 0 && this.data.OUT_COUNTRY == 0 ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields', '');
    }
    else if (this.data.WEIGHT == undefined || this.data.WEIGHT < 1) {
      this.isOk = false;
      this.message.error(' Please Enter Weight Greater Than Equal To One  ', '');
    } else if (this.data.IN_COUNTRY == undefined || this.data.IN_COUNTRY <= 0) {
      this.isOk = false;
      this.message.error(' Please Enter Correct In Country Value ', '');
    }else if (this.data.OUT_COUNTRY == undefined || this.data.OUT_COUNTRY <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Correct Out Country Value  ', '');
    }

    else if(!this.data.ID)
    {

     if (this.dataList3.length > 0) {
      for (let i = 0; i < this.dataList3.length; i++) {
        if (this.dataList3[i]['WEIGHT'] == this.data.WEIGHT) {
          this.isOk = false;
        }
      }
        if (this.isOk == false) {
          this.message.error('Weight Already Exist', '');
        } else {
          this.isOk = true;
        }
      }
    }

    if (this.isOk) {
      // this.isSpinning=false;

      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updatePackagingMaster(this.data).subscribe((successCode) => {
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
          .createPackagingMaster(this.data)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new packagingcharges();
                this.resetDrawer(websitebannerPage);
                // this.api.getAllpackagingcharges(1, 1, '', 'desc', '').subscribe(
                //   (data) => {
                //     if (data['count'] == 0) {
                //       this.data.SEQUENCE_NO = 1;
                //     } else {
                //       this.data.SEQUENCE_NO =
                //         data['data'][0]['SEQUENCE_NO'] + 1;
                //     }
                //   },
                //   (err) => {
                //     console.log(err);
                //   }
                // );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
    // else {
    //   this.message.error('Please Fill All Required Fields...', '');
    //   this.isSpinning = false;
    // }
  }
}
