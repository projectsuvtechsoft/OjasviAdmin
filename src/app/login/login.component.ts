import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from '../Service/api-service.service';
import { UserMaster } from '../CommonModels/user-master';
import { environment } from 'src/environments/environment.prod';
import { CommonFunctionService } from '../Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';

export class PasswordData {
  TYPE: string;
  TYPE_VALUE: any;
  OTP: any;
  RID: any;
  VID: any;
}

export class ChangePasswordData {
  TYPE: string;
  TYPE_VALUE: any;
  PASSWORD: any;
  CONFIRM_PASSWORD: any;
  VID: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: UserMaster = new UserMaster();
  passwordData = new PasswordData();
  changePasswordData = new ChangePasswordData();
  EMAIL_ID = '';
  PASSWORD = '';
  supportKey = '';
  ORGANIZATION_ID: number | undefined;
  passwordVisible: boolean = false;
  newpasswordVisible: boolean = false;
  isloginSpinning: boolean = false;
  isLogedIn: boolean = false;
  isOk: boolean = true;
  // roleId = localStorage.getItem('roleId');
  // emailPattern: RegExp =
  //   /^(?!.*\.\..*)(?!.*--.*)(?!.*-\.|-\@|\.-|\@-)[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  emailPattern: RegExp =
    /^(?!.*\.\..*)(?!.*--)(?!.*[-.]{2})(?!.*[-@][.@-])[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

  passwordPattern: RegExp =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]{8,20}$/;

  constructor(
    private router: Router,
    private api: ApiServiceService,
    private message: NzNotificationService,
    private cookie: CookieService
  ) { }

  currentApplicationVersion: any;
  public commonFunction = new CommonFunctionService();
  showOTP: boolean = false;
  TYPE_VALUE: any;
  TYPE = 'E';
  OTP: any;
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  ngOnInit(): void {
    // this.currentApplicationVersion = environment.appVersioning.appVersion;
    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      this.isLogedIn = false;
      this.router.navigate(['/login']);
    } else {
      this.isLogedIn = true;

      // if(this.decreptedroleId===1 || this.decreptedroleId===9){
      //   this.router.navigate(['/dashboard']);
      // }else{
      this.router.navigate(['/dashboard']);
      // }
    }
  }

  login(): void {
    if (this.EMAIL_ID == '' && this.PASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID and Password.', '');
    } else if (this.EMAIL_ID == null || this.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (this.PASSWORD == null || this.PASSWORD.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
    } 
    else if (this.PASSWORD.length < 8 || !this.passwordPattern.test(this.PASSWORD.trim())) {
      this.message.error(  'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.', '');
    } 
    else {
      this.isloginSpinning = true;
      var cloudid = this.cookie.get('CLOUD_ID');

      this.api.login(this.EMAIL_ID, this.PASSWORD, cloudid, 'U').subscribe(
        (data) => {
          if (data['code'] == '200') {
            // this.isloginSpinning = false;
           

            this.message.success('Successfully Logged In', '');
            this.cookie.set(
              'token',
              data['data'][0]['token'],
              365,
              '/',
              '',
              false,
              'Strict'
            );
           
            // sessionStorage.setItem(
            //   'mobile',
            //   this.commonFunction.encryptdata(
            //     data['data'][0]['UserData'][0]['MOBILE_NUMBER']
            //   )
            // );
           
           
            sessionStorage.setItem(
              'userId',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['USER_ID'].toString()
              )
            );
            sessionStorage.setItem(
              'userName',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['NAME']
              )
            );
            sessionStorage.setItem(
              'roleId',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['ROLE_ID'].toString()
              )
            );
            sessionStorage.setItem(
              'emailId',
              this.commonFunction.encryptdata(
                data['data'][0]['UserData'][0]['EMAIL_ID']
              )
            );
          
            // sessionStorage.setItem(
            //   'profile_url',
            //   data['data'][0]['UserData'][0]['PROFILE_PHOTO']
            // );
           
            if (
              data['data'][0]['UserData'][0]['LAST_LOGIN_DATETIME'] != null &&
              data['data'][0]['UserData'][0]['LAST_LOGIN_DATETIME'] != undefined
            ) {
              sessionStorage.setItem(
                'lastlogindate',
                this.commonFunction.encryptdata(
                  data['data'][0]['UserData'][0]['LAST_LOGIN_DATETIME']
                )
              );
            }
          

            // SUBSCRIBED_CHANNELS: []
            if(data['data'][0]['UserData'][0]['ROLE_ID']===7 || data['data'][0]['UserData'][0]['ROLE_ID']===6){
               this.router.navigate(['/admin-dashboard']).then(() => {
              window.location.reload();
            });
            }
            else{
            this.router.navigate(['/dashboard']).then(() => {
              window.location.reload();
            });
          }
          } else {
            this.isloginSpinning = false;
            this.message.error('You have entered wrong credentials', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.isloginSpinning = false;
          if (err.error instanceof ErrorEvent) {
            // Client-side or network error
            this.message.error(
              'Network error: Please check your connection and try again.',
              ''
            );
          } else {
            // Backend returned an unsuccessful response code
            this.message.error('Something Went Wrong...', '');
          }
        }
      );
    }
  }

  ForgetClick: boolean = false;
  sendOTPTrue: boolean = false;
  isSpinning: boolean = false;

  isSendOtpSpinning: boolean = false;
  isverifyOtpSpinning: boolean = false;
  isUpdatePassSpinning: boolean = false;

  emailDisabled: boolean = false;

  isOtpVerified: boolean = false;
  NEW_PASSWORD: any = '';
  CONFPASSWORD: any = '';

  newPasswordVisible: boolean = false;
  reEnterNewPasswordVisible: boolean = false;

  isFocused: string = '';

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  forgentPasswordClick() {
    this.ForgetClick = true;
    this.sendOTPTrue = false;
  }
  USER_ID: any;
  USER_NAME: any;
  backoption() {
    this.ForgetClick = false;
    this.sendOTPTrue = false;
    this.OTP = '';
    this.emailDisabled = false;
    this.CONFPASSWORD = '';
    this.NEW_PASSWORD = '';
  }

  sendOTP() {
    if (this.EMAIL_ID == '' && this.PASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID', '');
    } else if (this.EMAIL_ID == null || this.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else {
      // this.ForgetClick = false;

      this.isSendOtpSpinning = true;
      this.api.sendotpp(this.EMAIL_ID).subscribe(
        (successCode: any) => {

          if (successCode.body.code == 200) {
            this.USER_ID = successCode.body.data;
            this.USER_NAME = successCode.body.USER_NAME;
            this.message.success('OTP Send Successfully', '');
            this.emailDisabled = true;
            this.ForgetClick = false;
            this.sendOTPTrue = true;
            this.isSendOtpSpinning = false;
          } else {
            this.message.error('Failed to send otp', '');
            this.isSendOtpSpinning = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSendOtpSpinning = false;
        }
      );
    }
  }

  verifyOTP() {
    if (this.EMAIL_ID == '' && this.PASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID and Password.', '');
    } else if (this.EMAIL_ID == null || this.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.emailPattern.test(this.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (this.OTP === null || this.OTP === '' || this.OTP === undefined) {
      this.isOk = false;
      this.message.error('Please Enter OTP', '');
    } else if (
      this.OTP !== null &&
      this.OTP !== '' &&
      this.OTP !== undefined &&
      this.OTP.length < 4
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid OTP', '');
    } else {
      this.emailDisabled = true;
      this.isverifyOtpSpinning = true;

      this.api.verifyotpp(this.EMAIL_ID, this.OTP).subscribe(
        (successCode: any) => {
          if (successCode.body.code == 200) {
            this.message.success('OTP Verified Successfully', '');
            this.isOtpVerified = true;
            this.isverifyOtpSpinning = false;
          } else {
            this.message.error('OTP Verification Failed', '');
            this.isverifyOtpSpinning = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isverifyOtpSpinning = false;
        }
      );
    }
  }

  changePassword() {
    if (
      this.NEW_PASSWORD == null ||
      this.NEW_PASSWORD == undefined ||
      this.NEW_PASSWORD.trim() == ''
    ) {
      this.message.error('Please enter new password.', '');
    } else if (this.NEW_PASSWORD.length < 8) {
      this.message.error(
        'New Password must be at least 8 characters long.',
        ''
      );
    } else if (!this.passwordPattern.test(this.NEW_PASSWORD.trim())) {
      this.message.error('Password must meet the required pattern', '');
    } else if (
      this.CONFPASSWORD == null ||
      this.CONFPASSWORD == undefined ||
      this.CONFPASSWORD.trim() == ''
    ) {
      this.message.error('Please enter confirm password.', '');
    } else if (this.NEW_PASSWORD !== this.CONFPASSWORD) {
      this.message.error(
        'The new password and the confirmation password is not matched. Please ensure both are same.',
        ''
      );
    } else {
      this.isUpdatePassSpinning = true;
      this.api
        .changepassword(this.NEW_PASSWORD, this.USER_ID, this.EMAIL_ID)
        .subscribe(
          (successCode: any) => {
            if (successCode.body.code == 200) {
              this.message.success('Password Updated Successfully', '');
              this.isUpdatePassSpinning = false;
              this.isOtpVerified = false;
              this.ForgetClick = false;
              this.sendOTPTrue = false;
            } else {
              this.message.error('Password Updation Failed', '');
              this.isUpdatePassSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isUpdatePassSpinning = false;
          }
        );
    }
  }
}