import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OrderDetailMaster } from 'src/app/Models/orderdetail';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-view-packaged-orders',
  templateUrl: './view-packaged-orders.component.html',
  styleUrls: ['./view-packaged-orders.component.css'],
})
export class ViewPackagedOrdersComponent implements OnInit {
  detailslist: any;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datepipe: DatePipe
  ) {}

  // this.detailslist = JSON.parse(data['data'][0]['CART_ITEMS'])
  dates: any = [];
  loaddata: any;
  @Input()
  confirmdate: any;

  date: any;

  today2 = new Date();
  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.date) < 0;

  disabledEndDate2 = (current: Date): any => {
    let index = this.dates.findIndex(
      (date: any) => date === moment(current).format('YYYY-MM-DD')
    );
    return index === -1 && true;
  };

  @Input()
  OrdersID: any;

  ngOnInit(): void {
    this.loaddata = true;
    let filter = " AND CURRENT_STAGE = 'PD'";
    if (this.OrdersID) {
      filter += 'AND ID = ' + this.OrdersID;
    }
    this.api.getAllOrderMaster(0, 0, '', '', filter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.loaddata = false;
          this.detailslist = JSON.parse(data['data'][0]['CART_ITEMS']);
        } else {
          this.loaddata = false;
          // this.message.error('Something Went Wrong', '');
        }
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('dd', this.confirmdate);
    this.date = new Date(this.confirmdate);
    // this.date = this.datepipe.transform(new Date (this.confirmdate), 'yyyy-MM-dd');
    console.log('date', this.date);
  }

  radioval = 'A';

  loadingRecords1 = false;

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
  userId = sessionStorage.getItem('userId');
  public commonFunction = new CommonFunctionService();
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    // console.log(this.data.ACTUAL_PREPARE_PACKAGING_DATETIME);
    // console.log(this.data.EXPECTED_PREPARE_PACKAGING_DATETIME);

    if (
      this.data.EXPECTED_DISPATCH_DATETIME == undefined ||
      this.data.EXPECTED_DISPATCH_DATETIME == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Expected Dispatch Date. ', '');
    }

    if (this.isOk) {
      this.data.TO_STAGE = 'Dispatched';
      this.data.FROM_STAGE = 'Ready For Dispatch';
      this.data.CURRENT_STAGE = 'D';
      this.data.ORDER_STATUS = 'D';
      this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';

      // this.data.ACTUAL_DISPATCH_DATETIME = this.datepipe.transform(
      //   new Date(),
      //   'yyyy-MM-dd HH:mm:ss'
      // );
      this.data.EXPECTED_DISPATCH_DATETIME = this.datepipe.transform(
        new Date(this.data.EXPECTED_DISPATCH_DATETIME),
        'yyyy-MM-dd HH:mm:ss'
      );

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

  // delivered(addNew: boolean, websitebannerPage: NgForm): void {
  //   this.isSpinning = false;
  //   this.isOk = true;

  //   // console.log(this.data.ACTUAL_PREPARE_PACKAGING_DATETIME);
  //   // console.log(this.data.EXPECTED_PREPARE_PACKAGING_DATETIME);

  //   // if (
  //   //   this.data.EXPECTED_PREPARE_PACKAGING_DATETIME == undefined ||
  //   //   this.data.EXPECTED_PREPARE_PACKAGING_DATETIME == null
  //   // ) {
  //   //   this.isOk = false;
  //   //   this.message.error('Please Select Expected Preparing Date. ', '');
  //   // }

  //   if (this.isOk) {
  //     this.data.TO_STAGE = 'Delivered';
  //     this.data.FROM_STAGE = 'Delivery In Progress';
  //     this.data.CURRENT_STAGE = 'OD';
  //     this.data.ORDER_STATUS = 'DP';
  //     this.data.USER_ID = Number(sessionStorage.getItem('userId'));

  //     this.data.ACTUAL_DELIVERY_DATETIME = this.datepipe.transform(
  //       new Date(),
  //       'yyyy-MM-dd HH:mm:ss'
  //     );
  //     // this.data.EXPECTED_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
  //     //   new Date(this.data.EXPECTED_PREPARE_PACKAGING_DATETIME),
  //     //   'yyyy-MM-dd HH:mm:ss'
  //     // );

  //     // this.isSpinning=false;PREPARE_PACKAGING_ID
  //     // this.data.PREPARE_PACKAGING_ID = Number(sessionStorage.getItem('userId'));

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
  // }
  // Inprogress(addNew: boolean, websitebannerPage: NgForm): void {
  //   this.isSpinning = false;
  //   this.isOk = true;

  //   // console.log(this.data.ACTUAL_PREPARE_PACKAGING_DATETIME);
  //   // console.log(this.data.EXPECTED_PREPARE_PACKAGING_DATETIME);

  //   // if (
  //   //   this.data.EXPECTED_PREPARE_PACKAGING_DATETIME == undefined ||
  //   //   this.data.EXPECTED_PREPARE_PACKAGING_DATETIME == null
  //   // ) {
  //   //   this.isOk = false;
  //   //   this.message.error('Please Select Expected Preparing Date. ', '');
  //   // }

  //   if (this.isOk) {
  //     this.data.TO_STAGE = 'Delivery In Progress';
  //     this.data.FROM_STAGE = 'Dispatched';
  //     this.data.CURRENT_STAGE = 'DP';
  //     this.data.ORDER_STATUS = 'DD';
  //     this.data.USER_ID = Number(sessionStorage.getItem('userId'));

  //     // this.data.ACTUAL_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
  //     //   new Date(),
  //     //   'yyyy-MM-dd HH:mm:ss'
  //     // );
  //     // this.data.EXPECTED_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
  //     //   new Date(this.data.EXPECTED_PREPARE_PACKAGING_DATETIME),
  //     //   'yyyy-MM-dd HH:mm:ss'
  //     // );

  //     // this.isSpinning=false;PREPARE_PACKAGING_ID
  //     // this.data.PREPARE_PACKAGING_ID = Number(sessionStorage.getItem('userId'));

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
  // }
   calculatePercent(data){
  //  console.log(arr,'arr')
  let val=((Number((data.TOTAL_AMOUNT - data.TOTAL_DISCOUNT_AMOUNT).toFixed(2)) / data.TOTAL_AMOUNT) * 100).toFixed(2)
  return val
 }
}
