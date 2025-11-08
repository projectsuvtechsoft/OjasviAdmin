import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OrderDetailMaster } from 'src/app/Models/orderdetail';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-add-orders',
  templateUrl: './add-orders.component.html',
  styleUrls: ['./add-orders.component.css'],
})
export class AddOrdersComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}

  loaddata: any;
  @Input()
  OrdersID: any;

  detailslist: any;
rawPdfUrl : any; 
pdfUrl: SafeResourceUrl;  
imageUrl = appkeys.retriveimgUrl;

ngOnInit(): void {
this.rawPdfUrl = 'assets/sample-invoice.pdf'; 
// this.rawPdfUrl = this.imageUrl + this.data.PDF_URL; 
this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawPdfUrl);
    
    // console.log('orders' + this.OrdersID);
    this.loaddata = true;
    this.api
      .getAllOrderMaster(
        0,
        0,
        '',
        '',
        " AND CURRENT_STAGE = 'A' AND ID = " + this.OrdersID
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
  startValue: any;
  endValue: any;
  endOpen = false;
  startOpen = false;

  // dates: any = [];
  today2 = new Date();
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-' +
    new Date().getDate().toString();
  current = new Date();
  month = this.today;

  disabledEndDate2 = (current: Date): any => {
    let index = this.dates.findIndex(
      (date: any) => date === moment(current).format('YYYY-MM-DD')
    );
    return index === -1 && true;
  };

  startDateChange() {
    var startDate = this.datepipe.transform(this.startValue, 'yyyy-MM-dd');
    var endDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

    console.log(this.getDaysArray(startDate, endDate));
    console.log(this.dates);
  }

  dates: string[] = [];

  getDaysArray(start: any, end: any) {
    const arr: string[] = [];
    const dt = new Date(start);

    while (dt <= new Date(end)) {
      const formattedDate = this.datepipe.transform(dt, 'yyyy-MM-dd');
      if (formattedDate) {
        arr.push(formattedDate);
        this.dates.push(formattedDate);
      }
      dt.setDate(dt.getDate() + 1);
    }

    return arr;
  }

  timeDefaultValue = setHours(new Date(), 0);

  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today2) < 0;

  disabledStartDate3 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.data.EXPECTED_DISPATCH_DATETIME) < 0;

  // disabledStartDate4 = (current: Date): boolean =>
  // differenceInCalendarDays(current, this.data.EXPECTED_BEING_PREPARE) < 0;

  moduleStartDateHandle(open: boolean) {
    if (!open) {
      this.endOpen = true;
    }
  }

  // radioval='A';
  @Input()
  drawerClose!: Function;
  @Input()
  data: OrderDetailMaster = new OrderDetailMaster();
  @Input()
  drawerVisible: boolean = false;
  rejectremark: OrderDetailMaster[] = [];

  isSpinning = false;

  dateFormat = 'dd-MM-yyyy';

  todays = new Date();

  disabled = (current: Date): boolean =>
    differenceInCalendarDays(current, this.todays) < 0;

  filteredOptions: any[] = [];

  onChange(event: Event): void {
    console.log(event);
    this.filteredOptions = this.rejectremark.filter((option) => {
      return option['REJECT_REMARK'].includes(event.toString());
    });
  }

  close(): void {
    this.drawerClose();
  }

  isOk = true;

  loadingRecords1 = false;

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new OrderDetailMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  // update(addNew: boolean, websitebannerPage: NgForm) {
  //   if (
  //     this.data.ORDER_STATUS == 'A' &&
  //     (this.data.EXPECTED_DISPATCH_DATETIME == undefined ||
  //       this.data.EXPECTED_DISPATCH_DATETIME == null)
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Select Expected Dispatch Date. ', '');
  //   } else if (
  //     this.data.ORDER_STATUS == 'A' &&
  //     (this.data.EXPECTED_DELIVERY_DATETIME == undefined ||
  //       this.data.EXPECTED_DELIVERY_DATETIME == null)
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Select Expected Delivery Date. ', '');
  //   }

  //   if (this.isOk) {

  //     // this.roleId = Number(sessionStorage.getItem("userId"))
  //     // this.isSpinning=false;
  //     // this.data.ORDER_CONFIRMED_ID = Number(sessionStorage.getItem("userId"))
  //     // this.data.ORDER_CONFIRMED_DATETIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

  //     this.data.EXPECTED_DELIVERY_DATETIME = this.datepipe.transform(
  //       new Date(this.data.EXPECTED_DELIVERY_DATETIME),
  //       'yyyy-MM-dd HH:mm:ss'
  //     );
  //     this.data.EXPECTED_DISPATCH_DATETIME = this.datepipe.transform(
  //       new Date(this.data.EXPECTED_DISPATCH_DATETIME),
  //       'yyyy-MM-dd HH:mm:ss'
  //     );

  //     console.log('order date time ', this.data.ORDER_CONFIRMED_DATETIME);

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
  userId = sessionStorage.getItem('userId');
  public commonFunction = new CommonFunctionService();
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    // if (
    //   this.data.ORDER_STATUS == 'A' &&
    //   (this.data.EXPECTED_DISPATCH_DATETIME == undefined ||
    //     this.data.EXPECTED_DISPATCH_DATETIME == null)
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Expected Dispatch Date. ', '');
    // } else

    if (
      this.data.ORDER_STATUS == 'R' &&
      (this.data.REJECT_REMARK == undefined || this.data.REJECT_REMARK == null)
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Remark ', '');
    }

    if (this.isOk) {
      this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';

      this.data.FROM_STAGE = 'Order Confirmed';
      this.data.TO_STAGE = 'Reject';
      this.data.ORDER_STATUS = 'R';
      this.data.CURRENT_STAGE = 'N/A';

      // console.log('order date time ', this.data.ORDER_CONFIRMED_DATETIME);
      this.data.ORDER_CONFIRMED_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      this.isSpinning = true;
      // if (this.data.ID) {
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

  Preparing(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.EXPECTED_BEING_PREPARE == undefined ||
      this.data.EXPECTED_BEING_PREPARE == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Expected Preparing Date. ', '');
    } else if (
      this.data.EXPECTED_DELIVERY_DATETIME == undefined ||
      this.data.EXPECTED_DELIVERY_DATETIME == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Expected Delivery Date. ', '');
    }

    if (this.isOk) {
      this.isSpinning = true;

      this.data.FROM_STAGE = 'Order Confirmed';
      this.data.TO_STAGE = 'Preparing';
      this.data.ORDER_STATUS = 'A';
      this.data.CURRENT_STAGE = 'BP';

      // this.data.ORDER_STATUS = 'A';
      this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';

      this.data.EXPECTED_BEING_PREPARE = this.datepipe.transform(
        new Date(this.data.EXPECTED_BEING_PREPARE),
        'yyyy-MM-dd HH:mm:ss'
      );
      this.data.EXPECTED_DELIVERY_DATETIME = this.datepipe.transform(
        new Date(this.data.EXPECTED_DELIVERY_DATETIME),
        'yyyy-MM-dd HH:mm:ss'
      );

      this.data.ORDER_CONFIRMED_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );

      // if (this.data.ID) {
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

      // }
    }
  }

  packaging(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.EXPECTED_PREPARE_PACKAGING_DATETIME == undefined ||
      this.data.EXPECTED_PREPARE_PACKAGING_DATETIME == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Expected Prepare Packaging Date. ', '');
    } else if (
      this.data.EXPECTED_DELIVERY_DATETIME == undefined ||
      this.data.EXPECTED_DELIVERY_DATETIME == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Expected Delivery Date. ', '');
    }

    if (this.isOk) {
      this.isSpinning = true;

      this.data.FROM_STAGE = 'Order Confirmed';
      this.data.TO_STAGE = 'Packaging';
      this.data.ORDER_STATUS = 'SP';
      this.data.CURRENT_STAGE = 'SP';

      // this.data.ORDER_STATUS = 'A';
      console.log('user idddddd', Number(sessionStorage.getItem('userId')));

      this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';
      this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';

      this.data.EXPECTED_PREPARE_PACKAGING_DATETIME = this.datepipe.transform(
        new Date(this.data.EXPECTED_PREPARE_PACKAGING_DATETIME),
        'yyyy-MM-dd HH:mm:ss'
      );
      this.data.EXPECTED_DELIVERY_DATETIME = this.datepipe.transform(
        new Date(this.data.EXPECTED_DELIVERY_DATETIME),
        'yyyy-MM-dd HH:mm:ss'
      );

      this.data.ORDER_CONFIRMED_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );

      // if (this.data.ID) {
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

      // }
    }
  }

  dispatched(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.EXPECTED_DISPATCH_DATETIME == undefined ||
      this.data.EXPECTED_DISPATCH_DATETIME == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Expected  Dispatching Date. ', '');
    } else if (
      this.data.EXPECTED_DELIVERY_DATETIME == undefined ||
      this.data.EXPECTED_DELIVERY_DATETIME == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Expected Delivery Date. ', '');
    }

    if (this.isOk) {
      this.data.TO_STAGE = 'Packaging Done';
      this.data.FROM_STAGE = 'Order Confirmed';
      this.data.CURRENT_STAGE = 'D';
      // this.data.CURRENT_STAGE = 'DD';
      this.data.ORDER_STATUS = 'D';
      this.data.USER_ID = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '0';

      this.data.EXPECTED_DISPATCH_DATETIME = this.datepipe.transform(
        new Date(this.data.EXPECTED_DISPATCH_DATETIME),
        'yyyy-MM-dd HH:mm:ss'
      );

      this.data.ORDER_CONFIRMED_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      this.data.EXPECTED_DELIVERY_DATETIME = this.datepipe.transform(
        new Date(this.data.EXPECTED_DELIVERY_DATETIME),
        'yyyy-MM-dd HH:mm:ss'
      );

      // this.data.ACTUAL_DELIVERY_DATETIME = this.datepipe.transform(
      //   new Date(),
      //   'yyyy-MM-dd HH:mm:ss'
      // );

      // console.log('order date time ', this.data.ORDER_CONFIRMED_DATETIME);

      this.isSpinning = true;
      // if (this.data.ID) {
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

      // }
    }
  }
  invoicevisible = false;

  openInvoiceModal(): void {
    this.invoicevisible = true;
  }

  onModalCancel(): void {
    this.invoicevisible = false;
  }

downloadInvoice(): void {
  fetch(this.rawPdfUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'invoice.pdf';
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('Download error:', error);
    });
}

printInvoice(): void {
  const iframe = document.querySelector('iframe');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  } else {
    console.error('Unable to access iframe for printing.');
  }
}
 calculateAddOnAmount(arr){
  //  console.log(arr,'arr')
 }
}
