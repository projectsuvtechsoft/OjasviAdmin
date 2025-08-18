import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { PincodeMaster } from 'src/app/Models/PincodeMaster';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-pincode-master',
  templateUrl: './list-pincode-master.component.html',
  styleUrls: ['./list-pincode-master.component.css'],
})
export class ListPincodeMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: PincodeMaster = new PincodeMaster();
  formTitle = 'Manage Zipcodes';
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
    ['PINCODE', ' Pincode'],
    ['SHIPPING_CHARGES', ' shippingcharges']
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
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
     }
    this.api.getPincodeMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      this.loadingRecords = false;
      // if(this.totalRecords==0){
      //   data.SEQUENCE_NO=1;
      // }
      }else{
        this.message.error("Something Went Wrong","");
        this.loadingRecords = false;
      }
    }, err => {
      console.log(err);
    });
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = ' Add New Zipcode ';
    this.drawerData = new PincodeMaster();
    // this.api.getAllUnitMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
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
  edit(data: PincodeMaster): void {
    this.drawerTitle = ' Update Zipcode Information';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
   back() {
    this.router.navigate(['/masters/menu']);
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
}
