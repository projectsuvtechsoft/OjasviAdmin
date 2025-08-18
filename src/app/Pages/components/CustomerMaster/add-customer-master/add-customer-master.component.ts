import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomerMaster } from 'src/app/Models/CustomerMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-add-customer-master',
  templateUrl: './add-customer-master.component.html',
  styleUrls: ['./add-customer-master.component.css'],
})
export class AddCustomerMasterComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) {}

  ngOnInit(): void {
    this.gettabledata();
  }

  @Input()
  drawerClose!: Function;
  @Input()
  data: CustomerMaster = new CustomerMaster();
  @Input()
  drawerVisible: boolean = false;
isFocused:string=""
  emailpattern =
    /^(?!.*\.\.)[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

  // pattern="/^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/"

  pass = /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  namepattern1 = /^([a-zA-Z'-.]+ [a-zA-Z'-.]+ [a-zA-Z'-.]+)$/;
  isSpinning = false;
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

 omit(event: any) {
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


  close(): void {
    this.drawerClose();
  }

  //number and dot
  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
  expression = /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  mobpattern = /^(\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;

  isOk = true;

  // onLoginButtonClick(mobileNo: number) {
  //   const url = 'http://aptefoodsweb.uvtechsoft.com/'; // replace with actual login endpoint
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   const body = {
  //     mobileNo: mobileNo
  //   };
  //   this.http.post(url, body, { headers }).subscribe(response => {
  //     // handle login response
  //   }, error => {
  //     // handle login error
  //   });
  // }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new CustomerMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  password: any;
  generateP() {
    this.password = '';
    var str =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      this.password += str.charAt(char);
    }

    return this.password;
  }

  dataList3: any[] = [];
  gettabledata() {
    this.api.getCustomerMaster(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          this.dataList3 = data['data'];

          console.log('this.dataList3', this.dataList3);
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

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.generateP();
    this.isSpinning = false;
    this.isOk = true;
    //  this.data.MOBILE_NO <= 0
    if (
      this.data.NAME.trim() == '' &&
      this.data.PASSWORD.trim() == '' &&
      this.data.MOBILE_NO == undefined
      // &&
      // this.data.SEQUENCE_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (this.data.NAME.trim() == '' || this.data.NAME == undefined) {
      this.isOk = false;
      this.message.error(' Please Enter Full Name Of Customer', '');
    } 
    
    // else if (!this.namepattern1.test(this.data.NAME)) {
    //   this.isOk = false;

    //   this.message.error('Please Enter Full Name Of Customer  ', '');
    // }
    // else if (
    //   this.data.EMAIL_ID.trim() == '' ||
    //   this.data.EMAIL_ID == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Email ', '');
    // } else if (!this.emailpattern.test(this.data.EMAIL_ID)) {
    //   this.isOk = false;

    //   this.message.error('Please Enter Valid Email ', '');
    // }
    else if (this.data.MOBILE_NO == undefined || this.data.MOBILE_NO <= 0) {
      this.isOk = false;
      this.message.error(' Please Enter Mobile Number ', '');
    } else if (!this.mobpattern.test(this.data.MOBILE_NO)) {
      this.isOk = false;

      this.message.error('Please Enter Valid Mobile Number', '');
    }

    else if(!this.data.ID)
    {

     if (this.dataList3.length > 0) {
      for (let i = 0; i < this.dataList3.length; i++) {
        console.log(this.dataList3[i]['MOBILE_NO']);
        if (this.dataList3[i]['MOBILE_NO'] == this.data.MOBILE_NO) {
          this.isOk = false;
        }
      }
        if (this.isOk == false) {
          this.message.error('Mobile No Already Exist', '');
        } else {
          this.isOk = true;
        }
      }
    }
    

    
    
   
    // else if (
    //   this.data.PASSWORD.trim() == '' ||
    //   this.data.PASSWORD == undefined
    // )
    //  {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Password', '');
    // }
    // else if (!this.expression.test(this.data.PASSWORD)) {
    //   this.isOk = false;

    //   this.message.error('Please Enter Valid Password ', '');
    // }

    //
    //   else if (!this.pass.test(this.data.PASSWORD)) {
    //   this.isOk = false;

    //   this.message.error('Please Enter Valid Password', '');
    // }

    if (this.isOk) {
      // this.isSpinning=false;

      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateCustomerMaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Customer Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Customer Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.data.PASSWORD = this.password;
        console.log('Random pass :' + this.data.PASSWORD);
        this.api
          .createCustomerMaster(this.data)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Customer Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new CustomerMaster();
                this.resetDrawer(websitebannerPage);
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
            } else {
              this.message.error(' Failed To Save Customer Information...', '');
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
