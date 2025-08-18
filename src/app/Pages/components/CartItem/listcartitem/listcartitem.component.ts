import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-listcartitem',
  templateUrl: './listcartitem.component.html',
  styleUrls: ['./listcartitem.component.css']
})
export class ListcartitemComponent implements OnInit {

  constructor(private api: ApiServiceService , private notify:NzNotificationService) { }

  ngOnInit(): void {

    console.log("Cust Iddddd "+this.customernameid+" Session Idddd "+this.sessionid)
    // this.customernameid
    // this.sessionid
    console.log(" cart id in cart item ",this.cartID);
    
  }

  @Input()
  dataList: any[] = [];

  @Input()
  customernameid:any;
  @Input()
  sessionid:any;

  @Input()
  cartID:any

  @Input()
  custid:any

  @Input()
  drawerClose2!: Function;

  formTitle = " Cart Item List ";
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [ 
    ["PRODUCT_NAME"," Prod name "],
    ["PRODUCT_RATE","Product rate"],
    ["PRODUCT_SIZE","product size"],
    ["QUANTITY"," qty"],
    ["VERIENT_RATE","varient rate"],
    ["VERIENT_SIZE","varient size"],
    ["VERIENT_UNIT_NAME","Varient unit name"],
    ["PRODUCT_SIZE","product size"],
]

  // dataList:any[] = [];


    keyup(event:any) {
    this.search();
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = "id";
      this.sortValue = "desc"
    }
    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }
    var likeQuery = "";
    console.log("search text:" + this.searchText);
    if (this.searchText != "") 
    {
      likeQuery = " AND (";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")"
      console.log("likeQuery" + likeQuery);
    }
    else{

    }
    
    if( this.custid == undefined )
    {

      
    if( this.customernameid == 0 ){


       
      this.api.getAllCartItem(this.pageIndex, this.pageSize, this.sortKey, sort," AND SESSION_KEY = '" + this.sessionid + "'" + likeQuery).subscribe(data => {
        console.log('this.session',this.sessionid)
        if(data['code']==200){
        
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
       
        }
        // else{
        //   this.loadingRecords=false;
        //   this.notify.error('Something Went Wrong','')
        // }
  
  
      }, err => {
        console.log(err);
      });

    }
    else  {
    
      
      this.api.getAllCartItem(this.pageIndex, this.pageSize, this.sortKey, sort, ' AND CUSTOMER_ID = ' + this.customernameid + likeQuery).subscribe(data => {
        console.log('this.session',this.customernameid)
        if(data['code']==200){
        
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
       
        }
        // else{
        //   this.loadingRecords=false;
        //   this.notify.error('Something Went Wrong','')
        // }
  
  
      }, err => {
        console.log(err);
      });
  
    }


    }else
    {

      this.api.getAllCartItem(this.pageIndex, this.pageSize, this.sortKey, sort, ' AND CART_ID = ' + this.cartID + likeQuery).subscribe(data => {
        console.log('this.session',this.customernameid)
        if(data['code']==200){
        
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
       
        }
        // else{
        //   this.loadingRecords=false;
        //   this.notify.error('Something Went Wrong','')
        // }
  
  
      }, err => {
        console.log(err);
      });

    }


  
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id'; 
    // const sortOrder = (currentSort && currentSort.value) || 'asc';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    console.log(currentSort)

    console.log("sortOrder :"+sortOrder)
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if(this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }    
    
    if( this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize =pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }


}
