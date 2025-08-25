import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { StateMaster } from 'src/app/Models/StateMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-liststate',
  templateUrl: './liststate.component.html',
  styleUrls: ['./liststate.component.css']
})
export class ListstateComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: StateMaster = new StateMaster();
  formTitle = "Manage States";
  @Input()
   dataList:any[] = [];
  // dataList = [];
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
    ["SEQUENCE_NO"," Sequence Number "], 
    ["NAME"," State Name(English) "],
    ["SHORT_CODE"," short code "],
    ["COUNTRY_NAME"," Country Name "]
  ];
  @Input()
  drawerClose2!: Function;  

  constructor(private api: ApiServiceService, private message: NzNotificationService,private router: Router) { }

  ngOnInit(): void {
  // this.loadingRecords = false; 
  // this.search()

  }

  keyup(event:any) {
    this.search();
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = "id";
      this.sortValue = "desc"
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }
    var likeQuery = "";
    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
    }
    this.api.getAllStateMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      this.loadingRecords = false;
      this.dataList.forEach(item => item.checked = this.selectedIds.has(item.ID));
      this.updateSelectedRows();
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
  //   this.api.getAllStateMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
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
  back() {
    this.router.navigate(['/masters/menu']);
  }
  add(): void {
    this.drawerTitle = " Add New State "; 
    this.drawerData = new StateMaster();
    this.api.getAllStateMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
      if (data['count']==0){
        this.drawerData.SEQUENCE_NO=1;
      }else
      {
        this.drawerData.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
      }
    },err=>{
      console.log(err);
    })
    this.drawerVisible = true;
  }
  
  edit(data: StateMaster): void {
    this.drawerTitle = " Update State Information";
    this.drawerData = Object.assign({}, data);
    this.drawerData.COUNTRY_ID = data['COUNTRY_ID']
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id'; 
    // const sortOrder = (currentSort && currentSort.value) || 'asc';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

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

  //bulk operation
allChecked = false;
selectedIds = new Set<number>(); 
selectedRows: any[] = [];        
headerToggles: any = {
   STATUS: false
};
chekedproduct(){
   this.api.getAllStateMaster(1, this.totalRecords, this.sortKey, 'desc', '')
      .subscribe(res => {
        if (res['code'] === 200) {
          res.data.forEach(item => {
            this.selectedIds.add(item.ID);
          });

          // Also mark current page checkboxes as checked
          this.dataList.forEach(item => item.checked = true);
          this.updateSelectedRows();
        }
      });
}
checkAll(checked: boolean) {
  if (checked) {
  this.chekedproduct()
  } else {
    this.selectedIds.clear();
    this.dataList.forEach(item => item.checked = false);
    this.updateSelectedRows();
  }
}


onRowChecked(row: any) {
  if (row.checked) {
    this.selectedIds.add(row.ID);
  } else {
    this.selectedIds.delete(row.ID);
  }

  this.updateSelectedRows();
}

toggleVisible: boolean = false; 

updateSelectedRows() {
  // rows on current page
  this.selectedRows = this.dataList.filter(item => this.selectedIds.has(item.ID));

  // toggle visible if any row selected (even across pages)
  this.toggleVisible = this.selectedIds.size > 0;

  // recalc header toggle values based on selectedRows
  Object.keys(this.headerToggles).forEach(field => {
    if (this.selectedRows.length) {
      this.headerToggles[field] = this.selectedRows.every(r => !!r[field]);
    } else {
      this.headerToggles[field] = false;
    }
  });
}




bulkUpdate(fieldName: string, value: any) {
          this.loadingRecords = true;
  if (this.selectedIds.size === 0) return;

  const payload = {
    DATA: Array.from(this.selectedIds).map(id => {
      const obj: any = { ID: id };
      obj[fieldName] = value; 
      return obj;
    })
  };

   
  this.api.stateBulkUpdate(payload).subscribe( (res: any)  => {
       if (res.code == 200) {
      this.dataList.forEach(item => {
        if (this.selectedIds.has(item.ID)) {
          (item as any)[fieldName] = value;
        }
      });
      this.updateSelectedRows();  
          this.loadingRecords = false;

    }
    else{
      this.message.error('Bulk update failed', '');
          this.loadingRecords = false;

    }
    },
    (err) => {
      console.error("Bulk update failed", err);
    }
  );
}


}
