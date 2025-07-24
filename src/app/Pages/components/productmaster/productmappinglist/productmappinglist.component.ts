import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ProductMapping } from 'src/app/Models/productmapping';
import { ProductMaster } from 'src/app/Models/productmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-productmappinglist',
  templateUrl: './productmappinglist.component.html',
  styleUrls: ['./productmappinglist.component.css'],
})
export class ProductmappinglistComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: ProductMapping = new ProductMapping();
  formTitle = ' Manage Product Variants ';
  @Input()
  dataList: any[] = [];

  @Input()
  productId: any;

  @Input()
  maintain: any;

  @Input()
  varient: any;

  @Input()
  data: ProductMaster = new ProductMaster();
  @Input()
  drawerClose2!: Function;
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
    ['SIZE', ' Size '],
    ['UNIT_NAME', ' Unit Name '],
    ['RATE', ' Rate '],
    ['OPENING_STOCK', ' Opening Stock '],
    ['CURRENT_STOCK', ' Current Stock '],
    ['OUT_COUNTRY', ' OUT_COUNTRY '],
    ['IN_COUNTRY', ' IN_COUNTRY '],
    ['RATIO_WITH_MAIN_STOCK', ' Ratio With Main Stock '],
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    // console.log(this.maintain)
    // console.log(this.varient)
  }

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
    console.log('search text:' + this.searchText);
    if (this.searchText != '') {
      likeQuery = ' AND(';
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
    }
    this.api
      .getAllProductVarient(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND PRODUCT_ID = ' + this.productId + filter
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.loadingRecords = false;
          //   if (this.totalRecords == 0) {
          //     data.SEQ_NO = 1;
          //   } else {
          //     data.SEQ_NO = this.dataList[this.dataList.length - 1]['SEQ_NO'] + 1;
          //   }
          // },
          // (err) => {
          //   console.log(err);
        } else {
          // this.message.error("Something Went Wrong","");
          this.loadingRecords = false;
        }
      });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.disabled = true;
    this.drawerTitle = ' Add New Varient ';
    this.productId = this.productId;
    this.varient = this.varient;
    this.maintain = this.maintain;
    this.drawerData = new ProductMapping();

    // this.api.getAllProductMapped(1, 1, '', 'desc', '').subscribe(
    //   (data) => {
    // if (data['count']==0){
    //   this.drawerData.SEQ_NO=1;
    // }else
    // {
    //   this.drawerData.SEQ_NO=data['data'][0]['SEQ_NO']+1;
    // }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );

    this.drawerVisible = true;
  }
  disabled: boolean = false;
  edit(data: ProductMapping): void {
    this.disabled = true;
    console.log('mapp disable' + this.disabled);

    this.drawerTitle = ' Update Product Varient';
    this.drawerData = Object.assign({}, data);

    //   }
    //   if(this.totalRecords==0){
    //     data.SEQ_NO=1;
    //   }else{
    //     data.SEQ_NO= this.dataList[this.dataList.length-1]['SEQ_NO']+1
    //   }
    // }, err => {
    //   console.log(err);
    // });
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
