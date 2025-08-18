import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UnitMaster } from 'src/app/Models/unitmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-unitlist',
  templateUrl: './unitlist.component.html',
  styleUrls: ['./unitlist.component.css'],
})
export class UnitlistComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: UnitMaster = new UnitMaster();
  formTitle = ' Manage Units ';
  @Input()
  dataList: any[] = [];
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
    ['SEQUENCE_NO', ' Sequence Number '],
    ['UNIT_NAME', ' Unit Name(English) '],
    ['UNIT_NAME_MR', ' Unit Name(Marathi) '],
  ];
  @Input()
  drawerClose2!: Function;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.loadingRecords = false;
    this.search();
  }
  back() {
    this.router.navigate(['/masters/menu']);
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
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      console.log('likeQuery' + likeQuery);
    }
    this.api
      .getAllUnitMaster(
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
  // search(reset: boolean = false) {
  //   if (reset) {
  //     this.pageIndex = 1;
  //     this.sortKey = "id";
  //     this.sortValue = "desc"
  //   }
  //   // this.loadingRecords = true;
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith("a") ? "asc" : "desc";
  //   } catch (error) {
  //     sort = "";
  //   }
  //   var likeQuery = "";
  //   console.log("search text:" + this.searchText);
  //   if (this.searchText != "") {
  //     likeQuery = " AND";
  //     this.columns.forEach(column => {
  //       likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
  //     });
  //     likeQuery = likeQuery.substring(0, likeQuery.length - 2)
  //     console.log("likeQuery" + likeQuery);
  //   }
  //   this.api.getAllUnitMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
  //     this.loadingRecords = false;
  //     this.totalRecords = data['count'];
  //     this.dataList = data['data'];
  //     console.log(this.dataList)
  //   //   for (var i=0;i<this.dataList.length;i++){
  //   //   console.log(this.imgurl+'AboutImage/'+this.dataList[i]['IMG_URL'])

  //   //   }
  //   //   if(this.totalRecords==0){
  //   //     data.SEQ_NO=1;
  //   //   }else{
  //   //     data.SEQ_NO= this.dataList[this.dataList.length-1]['SEQ_NO']+1
  //   //   }
  //   // }, err => {
  //   //   console.log(err);
  //   });
  // }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = ' Add New Unit ';
    this.drawerData = new UnitMaster();
    this.api.getAllUnitMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQUENCE_NO = 1;
        } else {
          this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.drawerVisible = true;
  }
  edit(data: UnitMaster): void {
    this.drawerTitle = ' Update Unit Information';
    this.drawerData = Object.assign({}, data);
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
