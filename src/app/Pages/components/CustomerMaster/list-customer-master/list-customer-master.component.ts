import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
// import { CartAddonMaster } from 'ApteFoods components/CartAddonMaster';
import { NzButtonSize } from 'ng-zorro-antd/button';
// import { Console } from 'console';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CustomerMaster } from 'src/app/Models/CustomerMaster';
import * as moment from 'moment';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-customer-master',
  templateUrl: './list-customer-master.component.html',
  styleUrls: ['./list-customer-master.component.css'],
})
export class ListCustomerMasterComponent implements OnInit {
  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private notify: NzNotificationService,
    private router: Router
  ) {}
tableheight:any;
  date3: any;
  date4: any;
  current = new Date();
   yesterday = new Date(new Date().setDate(new Date().getDate() - 7));

  
  ngOnInit(): void {
    this.isSpinning = false;

    this.date3 = this.datePipe.transform(
      this.yesterday,
      'yyyy-MM-dd 00:00:00'
    );
    this.date4 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 23:59:59');
  }





  size: NzButtonSize = 'small';
  formTitle = 'Manage Customer';
  loadingRecords = true;
  filterClass: string = 'filter-invisible';
  endOpen = false;
  startOpen = false;
  totalRecords = 1;
  isSpinning = false;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  istodaysdate: any = 'default';
  islastsevendays: any = 'default';
  iscurrentmonth: any = 'default';
  startValue: any;
  endValue: any;
  columns: string[][] = [
    ['PASSWORD', ' pass '],
    ['NAME', 'name'],
    ['EMAIL_ID', 'email'],
    ['MOBILE_NO', 'mobile'],
    ['REGISTRATION_DATE', 'REGISTRATION_DATE'],
  ];

  drawerData: CustomerMaster = new CustomerMaster();

  dataList: any[] = [];

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  //Dates

  today2 = new Date();
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-' +
    new Date().getDate().toString();
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
      var arr:any=[],
       dt = new Date(start);
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
 isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  keyup(event: any) {
    this.search();
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  drawerVisible!: boolean;
  drawerTitle!: string;

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
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
      .getCustomerMaster(
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
            // this.logindata = data[0]['CUSTOMER_NUMBER']
            // this.logindata = data['data'][0]['CUSTOMER_NUMBER'];
            this.loadingRecords = false;
            // if(this.totalRecords==0){
            //   data.SEQUENCE_NO=1;
            // }
          } else {
            this.notify.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  totalRecords1 = 1;
  visible = false;

  close1(): void {
    this.visible = false;
  }
  detailsList: any[] = [];

  edit(data: CustomerMaster): void {
    console.log('custmaster ', data);
    this.drawerTitle = ' Update Customer Information';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  add(): void {
    this.drawerTitle = ' Add New Customer ';
    this.drawerData = new CustomerMaster();

    // this.api.getAllCategoryMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
    //   if (data['count']==0){
    //     this.drawerData.SEQUENCE_NO=1;
    //   }else
    //   {
    //     this.drawerData.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
    //   }
    // },err=>{
    //   console.log(err);
    // })
    this.drawerVisible = true;
  }

  cust: any;
  cartdrawerTitle!: string;
  cartdrawerVisible!: boolean;
  cartDataList: any[] = [];

  open1(data: any): void {
    // SESSION_KEY
    // this.visible = true;
    this.cartdrawerTitle = '  Carts ';

    this.cust = data.ID;

    console.log('Customer id from customer master ', this.cust);

    this.api
      .getAllCartMaster(0, 0, 'id', '', ' AND CUSTOMER_ID = ' + this.cust)
      .subscribe((data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          this.cartDataList = data['data'];
          this.cartdrawerVisible = true;
        } else {
          // this.message.error("Something Went Wrong","");
          this.loadingRecords = false;
          this.cartdrawerVisible = true;
        }
      });
    // console.log('this cust  ' + this.cust);
  }

  cartDrawerClose(): void {
    this.search();
    this.cartdrawerVisible = false;
  }
  get cartCloseCallback() {
    return this.cartDrawerClose.bind(this);
  }

  OrderCustomer: any;
  OrderdrawerTitle!: string;
  OrderdrawerVisible!: boolean;
  OrderDataList: any[] = [];

  Orders(data: any): void {
    this.OrderCustomer = data.ID;

    console.log('Cust1' + this.Customer);
    this.OrderdrawerTitle = ' Customer Orders ';
    // this.drawerData = Object.assign({}, data);

    this.api
      .getAllCartMaster(
        0,
        0,
        'id',
        '',
        ' AND CUSTOMER_ID = ' + this.OrderCustomer + " AND STATUS = 'P' "
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          this.OrderDataList = data['data'];
          this.OrderdrawerVisible = true;
        } else {
          // this.message.error("Something Went Wrong","");
          this.loadingRecords = false;
          this.OrderdrawerVisible = true;
        }
      });
    // console.log('this cust  ' + this.Customer);
  }

  OrderDrawerClose(): void {
    this.search();
    this.OrderdrawerVisible = false;
  }
  get OrderCloseCallback() {
    return this.OrderDrawerClose.bind(this);
  }

  Customer: any;
  mapdrawerTitle!: string;
  mapdrawerVisible!: boolean;
  mapDataList: any[] = [];
customerName
custMobileNo
  map(data: any): void {
    this.Customer = data.ID;

    console.log('Cust1' + this.Customer);
    this.mapdrawerTitle = ' Customer Addresses ';
    // this.drawerData = Object.assign({}, data);
this.customerName=data.NAME
this.custMobileNo=data.MOBILE_NO
    this.api
      .getAddressMaster(0, 0, 'id', '', ' AND CUST_ID = ' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          this.mapDataList = data['data'];
          this.mapdrawerVisible = true;
        } else {
          // this.message.error("Something Went Wrong","");
          this.loadingRecords = false;
          this.mapdrawerVisible = true;
        }
      });
    console.log('this cust  ' + this.Customer);
  }

  logindata: any;
  Login(data: any): void {
    console.log('dfg' + data.CUSTOMER_NUMBER);

    // console.log("logindatalogindatalogindata"+this.logindata)

    window.open(
      'http://aptefoodsweb.uvtechsoft.com/direct-login/' + data.CUSTOMER_NUMBER

      // https://www.aptefoods.in/
      // 'https://www.aptefoods.in/direct-login/' + data.CUSTOMER_NUMBER

    );
  }

  mapDrawerClose(): void {
    this.search();
    this.mapdrawerVisible = false;
  }
  get mapCloseCallback() {
    return this.mapDrawerClose.bind(this);
  }

  date1 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 00:00:00');
  date2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 23:59:59');

  type: any;

  todaysdate(event: any) {
    this.isFilterApplied = 'default';
    this.istodaysdate = 'primary';
    this.islastsevendays = 'default';
    this.iscurrentmonth = 'default';

    this.startValue = null;
    this.endValue = null;

    this.filterQuery =
      " AND date(REGISTRATION_DATE) between '" +
      this.date1 +
      "' AND '" +
      this.date2 +
      "' ";

    // this.type = null;
    this.applyFilter();
  }

  lastsevendays(event: any) {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 7));
    this.date3 = this.datePipe.transform(
      yesterday,
      'yyyy-MM-dd 00:00:00'
    );
    
    this.date4 = this.datePipe.transform(new Date(), 'yyyy-MM-dd 23:59:59');

    // this.clearFilter();
    console.log('date3' + this.date3 + 'date3' + this.date4);
    // this.isFilterApplied = 'primary';
    this.isFilterApplied = 'default';
    this.istodaysdate = 'default';
    this.islastsevendays = 'primary';
    this.iscurrentmonth = 'default';
    this.startValue = null;
    this.endValue = null;
    // this.type = null;
    this.filterQuery =
      " AND date(REGISTRATION_DATE) between '" +
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
    this.isFilterApplied = 'default';
    this.istodaysdate = 'default';
    this.islastsevendays = 'default';
    this.iscurrentmonth = 'primary';

    this.filterQuery =
      " AND date(REGISTRATION_DATE) between '" +
      this.date5 +
      "' AND '" +
      this.date6 +
      "' ";
    this.startValue = null;
    this.endValue = null;
    this.applyFilter();
  }

  clearFilter() {
    this.dataList = [];

    this.filterClass = 'filter-invisible';
    this.dataList = [];
    this.startValue = null;
    this.endValue = null;
    this.month = this.today;
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.istodaysdate = 'default';
    this.islastsevendays = 'default';
    this.iscurrentmonth = 'default';

    this.search();
  }

   clearFilter1() {
    this.dataList = [];

    this.dataList = [];
    
    this.month = this.today;
   
    this.isFilterApplied = 'default';
    this.istodaysdate = 'default';
    this.islastsevendays = 'default';
    this.iscurrentmonth = 'default';

    this.search();
  }
  applyFilter() {
    // this.isFilterApplied = 'primary';
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
      .getCustomerMaster(
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
            // if(this.totalRecords==0){
            //   data.SEQUENCE_NO=1;
            // }
          } else {
            this.notify.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  applyFilter1() {
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
      this.notify.error('', 'Please Select Start Date & End Date');
    } else if (this.startValue != undefined && this.endValue == undefined) {
      this.notify.error('', 'Please Select End Date ');
    } else if (this.startValue == undefined && this.endValue != undefined) {
      this.notify.error('', 'Please Select Start Date ');
    } else {
      this.loadingRecords = true;
      this.isFilterApplied = 'primary';

      this.filterQuery =
        " AND REGISTRATION_DATE between '" +
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

      if (this.filterQuery != '') {
        this.api
          .getCustomerMaster(
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
                // if(this.totalRecords==0){
                //   data.SEQUENCE_NO=1;
                // }
              } else {
                this.notify.error('Something Went Wrong', '');
                this.loadingRecords = false;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        // this.api
        //   .getAllOrderMaster(
        //     0,
        //     0,
        //     this.sortKey,
        //     sort,
        //     " AND ORDER_STATUS = 'R'" + this.filterQuery
        //   )
        //   .subscribe(
        //     (data) => {
        //       if (data['code'] == 200) {
        //         this.totalRecords = data['count'];
        //         this.dataList = data['data'];
        //         this.api
        //           .getAllOrderMaster(
        //             0,
        //             0,
        //             this.sortKey,
        //             sort,
        //             " AND ORDER_STATUS = 'R'" + this.filterQuery
        //           )
        //           .subscribe(
        //             (data) => {
        //               if (data['code'] == 200) {
        //                 this.totalRecords = data['count'];
        //                 this.dataList2 = data['data'];

        //                 this.loadingRecords = false;
        //                 this.isSpinning = false;
        //               } else {
        //                 this.isSpinning = false;

        //                 // this.message.error('Something went wrong', ' ');
        //               }
        //             },
        //             (err) => {
        //               console.log(err);
        //             }
        //           );
        //         this.loadingRecords = false;
        //         this.isSpinning = false;
        //       } else {
        //         this.isSpinning = false;

        //         this.message.error('Something went wrong', ' ');
        //       }
        //     },
        //     (err) => {
        //       console.log(err);
        //     }
        //   );
      }
    }
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    // const sortOrder = (currentSort && currentSort.value) || 'asc';
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

 OrdersAll(data: any): void {
    this.OrderCustomer = data.ID;
 
    console.log('Cust1' + this.Customer);
    this.OrderdrawerTitle = ' Customer Orders ';
    // this.drawerData = Object.assign({}, data);
 
    this.api
      .Ordermaster(
        0,
        0,
        'id',
        '',
        ' AND CUSTOMER_ID = ' + this.OrderCustomer
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          this.OrderDataList = data['data'];
          this.OrderdrawerVisible = true;
        } else {
          // this.message.error("Something Went Wrong","");
          this.loadingRecords = false;
          this.OrderdrawerVisible = true;
        }
      });
    // console.log('this cust  ' + this.Customer);
  }
}
