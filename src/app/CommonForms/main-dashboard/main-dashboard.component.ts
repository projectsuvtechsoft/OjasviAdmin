import { Component } from '@angular/core';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent {
   public commonFunction = new CommonFunctionService();
  
   USERNAME = sessionStorage.getItem('userName');
  decreptedUserName = this.USERNAME
    ? this.commonFunction.decryptdata(this.USERNAME)
    : '';

  Emaiid = sessionStorage.getItem('emailId');
  decryptedEmail = this.Emaiid
    ? this.commonFunction.decryptdata(this.Emaiid)
    : '';
}
