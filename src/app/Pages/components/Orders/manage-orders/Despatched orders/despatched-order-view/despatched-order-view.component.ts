import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OrderDetailMaster } from 'src/app/Models/orderdetail';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-despatched-order-view',
  templateUrl: './despatched-order-view.component.html',
  styleUrls: ['./despatched-order-view.component.css'],
})
export class DespatchedOrderViewComponent implements OnInit {
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
    this.api
      .getAllOrderMaster(
        0,
        0,
        '',
        '',
        " AND CURRENT_STAGE = 'DD' AND ID = " + this.OrdersID
      )
      .subscribe(
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
  //     // this.data.EXPECTED_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(new Date( this.data.EXPECTED_PREPARE_PACKAGING_DATETIME), 'yyyy-MM-dd HH:mm:ss');
  //     this.data.ACTUAL_DELIVERY_DATETIME = this.datepipe.transform(
  //       new Date(),
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
  userId = sessionStorage.getItem('userId');
  public commonFunction = new CommonFunctionService();
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.isOk) {
      this.data.TO_STAGE = 'Delivered';
      this.data.FROM_STAGE = 'Ready For Delivery';
      this.data.CURRENT_STAGE = 'OD';
      this.data.ORDER_STATUS = 'OD';
      this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';

      this.data.ACTUAL_DELIVERY_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );

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
}
