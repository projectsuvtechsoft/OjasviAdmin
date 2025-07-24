import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CountryMaster } from 'src/app/Models/CountryMaster';
import { StateMaster } from 'src/app/Models/StateMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-listcountry',
  templateUrl: './listcountry.component.html',
  styleUrls: ['./listcountry.component.css'],
})
export class ListcountryComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: CountryMaster = new CountryMaster();
  formTitle = ' Manage Countries ';
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
    ['NAME', ' Country Name(English) '],
    ['SHORT_CODE', ' short code '],
  ];
  @Input()
  drawerClose2!: Function;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) {}
  back() {
    this.router.navigate(['/masters/menu']);
  }
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
      .getAllCountryMaster(
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

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = ' Add New Country ';
    this.drawerData = new CountryMaster();
    this.api.getAllCountryMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
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

  edit(data: CountryMaster): void {
    this.drawerTitle = ' Update Country Information';
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
