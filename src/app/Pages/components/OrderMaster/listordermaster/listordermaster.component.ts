import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-listordermaster',
  templateUrl: './listordermaster.component.html',
  styleUrls: ['./listordermaster.component.css']
})
export class ListordermasterComponent implements OnInit {

  constructor(
    private api: ApiServiceService,
    private notify: NzNotificationService
  ) {}
  ngOnInit(): void {
  }

  @Input()
  drawerClose2!: Function;

  
  @Input()
  dataList: any[] = [];
 
  @Input()
  OrderCustomer: any;

  formTitle = ' Customer Order List ';
  loadingRecords = false;
  totalRecords = 1;
  totalRecords1 = 1;

  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  customerid: any;
  sessionkey: any;

  columns: string[][] = [
    ['NAME', ' Name '],

    ['TOTAL_PRICE', ' total price '],
    ['ADDON_AMOUNT', ' addon amount '],
    ['NET_AMOUNT', 'net amount'],
    ['SAVED_AMOUNT', 'saved amount'],
    ['TOTAL_ITEMS', ' total items'],
    ['ORDER_TOTAL_QTY', 'ORDER_TOTAL_QTY'],
    ['CREATED_DATETIME', 'created datetime'],
    ['CREATED_MODIFIED_DATE', 'created modified date'],
    ['LAST_UPDATED_DATETIME', 'last updated datetime'],
  ];

  // dataList: any = [];

  keyup(event: any) {
    this.search();
  }

  search(reset: boolean = false) {
    console.log('OrderCustomer',this.OrderCustomer);
    
    // console.log(this.customerId, ' this.customerId==0');
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
    .getAllCartMaster(
      this.pageIndex,
      this.pageSize,
      this.sortKey,
      sort,
      ' AND CUSTOMER_ID = ' + this.OrderCustomer +likeQuery +  " AND STATUS = 'P' "
    )
    .subscribe(
      (data) => {
        console.log('show', data);

        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          // this.customerid = data['data'][0]['CUSTOMER_ID']
          // this.sessionkey = data['data'][0]['SESSION_KEY']
          // console.log('session',this.sessionkey)
          // console.log('customer',this.customerid)
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
 isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  showmodal:boolean=false;
  cartitemDataList:any;

  openProjectDetails(data: any) {
  this.cartitemDataList=JSON.parse(data.CART_ITEMS);
  this.showmodal=true;

}
handleProjectCancel(){
   this.showmodal=false;
}
}
