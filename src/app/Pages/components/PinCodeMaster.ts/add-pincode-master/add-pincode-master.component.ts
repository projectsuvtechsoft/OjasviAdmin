import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PincodeMaster } from 'src/app/Models/PincodeMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-add-pincode-master',
  templateUrl: './add-pincode-master.component.html',
  styleUrls: ['./add-pincode-master.component.css'],
})
export class AddPincodeMasterComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: PincodeMaster = new PincodeMaster();
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
  pincode =  /^\d{5}$/



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
    this.data = new PincodeMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    // this.isSpinning = false;
    this.isOk = true;

    if (this.data.PINCODE <= 0 && this.data.SHIPPING_CHARGES <= 0) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (this.data.PINCODE == undefined || this.data.PINCODE <= 0) {
      this.isOk = false;
      this.message.error(' Please Enter Zipcode ', '');
    } 
    else if (!this.pincode.test(this.data.PINCODE)) {
      this.isOk = false;

      this.message.error('Please Enter Valid Zipcode ', '');
    }
    
    
    else if (
      this.data.SHIPPING_CHARGES == undefined ||
      this.data.SHIPPING_CHARGES <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Shipping Charges ', '');
    }
    if(this.isOk)
    {
      // this.isSpinning=false;

      this.isSpinning=true;
     if(this.data.ID)
    {
      this.api.updatePincode(this.data)
      .subscribe((successCode:any) => {
        if(successCode.code=="200")
        {
          this.message.success(" Zipcode Information Updated Successfully...", "");
            if(!addNew)
            this.drawerClose();
            this.isSpinning = false;
        }
        else
        {
          this.message.error("Zipcode Information Updation Failed...", "");
          this.isSpinning = false;
        }
      });
    }
    else{

        this.api.createPincode(this.data)
        // this.type=.TYPE_ID
        .subscribe((successCode:any) => {
          if(successCode.code=="200")
          {
            this.message.success(" Zipcode Information Saved Successfully...", "");
             if(!addNew)
             this.drawerClose();
              else
              {
                this.data=new PincodeMaster();
                this.resetDrawer(websitebannerPage);
                this.isSpinning = false;
                // this.api.getAllUnitMaster(1,1,'','desc','').subscribe (data =>{
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
            }
             else
             {
              this.message.error(" Failed To Save Zipcode Information...", "");
              this.isSpinning = false;
             }
            });
          }
    }

    // else
    // {
    //   this.message.error("Please Fill All Required Fields...","");
    //   this.isSpinning = false;

    // }
  }
}
