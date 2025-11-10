import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OrderDetailMaster } from 'src/app/Models/orderdetail';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-despatching-ordersview',
  templateUrl: './despatching-ordersview.component.html',
  styleUrls: ['./despatching-ordersview.component.css'],
})
export class DespatchingOrdersviewComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datepipe: DatePipe
  ) {}
  loadingRecords1 = false;

  detailslist: any;
  loaddata: any;

  @Input()
  OrdersID: any;

  ngOnInit(): void {
    this.loaddata = true;
    let filter=" AND CURRENT_STAGE = 'D'"
    if(this.OrdersID){
      filter+= " AND ID = " + this.OrdersID
    }
    this.api
      .getAllOrderMaster(
        0,
        0,
        '',
        '',
        filter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loaddata = false;
            this.detailslist = JSON.parse(data['data']?.[0]?.['CART_ITEMS']);
          } else {
            this.loaddata = false;
            // this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );

    // this.data.ACTUAL_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(new Date(),'yyyy-MM-dd HH:mm:ss')
    // this.data.ACTUAL_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
    //   new Date(),
    //   'yyyy-MM-dd 00:00:00'
    // );
  }

  radioval = 'A';

  @Input()
  drawerClose!: Function;
  @Input()
  data: OrderDetailMaster = new OrderDetailMaster();
  @Input()
  drawerVisible: boolean = false;
  rejectremark: OrderDetailMaster[] = [];

  isSpinning = false;

  ///
  dateFormat = 'dd-MM-yyyy';

  todays = new Date();

  // disabled = (current: Date): boolean =>
  //   differenceInCalendarDays(current, this.todays) < 0;

  filteredOptions: any[] = [];

  close(): void {
    this.drawerClose();
  }

  isOk = true;

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new OrderDetailMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  today2 = new Date();
  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today2) < 0;

  // update(addNew: boolean, websitebannerPage: NgForm): void {
  //   //PREPARE_DISPATCH_ID
  //   this.isSpinning = false;
  //   this.isOk = true;

  //   if (
  //     this.data.EXPECTED_PREPARE_PACKAGING_DATETIME == undefined ||
  //     this.data.EXPECTED_PREPARE_PACKAGING_DATETIME == null
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Select Expected Packaging Date. ', '');
  //   }

  //   if (this.isOk) {
  //     // this.isSpinning=false;
  //     // this.data.DISPATCH_ID = Number(sessionStorage.getItem("userId"))

  //     // this.data.ORDER_STATUS = 'D'
  //     // this.data.ACTUAL_DISPATCH_DATETIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  //     this.data.EXPECTED_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
  //       new Date(this.data.EXPECTED_PREPARE_PACKAGING_DATETIME),
  //       'yyyy-MM-dd HH:mm:ss'
  //     );

  //     this.isSpinning = true;
  //     if (this.data.ID) {
  //       this.api.updateOrderMaster(this.data).subscribe((successCode) => {
  //         if (successCode.code == '200') {
  //           this.message.success(' Information Updated Successfully...', '');
  //           if (!addNew) this.drawerClose();
  //           this.isSpinning = false;
  //         } else {
  //           this.message.error(' Failed To Update Information...', '');
  //           this.isSpinning = false;
  //         }
  //       });
  //     }
  //   }

  //   // else
  //   // {
  //   //   this.message.error("Please Fill All Required Fields...","");
  //   //   this.isSpinning = false;

  //   // }
  // }

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
  userId = sessionStorage.getItem('userId');
  public commonFunction = new CommonFunctionService();
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    console.log('websitebannerPage', websitebannerPage);

    if (this.data.TRACKING_ID == undefined || this.data.TRACKING_ID == null) {
      this.isOk = false;
      this.message.error('Please Enter Tracking Id. ', '');
    } else if (
      this.data.COURIER_NAME == undefined ||
      this.data.COURIER_NAME == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Courier Name. ', '');
    }else if (
      this.data.TRACKING_LINK == undefined ||
      this.data.TRACKING_LINK == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Tracking Link. ', '');
    }

    if (this.isOk) {
      this.data.TO_STAGE = 'Ready For Delivery';
      this.data.FROM_STAGE = 'Delivery In Progress';
      this.data.CURRENT_STAGE = 'DD';
      this.data.ORDER_STATUS = 'DD';
      this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';

      this.data.ACTUAL_DISPATCH_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      // this.data.EXPECTED_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
      //   new Date(this.data.EXPECTED_PREPARE_PACKAGING_DATETIME),
      //   'yyyy-MM-dd HH:mm:ss'
      // );

      // this.isSpinning=false;PREPARE_PACKAGING_ID
      // this.data.PREPARE_PACKAGING_ID = Number(sessionStorage.getItem('userId'));

      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateOrderMaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

   calculatePercent(data){
  //  console.log(arr,'arr')
  let val=((Number((data.TOTAL_AMOUNT - data.TOTAL_DISCOUNT_AMOUNT).toFixed(2)) / data.TOTAL_AMOUNT) * 100).toFixed(2)
  return val
 }
}
