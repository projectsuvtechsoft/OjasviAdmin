import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-listcartmaster',
  templateUrl: './listcartmaster.component.html',
  styleUrls: ['./listcartmaster.component.css'],
})
export class ListcartmasterComponent implements OnInit {
  constructor(
    private api: ApiServiceService,
    private notify: NzNotificationService
  ) {}

  ngOnInit(): void {
    
    // console.log("data from custmaster"+this.cust);
    console.log('Cust id from customer master ', this.custid);

    this.cartsID = this.custid;
  }
 collapsibles = [
    { title: 'Section 1', body: 'Content 1 Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1', open: false },
    { title: 'Section 2', body: 'Content 2', open: false },
    // Add as many as needed
  ];

toggle(index: number, data: any): void {
  if (this.custid === undefined) {
    this.CustomerNameID = data.CUSTOMER_ID;
    this.SessionID = data.SESSION_KEY;

    var likeQuery = '';
    if (this.searchText1 !== '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText1 + "%' OR";
      });
      likeQuery = likeQuery.slice(0, -2) + ')';
    }

    if (data.CUSTOMER_ID === 0) {
      this.api
        .getAllCartItem(
          this.pageIndex2,
          this.pageSize2,
          'id',
          '',
          " AND SESSION_KEY = '" + data.SESSION_KEY + "'"
        )
        .subscribe((res) => {
          if (res['code'] === 200) {
            this.cartitemDataList = res['data'].map((item: any) => ({
              ...item,
              open: true, // set open here
            }));
            this.cartitemdrawerVisible = true;
          } else {
            this.loadingRecords = false;
            this.cartitemdrawerVisible = true;
          }
        });
    } else {
      this.api
        .getAllCartItem(0, 0, 'id', '', ' AND CUSTOMER_ID = ' + data.CUSTOMER_ID)
        .subscribe((res) => {
          if (res['code'] === 200) {
            this.cartitemDataList = res['data'].map((item: any) => ({
              ...item,
              open: true,
            }));
          } else {
            this.loadingRecords = false;
          }
        });
    }
  } else {
    this.api
      .getAllCartItem(0, 0, 'id', '', ' AND CART_ID = ' + this.cartID)
      .subscribe((res) => {
        if (res['code'] === 200) {
          this.cartitemDataList = res['data'].map((item: any) => ({
            ...item,
            open: true,
          }));
        } else {
          this.loadingRecords = false;
        }
      });
  }
}

  @Input()
  drawerClose2!: Function;

  @Input()
  custid: any;

  cartsID: any;

  customerId: any;

  @Input()
  dataList: any[] = [];

  visible = false;

  close1(): void {
    this.visible = false;
  }
  detailsList: any[] = [];
  detailsList3: any[] = [];
  loadingRecords67 = false;
  pageIndex1 = 1;
  pageSize1 = 10;

  CustomerNameID: any;
  SessionID: any;
  cartID: any;

  cartitemdrawerTitle!: string;
  cartitemdrawerVisible!: boolean;
  cartitemDataList: any[] = [];

  open1(data: any): void {
    // SESSION_KEY
    // this.loadingRecords67 = false

    // this.visible = true;

    // if (this.custid == undefined) {

    //   if (data.CUSTOMER_ID == null) {
    //     this.api
    //       .getAllCartItem(
    //         0,
    //         0,
    //         'ID',
    //         'ASC',
    //         " AND SESSION_KEY = '" + data.SESSION_KEY + "' "
    //       )
    //       .subscribe(
    //         (data) => {
    //           if (data['code'] == 200) {
    //             this.loadingRecords67 == false;
    //             this.totalRecords1 = data['count'];
    //             this.detailsList = data['data'];
    //           } else {
    //             this.loadingRecords67 == false;

    //             this.notify.error('Something Went Wrong ', '');
    //           }
    //         },
    //         (err) => {
    //           console.log(err);
    //         }
    //       );
    //   } else {
    //     this.api
    //       .getAllCartItem(
    //        0,
    //         0,
    //         'ID',
    //         'ASC',
    //         ' AND CUSTOMER_ID = ' + data.CUSTOMER_ID
    //       )
    //       .subscribe(
    //         (data) => {
    //           if (data['code'] == 200) {
    //             this.loadingRecords67 == false;

    //             this.totalRecords1 = data['count'];
    //             this.detailsList = data['data'];
    //           } else {
    //             this.loadingRecords67 == false;

    //             this.notify.error('Something Went Wrong ', '');
    //           }
    //         },
    //         (err) => {
    //           console.log(err);
    //         }
    //       );
    //   }
    // } else {
    //   this.api
    //     .getAllCartItem(0, 0, 'ID', 'ASC', ' AND CART_ID = ' + data.ID)
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           this.loadingRecords67 == false;

    //           this.totalRecords1 = data['count'];

    //           this.detailsList = data['data'];
    //         } else {
    //           this.loadingRecords67 == false;

    //           // this.loadingRecords23 = false

    //           this.notify.error('Something Went Wrong ', '');
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
    // }

    this.cartitemdrawerTitle = 'Cart Items';

    this.cartID = data.ID;

    console.log('cart master data Id ', this.cartID);

    if (this.custid == undefined) {
      this.CustomerNameID = data.CUSTOMER_ID;
      // console.log("CustomerNameID  "+ this.CustomerNameID)

      this.SessionID = data.SESSION_KEY;
      // console.log("SessionID  "+ data.SESSION_KEY)

      if (data.CUSTOMER_ID == 0) {
        this.api
          .getAllCartItem(
            0,
            0,
            'id',
            '',
            " AND SESSION_KEY = '" + data.SESSION_KEY + "'"
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              // this.totalRecords = data['count'];
              this.cartitemDataList = data['data'];
              this.cartitemdrawerVisible = true;
            } else {
              // this.message.error("Something Went Wrong","");
              this.loadingRecords = false;
              this.cartitemdrawerVisible = true;
            }
          });

        // console.log("this cust  "+ this.CustomerNameID)
      } else {
        this.api
          .getAllCartItem(
            0,
            0,
            'id',
            '',
            ' AND CUSTOMER_ID = ' + data.CUSTOMER_ID
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              // this.totalRecords = data['count'];
              this.cartitemDataList = data['data'];
              this.cartitemdrawerVisible = true;
            } else {
              // this.message.error("Something Went Wrong","");
              this.loadingRecords = false;
              this.cartitemdrawerVisible = true;
            }
          });

        // console.log("this cust  "+ this.CustomerNameID)
      }
    } else {
      this.api
        .getAllCartItem(0, 0, 'id', '', ' AND CART_ID = ' + this.cartID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            // this.totalRecords = data['count'];
            this.cartitemDataList = data['data'];
            this.cartitemdrawerVisible = true;
          } else {
            // this.message.error("Something Went Wrong","");
            this.loadingRecords = false;
            this.cartitemdrawerVisible = true;
          }
        });
    }
  }

  cartitemDrawerClose(): void {
    this.search();
    this.cartitemdrawerVisible = false;
  }
  // get mapCloseCallback() {
  //   return this.cartitemDrawerClose.bind(this);
  // }
  get cartitemCloseCallback() {
    return this.cartitemDrawerClose.bind(this);
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

    onScroll(event: any): void {

    const target = event.target;

    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const offsetHeight = target.offsetHeight;

    const atBottom = scrollTop + offsetHeight >= scrollHeight - 10;

    if (atBottom && !this.loadingRecords) {

      // if (this.tempCount === this.dataList.length) {
      //   // this.message.info("All Venue's Load", '');
      // } else {
      // this.currentPage++;
      //   this.loadVenueData();
      // }
    }
  }
  formTitle = ' Customer Cart List ';
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
    console.log(this.customerId, ' this.customerId==0');
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

    if (this.custid == undefined) {
      this.api
        .getAllCartMaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery
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
              this.notify.error('Something Went Wrong', '');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.api
        .getAllCartMaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          ' AND CUSTOMER_ID = ' + this.custid + likeQuery
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
              this.notify.error('Something Went Wrong', '');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
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


  showmodal=false
selectedProject: any = null;
  columns1: string[][] = [ 
    ["PRODUCT_NAME"," Prod name "],
    ["PRODUCT_RATE","Product rate"],
    ["PRODUCT_SIZE","product size"],
    ["QUANTITY"," qty"],
    ["VERIENT_RATE","varient rate"],
    ["VERIENT_SIZE","varient size"],
    ["VERIENT_UNIT_NAME","Varient unit name"],
    ["PRODUCT_SIZE","product size"],
]
 pageIndex2 = 1;
  pageSize2 = 10;
  sortValue2: string = "desc";
  sortKey2: string = "id";
  searchText1
openProjectDetails(data: any) {

 this.cartID = data.ID;

    console.log('cart master data Id ', this.cartID);

    if (this.custid == undefined) {
      this.CustomerNameID = data.CUSTOMER_ID;
      // console.log("CustomerNameID  "+ this.CustomerNameID)

      this.SessionID = data.SESSION_KEY;
      // console.log("SessionID  "+ data.SESSION_KEY)
 var likeQuery = "";
    console.log("search text:" + this.searchText1);
    if (this.searchText1 != "") 
    {
      likeQuery = " AND (";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText1 + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")"
      console.log("likeQuery" + likeQuery);
    }
      if (data.CUSTOMER_ID == 0) {
        this.api
          .getAllCartItem(
           this.pageIndex2, this.pageSize2,
            'id',
            '',
            " AND SESSION_KEY = '" + data.SESSION_KEY + "'"
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              // this.totalRecords = data['count'];
              this.cartitemDataList = data['data'];
              this.cartitemdrawerVisible = true;
            } else {
              // this.message.error("Something Went Wrong","");
              this.loadingRecords = false;
              this.cartitemdrawerVisible = true;
            }
          });

        // console.log("this cust  "+ this.CustomerNameID)
      } else {
        this.api
          .getAllCartItem(
            0,
            0,
            'id',
            '',
            ' AND CUSTOMER_ID = ' + data.CUSTOMER_ID
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              // this.totalRecords = data['count'];
              this.cartitemDataList = data['data'];
              this.showmodal = true;
            } else {
              // this.message.error("Something Went Wrong","");
              this.loadingRecords = false;
              this.showmodal = true;
            }
          });

        // console.log("this cust  "+ this.CustomerNameID)
      }
    } else {
      this.api
        .getAllCartItem(0, 0, 'id', '', ' AND CART_ID = ' + this.cartID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            // this.totalRecords = data['count'];
            this.cartitemDataList = data['data'];
            this.showmodal = true;
          } else {
            // this.message.error("Something Went Wrong","");
            this.loadingRecords = false;
            this.showmodal = true;
          }
        });
    }


  this.showmodal = true;
  console.log(this.selectedProject)
}
  search2(reset: boolean = false) {
    if (reset) {
      this.pageIndex2 = 1;
      this.sortKey2 = "id";
      this.sortValue2 = "desc"
    }
    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue2.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }
    var likeQuery = "";
    console.log("search text:" + this.searchText1);
    if (this.searchText1 != "") 
    {
      likeQuery = " AND (";
      this.columns1.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText1 + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")"
      console.log("likeQuery" + likeQuery);
    }
    else{

    }
    
    if( this.custid == undefined )
    {

      
    if( this.CustomerNameID  == 0 ){


       
      this.api.getAllCartItem(this.pageIndex2, this.pageSize2, this.sortKey2, sort," AND SESSION_KEY = '" + this.SessionID + "'" + likeQuery).subscribe(data => {
        if(data['code']==200){
        
        // this.loadingRecords = false;
        // this.totalRecords = data['count'];
        this.cartitemDataList = data['data'];
       
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
    
      
      this.api.getAllCartItem(this.pageIndex2, this.pageSize2, this.sortKey2, sort, ' AND CUSTOMER_ID = ' + this.CustomerNameID + likeQuery).subscribe(data => {
        if(data['code']==200){
        
        // this.loadingRecords = false;
        // this.totalRecords = data['count'];
        this.cartitemDataList = data['data'];
       
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

      this.api.getAllCartItem(this.pageIndex2, this.pageSize2, this.sortKey2, sort, ' AND CART_ID = ' + this.cartID + likeQuery).subscribe(data => {
        console.log('this.session',this.CustomerNameID)
        if(data['code']==200){
        
        // this.loadingRecords = false;
        // this.totalRecords = data['count'];
        this.cartitemDataList = data['data'];
       
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
  keyup2(event: any) {
    this.search2();
  }
   handleOk(): void {
    console.log('Button ok clicked!');
    this.showmodal = false;
  }

  handleProjectCancel(): void {
    console.log('Button cancel clicked!');
    this.showmodal = false;
  }

}
