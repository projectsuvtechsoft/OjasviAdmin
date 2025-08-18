import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AddressMaster } from 'src/app/Models/AddressMaster';
import { CountryMaster } from 'src/app/Models/CountryMaster';
import { StateMaster } from 'src/app/Models/StateMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
// import { STATE_IDMaster } from 'src/app/Models/STATE_IDMaster';

@Component({
  selector: 'app-add-address-master',
  templateUrl: './add-address-master.component.html',
  styleUrls: ['./add-address-master.component.css'],
})
export class AddAddressMasterComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: AddressMaster = new AddressMaster();
  @Input()
  drawerVisible: boolean = false;

  @Input()
  CustomerId: any;

  isSpinning = false;
  isloadstate = false;
  isOk = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^(\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;

  openingdate = new Date();
  current = new Date();
  dateFormat = 'dd-MM-yyyy';
  parentaccount: any;
  parentgroup: any;
  parenttype: any;
  type: any;
  group: any;
  main: any;
  Customer: any;
  pincode =  /^\d{5}$/;
@Input()customerName:any
@Input()custMobileNo
  AddressData: any = [];
  AddressCount: number = 0;

  state: StateMaster[] = [];
  country: CountryMaster[] = [];
isFocused:string=""
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadCountry();
    this.gettabledata();
    this.getpincodes();
    console.log(this.data.COUNTRY_ID);
    this.FilterCountry(this.data.COUNTRY_ID);
  }

  ///
  close(): void {
    this.drawerClose();
  }

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
 omit1(event: any) {
  const charCode = event.which ? event.which : event.keyCode;
  const allowedChars = [32, 40, 41, 45, 46]; // space, (, ), -, .
  
  // Allow digits (48–57), backspace (8), delete (46), and formatting chars
  if (
    (charCode >= 48 && charCode <= 57) || // digits
    charCode === 8 ||                    // backspace
    allowedChars.includes(charCode)
  ) {
    return true;
  }

  return false;
}
  FilterCountry(event: any) {
    console.log('Event', event);
    // this.loadSTATE_ID();
    this.isloadstate = true;

    this.api
      .getAllStateMaster(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND COUNTRY_ID = ' + event
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.state = data['data'];
            this.isloadstate = false;
          } else {
            this.message.error("Data Can't Load", '');
          }
          console.log(this.state);
        },
        (err) => {
          console.log(err);
          this.isloadstate = false;
        }
      );
    console.log('Filter state called');
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
    this.data = new AddressMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save

  dataList1: any[] = [];

  gettabledata() {
    this.api
      .getAddressMaster(0, 0, '', '', ' AND CUST_ID = ' + this.CustomerId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.totalRecords = data['count'];
            this.dataList1 = data['data'];
            // this.loadingRecords = false;
            // if(this.totalRecords==0){
            //   data.SEQUENCE_NO=1;
            // }
          } else {
            // this.message.error("Something Went Wrong","");
            // this.loadingRecords = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  pincodelist: any[] = [];

  getpincodes() {
    this.api.getPincodeMaster(0, 0, '', '', '  AND STATUS=1 ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          this.pincodelist = data['data'];

          // }
        } else {
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  exist: any;
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.CUST_ID = this.CustomerId;
    this.data.IS_LAST_SHIPPING_ADDRESS = this.data.IS_DEFUALT_ADDRESS;
    // console.log('hgh',this.CustomerId);

    if (
      this.data.NAME.trim() == '' &&
      this.data.ADDRESS.trim() == '' &&
      this.data.LANDMARK.trim() == '' &&
      this.data.LOCALITY.trim() == '' &&
      this.data.MOBILE_NO == undefined &&
      this.data.STATE_ID <= 0 &&
      this.data.CITY.trim() == '' &&
      this.data.PINCODE <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } 
    // else if (this.data.NAME == null || this.data.NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please Enter Customer Name', '');
    // } else if (this.data.MOBILE_NO == undefined || this.data.MOBILE_NO <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Mobile Number ', '');
    // }
    //  else if (!this.mobpattern.test(this.data.MOBILE_NO)) {
    //   this.isOk = false;

    //   this.message.error('Please Enter Valid Mobile Number', '');
    // } 
    else if (this.data.ADDRESS == null || this.data.ADDRESS.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Address', '');
    } 
     else if (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (this.data.STATE_ID == undefined || this.data.STATE_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    }
    // else if (this.data.LANDMARK == null || this.data.LANDMARK.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please Enter Landmark', '');
    // } else if (this.data.LOCALITY == null || this.data.LOCALITY.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please Enter Area', '');
    // } 
    else if (this.data.CITY == null || this.data.CITY.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter City', '');
    } else if (this.data.PINCODE == undefined || this.data.PINCODE <= 0) {
      this.isOk = false;
      this.message.error(' Please Enter Zipcode ', '');
    } else if (!this.pincode.test(this.data.PINCODE)) {
      this.isOk = false;
      this.message.error('Pincode Must Be 6 Digit ', '');
    } else if (this.data.PINCODE != undefined || this.data.PINCODE >= 0) {
      if (this.pincodelist.length > 0) {
        console.log(this.pincodelist);
        // console.log(this.pincodelist.includes(this.data.PINCODE));
        this.exist = this.pincodelist.some(
          (value) => value.PINCODE === this.data.PINCODE
        );
        console.log('this.exist', this.exist);       
        // if (this.exist) {
        //   //////////
        //   this.isOk = true;
        //   this.message.error('Please Select Address Type', '');
        // } else {
        //   this.isOk = false;
        //   this.message.error('Invalid Pincode', '');
        // }
      }
      if (this.exist == false) {
        this.isOk = false;
        this.message.error('Invalid Pincode', '');
      }
    
    else{

         if (!this.data.ID) {
          if (this.dataList1.length > 0) {
            console.log(this.dataList1);
            if (this.data.IS_DEFUALT_ADDRESS == true) {
              for (let i = 0; i < this.dataList1.length; i++) {
                console.log(this.dataList1[i]['IS_DEFUALT_ADDRESS'] == 1);
                if (this.dataList1[i]['IS_DEFUALT_ADDRESS'] == 1) {
                  this.isOk = false;
                }
              }
              if (this.isOk == false) {
                this.message.error('Mark Default Address Already Enabled', '');
              }
            } else {
              this.isOk = true;
            }
          }
        }


      }

    }

    // else if (
    //   this.data.ADDRESS_TYPE == undefined ||
    //   this.data.ADDRESS_TYPE <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Address Type', '');
    // }
    else if (!this.data.ID) {
      if (this.dataList1.length > 0) {
        console.log(this.dataList1);
        if (this.data.IS_DEFUALT_ADDRESS == true) {
          for (let i = 0; i < this.dataList1.length; i++) {
            console.log(this.dataList1[i]['IS_DEFUALT_ADDRESS'] == 1);
            if (this.dataList1[i]['IS_DEFUALT_ADDRESS'] == 1) {
              this.isOk = false;
            }
          }
          if (this.isOk == false) {
            this.message.error('Mark Default Address Already Enabled', '');
          }
        } else {
          this.isOk = true;
        }
      }
    }
this.data.NAME= this.customerName
this.data.MOBILE_NO=this.custMobileNo
    if (this.isOk) {
      this.isSpinning = true;

      // this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateAddressMaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Address Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Address Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .createAddressMaster(this.data)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Address Create Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new AddressMaster();
                this.resetDrawer(websitebannerPage);
                // this.api.getAddressMaster(1,1,'','desc','').subscribe (data =>{
                //   if (data['count']==0){
                //     this.data.SEQUENCE_NO=1;
                //   }else
                //   {
                //     this.data.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
                //   }
                // },err=>{
                //   console.log(err);
                // })
              }
              this.isSpinning = false;
            } else {
              this.message.error('Address Creation Failed...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
}
