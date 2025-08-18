import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OrderDetailMaster } from 'src/app/Models/orderdetail';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-packaging-list-view',
  templateUrl: './packaging-list-view.component.html',
  styleUrls: ['./packaging-list-view.component.css'],
})
export class PackagingListViewComponent implements OnInit {
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
        " AND CURRENT_STAGE = 'PD' AND ID = " + this.OrdersID
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
userId = sessionStorage.getItem('userId');
  public commonFunction = new CommonFunctionService();
  save(addNew: boolean, websitebannerPage: NgForm): void {
    //PREPARE_DISPATCH_ID
    this.isSpinning = false;
    this.isOk = true;

    if (this.isOk) {
      this.data.TO_STAGE = 'Ready For Dispatch';
      this.data.FROM_STAGE = 'Packaging Done';
      this.data.CURRENT_STAGE = 'PD';
      this.data.ORDER_STATUS = 'PD';
     this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';
      // this.isSpinning=false;
      // this.data.DELIVERY_ID = Number(sessionStorage.getItem("userId"))

      this.data.ACTUAL_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );

      // this.data.ORDER_STATUS = 'DD'
      // this.data.ACTUAL_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
      //   new Date(),
      //   'yyyy-MM-dd HH:mm:ss'
      // );

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
