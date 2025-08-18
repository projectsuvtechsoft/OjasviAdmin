import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { OrderDetailMaster } from 'src/app/Models/orderdetail';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-delivered-orders',
  templateUrl: './delivered-orders.component.html',
  styleUrls: ['./delivered-orders.component.css'],
})
export class DeliveredOrdersComponent implements OnInit {
  constructor(private api: ApiServiceService) {}

  ngOnInit(): void {}

  keyup(event: any) {
    this.search();
  }

  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: OrderDetailMaster = new OrderDetailMaster();
  formTitle = 'Delivered Orders';
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

    ['ACTUAL_DISPATCH_DATETIME', 'ACTUAL_DISPATCH_DATETIME'],

    ['MOBILE_NO', 'Mobile No.'],
    ['ORDER_TOTAL_QTY', 'ORDER_TOTAL_QTY No.'],

    ['ORDER_NUMBER', 'Order Number'],
    ['TOTAL_AMOUNT', 'Total Amount'],
    ['ADDON_AMOUNT', 'Addon Amount'],
    ['NET_AMOUNT', 'Net Amount'],
    ['CURRENT_STAGE', 'Order Status'],
    ['PINCODE', 'PINCODE'],
    ['CITY', 'CITY'],
    ['STATE_NAME', 'STATE_NAME'],
    ['COUNTRY_NAME', 'COUNTRY_NAME'],
  ];

  data1: OrderDetailMaster[] = [];
  isSpinning = false;

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    // this.loadingRecords = true;
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
        likeQuery + " AND CURRENT_STAGE = 'OD' "
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
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
    this.drawerTitle = ' Dispatched  Details';
    this.drawerData = Object.assign({}, data);
    // this.drawerData.ACTUAL_PREPARE_PACKAGING_DATETIME = this.datepipe
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
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
