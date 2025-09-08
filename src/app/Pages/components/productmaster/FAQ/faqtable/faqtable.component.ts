import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FAQMasterData } from 'src/app/Models/FAQ_DATA';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-faqtable',
  templateUrl: './faqtable.component.html',
  styleUrls: ['./faqtable.component.css'],
})
export class FAQtableComponent {
  @Input()
  drawerClose2!: Function;
  @Input()
  dataList: any;
  @Input()
  drawerVisible2: boolean = false;

  @Input()
  productId: any;

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: FAQMasterData = new FAQMasterData();
  formTitle = "Manage FAQ's";

  // dataList = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['ANSWER', ' ANSWER '],
    ['QUESTION', ' QUESTION '],
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  keyup(event: any) {
    this.search();
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
    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")";
    }
    this.api
      .getAllFAQs(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ' AND PRODUCT_ID = ' + this.productId
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

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  add(): void {
    this.drawerTitle = ' Add New FAQ ';
    this.drawerData = new FAQMasterData();
    // this.api.getAllFAQMasterData(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
    //   (data) => {
    //     if (data['count'] == 0) {
    //       this.drawerData.SEQUENCE_NO = 1;
    //     } else {
    //       this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );

    this.drawerVisible = true;
  }

  edit(data: FAQMasterData): void {
    this.drawerTitle = ' Update FAQ Information';
    this.drawerData = Object.assign({}, data);
    // this.drawerData.COUNTRY_ID = data['COUNTRY_ID'];
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    // const sortOrder = (currentSort && currentSort.value) || 'asc';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

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

  toggleVisible: boolean = false;
  close(): void {
    this.drawerClose2();
  }
   deleteSingleRecord(row: any) {
    this.loadingRecords = true;

    const drawerData = Object.assign({}, row);
    const payload = {
  
          ID: drawerData.ID,
          // NAME: drawerData.NAME,
    };

    // console.log('Deleting:', payload);

    this.api.FaqMappingDelete(payload).subscribe(
      (res: any) => {
        if (res.code === 200) {
          // this.dataList = this.dataList.filter((item) => item.ID !== row.ID);

          // this.selectedIds.delete(row.ID);
          // this.selectedRows = [];
          // this.allChecked = false;
          this.loadingRecords = false;

          this.message.success('Successfully deleted data.', '');
          this.search();
        } else if (res.code === 400) {
          this.message.info(res.message, '');
          this.loadingRecords = false;
        } else {
          this.message.error('Failed to delete data.', '');
          this.loadingRecords = false;
        }
      },
      (err) => {
        console.error('Failed to delete data.', err);
      }
    );
  }
}
