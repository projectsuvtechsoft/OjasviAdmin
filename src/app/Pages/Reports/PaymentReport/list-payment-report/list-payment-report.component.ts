// import { DatePipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-payment-report',
  templateUrl: './list-payment-report.component.html',
  styleUrls: ['./list-payment-report.component.css'],
})
export class ListPaymentReportComponent implements OnInit {
  ngOnInit(): void {
    this.isSpinning = true;
    this.loadingRecords = false;
    this.loadCustomer();
  }

  loadname = false;

  loadCustomer() {
    this.loadname = true;
    this.service.getCustomerMaster(0, 0, this.sortKey, '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.dataList1 = data['data'];
          console.log(this.dataList1);
          this.loadname = false;
        } else {
          this.notify.error("Data Can't Load", '');
        }
      },
      (err) => {
        console.log(err);
        this.loadname = false;
      }
    );
  }

  type: any;

  Title = 'Payment Report';
  dataList: any[] = [];
  dataList1: any[] = [];
  dataList2: any[] = [];
   exportLoading: boolean = false;

  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  startValue: any;
  endValue: any;
  endOpen = false;
  startOpen = false;
  sortValue: string = 'asc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  filterClass: string = 'filter-invisible';
  isSpinning = false;
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['CUSTOMER_NAME', 'Customer Name'],
    // ['TOTAL_ORDER_COUNT', 'Total Order Count'],
    ['PAID_AMOUNT', 'Total Amount'],
    // ['PAYMENT_MODE', 'PAYMENT_MODE'],
    ['PAYMENT_DATETIME', 'PAYMENT_DATE'],
  ];

  constructor(
    private datePipe: DatePipe,
    private service: ApiServiceService,
    private notify: NzNotificationService,
    private _exportService: ExportService,
    private router: Router
  ) {}

  today2 = new Date();
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-' +
    new Date().getDate().toString();
  current = new Date();
  month = this.today;

  timeDefaultValue = setHours(new Date(), 0);

  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today2) > 0;

  moduleStartDateHandle(open: boolean) {
    if (!open) {
      this.endOpen = true;
    }
  }

  dates: any = [];

  disabledEndDate2 = (current: Date): any => {
    let index = this.dates.findIndex(
      (date: any) => date === moment(current).format('YYYY-MM-DD')
    );
    return index === -1 && true;
  };

  startDateChange() {
    var startDate = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    var endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    console.log(this.getDaysArray(startDate, endDate));
    console.log(this.dates);
  }

  getDaysArray(start: any, end: any) {
    for (
      var arr:any = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
      this.dates.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
    }
    return arr;
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
  }
  keyup(event: any) {
    this.search();
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    console.log('type1 ' + this.type);

    this.isFilterApplied = 'primary';
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.startValue = this.datePipe.transform(
      this.startValue,
      'yyyy-MM-dd 00:00:00'
    );
    this.endValue = this.datePipe.transform(
      this.endValue,
      'yyyy-MM-dd 23:59:59'
    );

    if (
      this.startValue != undefined &&
      this.endValue != undefined &&
      this.type != undefined
    ) {
      this.filterQuery =
        " AND DATE(PAYMENT_DATETIME) between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' " +
        ' AND CUSTOMER_ID = ' +
        this.type;
      this.filterClass = 'filter-invisible';
    } else if (this.startValue != undefined && this.endValue != undefined) {
      this.filterQuery =
        " AND DATE(PAYMENT_DATETIME) between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";
      this.filterClass = 'filter-invisible';
    } else if (
      this.type != undefined &&
      this.startValue == undefined &&
      this.endValue == undefined
    ) {
      this.filterQuery = ' AND CUSTOMER_ID = ' + this.type;
      this.filterClass = 'filter-invisible';
    } else if (this.startValue == undefined && this.endValue != undefined) {
      this.notify.error('', ' Please Select Start Date');
      this.isFilterApplied = 'default';
      this.loadingRecords = false;
    } else if (this.endValue == undefined && this.startValue != undefined) {
      this.notify.error('', ' Please Select End Date');
      this.isFilterApplied = 'default';
      this.loadingRecords = false;
    } else if (
      this.startValue != undefined &&
      this.type != undefined &&
      this.endValue == undefined
    ) {
      this.notify.error('', ' Please Select End Date');
      this.isFilterApplied = 'default';
      this.loadingRecords = false;
    } else if (
      this.endValue != undefined &&
      this.type != undefined &&
      this.startValue == undefined
    ) {
      this.notify.error('', 'Please Select Start Date');
      this.isFilterApplied = 'default';
      this.loadingRecords = false;
    } else {
      this.notify.error('', 'Please Select Any Filter Value');
      this.isFilterApplied = 'default';
      this.loadingRecords = false;
    }

    var likeQuery = '';
    console.log('search text:' + this.searchText);
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
      console.log('likeQuery' + likeQuery);
    }
    var filter = '';
    if (this.searchText != '') {
      filter = likeQuery + this.filterQuery;
    } else {
      filter = this.filterQuery;
      console.log(filter);
    }
    this.query = filter

    if (this.filterQuery != '') {
      this.service
        .getAllpaymentreport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          filter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
              // this.isSpinning = false;
            } else {
              // this.isSpinning = false;

              this.notify.error('Something went wrong', ' ');
            }
          },
          (err) => {
            console.log(err);
          }
        );

      this.service
        .getAllpaymentreport(
          0,
          0,
          this.sortKey,
          sort,
          filter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList2 = data['data'];

              this.loadingRecords = false;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;

              this.notify.error('Something went wrong', ' ');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.dataList = [];
    this.startValue = null;
    this.endValue = null;
    this.filterQuery = '';
    this.month = this.today;
    this.type = null;
    this.isFilterApplied = 'default';
    // this.DownloadExcel1();

    this.search();
  }
  query: any;
  search(reset: boolean = false,exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    console.log('search text:' + this.searchText);
    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
      console.log('likeQuery' + likeQuery);
      this.query = likeQuery + this.filterQuery;
    }
    var filter = '';
    if (this.searchText != '') {
      filter = likeQuery + this.filterQuery;
    } else {
      filter = this.filterQuery;
      console.log(filter);
    }
    this.query = filter
if (exportInExcel == false) {
    this.service
      .getAllpaymentreport(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        filter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];

            this.loadingRecords = false;
          } else {
            this.notify.error('Something went wrong', ' ');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }else{
   this.service
      .getAllpaymentreport(0, 0, this.sortKey, sort, filter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
           this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList2 = data['data'];
             this.convertInExcel();
            this.isSpinning = false;
          } else {
            this.dataList2 = [];
              this.exportLoading = false;
            this.loadingRecords = false;
            this.isSpinning = false;
            this.notify.error('Something Went wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
 
  }

  // DownloadExcel() {
  //   this.isSpinning = true;
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
  //   } catch (error) {
  //     sort = '';
  //   }
  //   var likeQuery = '';
  //   console.log('search text:' + this.searchText);
  //   if (this.searchText != '') {
  //     likeQuery = ' AND(';
  //     this.columns.forEach((column) => {
  //       likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
  //     });
  //     likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
  //     console.log('likeQuery' + likeQuery);
  //   }
  //   var filter = '';
  //   if (this.searchText != '') {
  //     filter = likeQuery + this.filterQuery;
  //   } else {
  //     filter = this.filterQuery;
  //     console.log(filter);
  //   }
  //   this.service
  //     .getAllpaymentreport(0, 0, this.sortKey, sort, filter)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.loadingRecords = false;
  //           this.totalRecords = data['count'];
  //           this.dataList2 = data['data'];
  //           this.isSpinning = false;
  //         } else {
  //           this.loadingRecords = false;
  //           this.isSpinning = false;
  //           this.notify.error('Something went Wrong', '');
  //         }
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  // }
  isOk: boolean = false;
  DownloadExcel1() {
    this.isOk = true;
    this.isSpinning = true;
    if (this.totalRecords == 0) {
      this.isOk = false;
      this.isSpinning = false;
      this.notify.error('There is No Data Found..', '');
    } else {
      this.service.getAllpaymentreport(0, 0, '', '', this.query).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList2 = data['data'];
            this.isSpinning = false;
            const element = window.document.getElementById('downloadExcel');
            if (element != null) element.click();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    console.log(currentSort);

    console.log('sortOrder :' + sortOrder);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
    this.loadingRecords = false;
  }


    importInExcel() {
    this.search(true, true);
  }


    convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList2.length > 0) {
      for (var i = 0; i < this.dataList2.length; i++) {
        obj1["Payment Datetime"] = this.dataList2[i]["PAYMENT_DATETIME"]
          // ? this.datePipe.transform(
          //   this.dataList2[i]["REGISTRATION_DATE"],
          //   "dd/MM/yyyy"
          // )
          || "-";
        obj1["Customer Name"] = this.dataList2[i]["CUSTOMER_NAME"];
        obj1["Paid Amount"] = this.dataList2[i]["PAID_AMOUNT"];
        
        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList2.length - 1) {
          this._exportService.exportExcel(
            arry1,
            "Payment Report" +
            this.datePipe.transform(new Date(), "dd/MM/yyyy")
          );
        }
      }
    } else {
      this.notify.error("There is a No Data", "");
    }
  }
}
