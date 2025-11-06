import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common';
import { OrderDetailMaster } from 'src/app/Models/orderdetail';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css'],
})
export class ManageOrdersComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: OrderDetailMaster = new OrderDetailMaster();
  formTitle = 'Pending Orders';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['CUSTOMER_NAME', 'Customer Name'],
    ['CART_ID', 'Cart ID'],
    ['ORDER_DATETIME', 'Order DateTime'],
    ['MOBILE_NO', 'Mobile No.'],
    ['ORDER_NUMBER', 'Order Number'],
    ['TOTAL_AMOUNT', 'Total Amount'],
    ['ADDON_AMOUNT', 'Addon Amount'],
    ['NET_AMOUNT', 'Net Amount'],
    ['CITY ', 'CITY'],
    ['STATE_NAME', 'STATE_NAME'],
    ['COUNTRY_NAME', 'COUNTRY_NAME'],
    ['ORDER_TOTAL_QTY', 'ORDER_TOTAL_QTY'],
    ['PINCODE', 'PINCODE'],
  ];

  istodaysdate: any = 'default';
  islastsevendays: any = 'default';
  iscurrentmonth: any = 'default';
  startValue: any;
  endValue: any;
  filterClass: string = 'filter-invisible';

  data1: OrderDetailMaster[] = [];
  isSpinning = false;
back() {
    this.router.navigate(['/masters/menu']);
  }
  constructor(
    private datePipe: DatePipe,
    private api: ApiServiceService,
    private notify: NzNotificationService,
    private router:Router
  ) {}

  date3: any;
  date4: any;
  current = new Date();
  yesterday = new Date(new Date().setDate(new Date().getDate() - 7));

  ngOnInit(): void {
    this.isSpinning = false;

    this.date3 = this.datePipe.transform(this.yesterday, 'yyyy-MM-dd 00:00:00');
    this.date4 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 23:59:59');
  }

  keyup(event: any) {
    this.search();
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
  }

  showexcel: any[] = [];
  DownloadExcel() {
    // this.isOk = true;
    // this.isSpinning = true;
    // if (this.totalRecords == 0) {
    //   this.isOk = false;
    //   this.isSpinning = false;
    //   this.message.error('There is No Data Found..', '');
    // } else {
    //   this.api.getmaster(0, 0, '', '', this.query +this.filterQuery).subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         this.totalRecords = data['count'];
    //         this.showexcel = data['data'];
    //         for (let i = 0; i <= this.showexcel.length; i++) {
    //           if (this.showexcel[i]?.START_TIME != undefined && this.showexcel[i]?.END_TIME != undefined){
    //           this.showexcel[i]["START_TIME"]=this.datePipe.transform(this.getTimeIn12Hour(this.showexcel[i]["START_TIME"]),'HH:mm:a')
    //           this.showexcel[i]["END_TIME"]=this.datePipe.transform(this.getTimeIn12Hour(this.showexcel[i]["END_TIME"]),'HH:mm:a')
    //           this.showexcel[i].DATE=this.datePipe.transform(this.showexcel[i]?.DATE,'dd-MM-yyyy')
    //           }
    //           if (this.showexcel[i]?.BOOKING_STATUS != undefined) {
    //             console.log(this.showexcel[i]['BOOKING_STATUS']);
    //             if (this.showexcel[i]?.BOOKING_STATUS == 'BS') {
    //               this.showexcel[i].BOOKING_STATUS = 'Booking Stopped';
    //             } else if (this.showexcel[i]?.BOOKING_STATUS == 'S') {
    //               this.showexcel[i].BOOKING_STATUS = 'Booking Started';
    //             } else if (this.showexcel[i]?.BOOKING_STATUS == 'NSY') {
    //               this.showexcel[i].BOOKING_STATUS =
    //                 'Booking Not Started Yet';
    //             } else if (this.showexcel[i]?.BOOKING_STATUS == 'BF') {
    //               this.showexcel[i].BOOKING_STATUS = 'Booking Full';
    //             } else if (this.showexcel[i]?.BOOKING_STATUS == 'SC') {
    //               this.showexcel[i].BOOKING_STATUS = 'Show Cancelled';
    //             }
    //           }
    //         }
    //         this.isSpinning = false;
    //         const element = window.document.getElementById('downloadExcel');
    //         if (element != null) element.click();
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // }
  }

  cart = [];

  search(reset: boolean = false) {
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

    this.api
      .getAllOrderMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        " AND CURRENT_STAGE = 'A'" + likeQuery + this.filterQuery
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
            // this.notify.error('Something Went Wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  OrdersID: any;
  edit(data: OrderDetailMaster): void {
    this.OrdersID = data.ID;
    // console.log('orderID', this.OrdersID);
    this.drawerTitle = 'Order Details';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.drawerData.ORDER_STATUS = 'A';

    // console.log(JSON.parse(data['CART_ITEMS']))
    // var a = JSON.parse(this.drawerData.CART_ITEMS);
    // console.log(a);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  // current = new Date();

  date1 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 00:00:00');
  date2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 23:59:59');

  type: any;

  todaysdate(event: any) {
    this.isFilterApplied = 'primary';
    this.istodaysdate = 'primary';
    this.islastsevendays = 'default';
    this.iscurrentmonth = 'default';

    // this.startValue = null;
    // this.endValue = null;

    this.filterQuery =
      " AND date(ORDER_DATETIME) between '" +
      this.date1 +
      "' AND '" +
      this.date2 +
      "' ";

    // this.type = null;
    this.applyFilter();
  }

  //  date3 = this.datePipe.transform(new Date(this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-' + (this.current.getDate()-7)), 'yyyy-MM-dd 00:00:00');
  //  date4 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 23:59:59');

  lastsevendays(event: any) {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 7));
    this.date3 = this.datePipe.transform(yesterday, 'yyyy-MM-dd 00:00:00');

    this.date4 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 23:59:59');

    // this.clearFilter();

    // this.isFilterApplied = 'primary';
    this.isFilterApplied = 'primary';
    this.istodaysdate = 'default';
    this.islastsevendays = 'primary';
    this.iscurrentmonth = 'default';
    // this.startValue = null;
    // this.endValue = null;
    // this.type = null;
    this.filterQuery =
      " AND date(ORDER_DATETIME) between '" +
      this.date3 +
      "' AND '" +
      this.date4 +
      "' ";

    this.applyFilter();
  }

  date5 = this.datePipe.transform(
    new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    ),
    'yyyy-MM-dd 00:00:00'
  );
  date6 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 23:59:59');

  currentmonth(event: any) {
    // this.clearFilter();
    // this.isFilterApplied = 'primary';
    this.isFilterApplied = 'primary';
    this.istodaysdate = 'default';
    this.islastsevendays = 'default';
    this.iscurrentmonth = 'primary';

    this.startValue = null;
    this.endValue = null;
    // this.type = null;

    this.filterQuery =
      " AND date(ORDER_DATETIME) between '" +
      this.date5 +
      "' AND '" +
      this.date6 +
      "' ";
    this.applyFilter();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.dataList = [];
    // this.date1 = null ;
    // this.date2 = null ;
    // this.date3 = null ;
    // this.date4 = null ;
    // this.date5 = null ;
    // this.date6 = null ;
    this.filterQuery = '';

    // this.type = null;
    this.isFilterApplied = 'default';
    this.istodaysdate = 'default';
    this.islastsevendays = 'default';
    this.iscurrentmonth = 'default';

    this.search();
  }

  applyFilter() {
    this.isFilterApplied = 'primary';
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

    this.api
      .getAllOrderMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        " AND CURRENT_STAGE = 'A'" + filter
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
            this.loadingRecords = false;

            this.notify.error('Something went wrong', ' ');
          }
        },
        (err) => {
          console.log(err);
        }
      );
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
}
