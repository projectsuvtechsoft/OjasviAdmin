import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-price-logs',
  templateUrl: './price-logs.component.html',
  styleUrls: ['./price-logs.component.css']
})
export class PriceLogsComponent {
formTitle = 'Price Logs';
  @Input()
  dataList: any[] = [];
  // dataList = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'PRODUCT_ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['PRODUCT_NAME', ' Product Name '],
    ['SIZE', ' Size '],
    ['UNIT_NAME', ' Unit Name '],
    ['OLD_PRICE', ' Old Price '],
    ['NEW_PRICE', ' New Price '],
    ['PRICE_CHANGED_DATE', ' Price Changed Date'],
  ];
  
  toggleVisible: boolean = false;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.loadingRecords = false;
    // this.search()
  }

  keyup(event: any) {
    this.search();
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'PRODUCT_ID';
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
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    this.api
      .getproductPriceLogs(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
            this.dataList.forEach(
              (item) => (item.checked = this.selectedIds.has(item.ID))
            );
            //this.updateSelectedRows();
            // if(this.totalRecords==0){
            //   data.SEQUENCE_NO=1;
            // }
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
 
  back() {
    this.router.navigate(['/masters/menu']);
  }
  
  drawerClose(): void {
    this.search();
   
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'PRODUCT_NAME';
    // const sortOrder = (currentSort && currentSort.value) || 'asc';
    const sortOrder = (currentSort && currentSort.value) || 'asc';

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

  //bulk operation
  allChecked = false;
  selectedIds = new Set<number>();
  selectedRows: any[] = [];
  headerToggles: any = {
    STATUS: false,
  };


  updateSelectedRows() {
    // rows on current page
    this.selectedRows = this.dataList.filter((item) =>
      this.selectedIds.has(item.ID)
    );

    // toggle visible if any row selected (even across pages)
    this.toggleVisible = this.selectedIds.size > 0;

    // recalc header toggle values based on selectedRows
    Object.keys(this.headerToggles).forEach((field) => {
      if (this.selectedRows.length) {
        this.headerToggles[field] = this.selectedRows.every((r) => !!r[field]);
      } else {
        this.headerToggles[field] = false;
      }
    });
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

  onStatusChange(row: any, value: boolean): void {

  // 1. update status in row object
  row.STATUS = value ? 1 : 0;

  // 2. call API with complete row data
  this.updateStatus(row);
}

updateStatus(row: number): void {
  //const body = { STATUS: status };

  this.api.updatecustomerProductReviews(row).subscribe(successCode => {
      if(successCode.code=="200")
      {
      this.message.success('Review update successful', '');
    }  
      else
      {
        this.message.error('Failed To Update Information...', '');
       
      }
    });
}

  bulkUpdate(fieldName: string, value: any) {
    this.loadingRecords = true;
    if (this.selectedIds.size === 0) return;

    const payload = {
      DATA: Array.from(this.selectedIds).map((id) => {
        const obj: any = { ID: id };
        obj[fieldName] = value;
        return obj;
      }),
    };

    // this.api.cityBulkUpdate(payload).subscribe(
    //   (res: any) => {
    //     if (res.code == 200) {
    //       this.dataList.forEach((item) => {
    //         if (this.selectedIds.has(item.ID)) {
    //           (item as any)[fieldName] = value;
    //         }
    //         item.checked = false;
    //       });

    //       this.updateSelectedRows();
    //       this.loadingRecords = false;

    //       this.toggleVisible = false;
    //       this.selectedRows = [];
    //       this.selectedIds.clear();
    //       this.allChecked = false;

    //       this.message.success('Bulk update successful', '');
    //     } else {
    //       this.message.error('Bulk update failed', '');
    //       this.loadingRecords = false;
    //     }
    //   },
    //   (err) => {
    //     console.error('Bulk update failed', err);
    //   }
    // );
  }

}
