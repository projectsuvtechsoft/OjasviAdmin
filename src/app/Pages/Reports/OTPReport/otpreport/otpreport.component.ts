import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-otpreport',
  templateUrl: './otpreport.component.html',
  styleUrls: ['./otpreport.component.css']
})
export class OTPReportComponent implements OnInit {

  drawerVisible: boolean = false;
  drawerTitle!: string;
  // drawerData: OrderDetailMaster = new OrderDetailMaster();
  
  formTitle = 'Mobile OTP Report';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  exportLoading: boolean = false;
  columns: string[][] = [
    ['MOBILE_NO', 'MOBILE_NO ]'],
    ['REQUESTED_DATETIME', 'REQUESTED_DATETIME'],
    ['OTP', 'OTP'],
    ['MOBILE_VERIFICATION_DATETIME', 'MOBILE_VERIFICATION_DATETIME'],
   
   
  ];

  // data1: OrderDetailMaster[] = [];
  isSpinning = false;
  startValue: any;
  endValue: any;
  filterClass: string = 'filter-invisible';
  dataList2: any = [];
  query: any;
  constructor(
    private datePipe: DatePipe,
    private api: ApiServiceService,
    private message: NzNotificationService,
    private _exportService: ExportService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  keyup(event: any) {
    this.search();
  }

  cart = [];

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
    }
    this.query = likeQuery + this.filterQuery;
     if (exportInExcel == false) {
    this.api
      .getOTPreport(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
       this.filterQuery + likeQuery + " AND TYPE='M'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            // this.cart = JSON.parse(data['data'][0]['CART_ITEMS']);
          } else {
            this.loadingRecords = false;
            // this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }else{
   this.api
      .getOTPreport(
        0,
        0,
        this.sortKey,
        sort,
          this.filterQuery + likeQuery
      )
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
            this.message.error('Something Went wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
 
  }
  
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
  }

  OrdersID: any;
  detailslist: any = [];
 
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  close(): void {
    this.drawerVisible = false;
    this.search();
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
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  applyFilter() {
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

    if (this.startValue == undefined && this.endValue == undefined) {
      this.message.error('', 'Please Select Start Date & End Date');
    } else if (this.startValue != undefined && this.endValue == undefined) {
      this.message.error('', 'Please Select End Date ');
    } else if (this.startValue == undefined && this.endValue != undefined) {
      this.message.error('', 'Please Select Start Date ');
    } else {
      this.loadingRecords = true;
      this.isFilterApplied = 'primary';

      this.filterQuery =
        " AND DATE(REQUESTED_DATETIME) between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";
      this.filterClass = 'filter-invisible';

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
        this.api
          .getOTPreport(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
             likeQuery + this.filterQuery
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.loadingRecords = false;
                this.isSpinning = false;
              } else {
                this.isSpinning = false;

                this.message.error('Something went wrong', ' ');
              }
            },
            (err) => {
              console.log(err);
            }
          );

        this.api
          .getOTPreport(
            0,
            0,
            this.sortKey,
            sort,
           this.filterQuery
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

                this.message.error('Something went wrong', ' ');
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.dataList = [];
    this.startValue = null;
    this.endValue = null;
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    // this.DownloadExcel1();

    this.search();
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

  timeDefaultValue = setHours(new Date(), 0);

  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  // DownloadExcel() {
  //   this.isSpinning = true;
  //   var likeQuery = '';
  //   if (this.searchText != '') {
  //     likeQuery = ' AND (';
  //     this.columns.forEach((column) => {
  //       likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
  //     });
  //     likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
  //     console.log('likeQuery' + likeQuery);
  //   }
  //     this.api.getOTPreport(0, 0, '', '',  " AND CURRENT_STAGE = 'R'" +likeQuery+this.filterQuery).subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           var totalRecords = data['count'];
  //           // console.log('totalRecords' , totalRecords);
  //           this.dataList2 = data['data'];
  //           // console.log('  this.dataList2' ,  this.dataList2);
  //           if (totalRecords == 0) {
  //               this.isSpinning = false;
  //               this.message.error('There is No Data Found..', '');
  //           } else{
  //             if(totalRecords == this.dataList2.length){
  //               this.isSpinning = false;
  //               const element = window.document.getElementById('downloadExcelData');
  //               if (element != null) element.click();
  //             } else{

  //             }
  //           }
  //         }
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  //   }
  // }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isOk: boolean = false;
  DownloadExcel1() {
    this.isOk = true;
    this.isSpinning = true;
    if (this.totalRecords == 0) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('There is No Data Found..', '');
    } else {
      this.api.getOTPreport(0, 0, '', '',  this.query).subscribe(
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

   importInExcel() {
    this.search(true, true);
  }


    convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList2.length > 0) {
      for (var i = 0; i < this.dataList2.length; i++) {
        obj1["Mobile No"] = this.dataList2[i]["MOBILE_NO"];
        obj1["Requested Datetime"] = this.dataList2[i]["REQUESTED_DATETIME"] || "-";

        obj1["OTP"] = this.dataList2[i]["OTP"];
        obj1["Mobile Verification Datetime"] = this.dataList2[i]["MOBILE_VERIFICATION_DATETIME"] || "-";

         

         if (this.dataList2[i]['STATUS'] == '1') {
          obj1['Order Status'] = 'Verified';
        } else if (this.dataList2[i]['STATUS'] == '0') {
          obj1['Order Status'] = 'Not Verified';
        } 
        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList2.length - 1) {
          this._exportService.exportExcel(
            arry1,
            "OTP Report" +
            this.datePipe.transform(new Date(), "dd/MM/yyyy")
          );
        }
      }
    } else {
      this.message.error("There is a No Data", "");
    }
  }
}
