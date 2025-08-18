import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AddressMaster } from 'src/app/Models/AddressMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-list-address-master',
  templateUrl: './list-address-master.component.html',
  styleUrls: ['./list-address-master.component.css'],
})
export class ListAddressMasterComponent implements OnInit {
  @Input()
  drawerClose2!: Function;

  @Input()
  custid: any;

 @Input()customerName:any;
 @Input()custMobileNo
  // customer: any;

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: AddressMaster = new AddressMaster();
  formTitle = 'Manage Address';
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
    ['NAME', ' Customer name '],
    ['MOBILE_NO', ' mobno '],
    ['PINCODE', ' pincode '],
    ['LOCALITY', ' locality '],
    ['ADDRESS', ' address '],
    ['CITY', ' city '],
    ['COUNTRY_NAME','countryname'],
    ['STATE_NAME', ' state '],
    ['LANDMARK', ' landmark '],
    ['ADDRESS_TYPE', ' addresstype '],
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    // this.loadingRecords = false;
    // this.search();

    // this.customer = this.custid
    // console.log(this.customer)
    console.log(this.custid)
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)+")";
      console.log('likeQuery' + likeQuery);
    }
    this.api.getAddressMaster(this.pageIndex, this.pageSize, this.sortKey, sort,  ' AND CUST_ID = ' + this.custid + likeQuery).subscribe(data => {
      if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      this.loadingRecords = false;
      // if(this.totalRecords==0){
      //   data.SEQUENCE_NO=1;
      // }
      }else{
        // this.message.error("Something Went Wrong","");
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
    this.custid =this.custid
 this.customerName=this.customerName
this.custMobileNo=this.custMobileNo
    this.drawerTitle = ' Add New Address ';
    this.drawerData = new AddressMaster();
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

  data: AddressMaster = new AddressMaster();
 

  update(data:any)
  {
    this.loadingRecords =true

     console.log(data.ID)
     console.log("default address",data.IS_DEFUALT_ADDRESS)
     this.data.IS_LAST_SHIPPING_ADDRESS = this.data.IS_DEFUALT_ADDRESS
    //  this.abc = data.ID

    if(data.ID) {
      this.api.updateAddressMaster(data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success(' Information Updated Successfully...', '');
          this.loadingRecords = false

          this.search();          
        }else {
          this.message.error(' Failed To Update Information...', '');
          this.loadingRecords = false;
        }
      });

    } 
    this.api.getAddressMaster(0, 0, "", "",  ' AND CUST_ID = ' + this.custid ).subscribe(data => {
      if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      this.loadingRecords = false;
      // if(this.totalRecords==0){
      //   data.SEQUENCE_NO=1;
      // }
      }else{
        // this.message.error("Something Went Wrong","");
        this.loadingRecords = false;
      }
    }, err => {
      console.log(err);
    });
    // this.search();


  }


  //  countryid : any;

  edit(data: AddressMaster): void {
    console.log(data)
    this.drawerTitle = ' Update Address Information';
    this.drawerData = Object.assign({}, data);
    //  this.drawerData.STATE_ID = 10
    this.drawerData.STATE_ID = data['STATE_ID'];

    // this.countryid = this.drawerData.COUNTRY_ID

    // console.log("countryid",this.countryid)



    // this.api
    // .getAllStateMaster(
    //   0,
    //   0,
    //   '',
    //   '',
    //   '  AND COUNTRY_ID = ' + this.countryid
    // )
    // .subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.drawerData.STATE_ID = data['STATE_ID'];
    //       console.log("this.drawerData.STATE_ID",this.drawerData.STATE_ID)
    //     }else
    //     {
    //       this.message.error("Data Can't Load",'');
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }

    // );

    // console.log(this.drawerData.STATE_ID)

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
