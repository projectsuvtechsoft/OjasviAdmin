import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UserContactReport } from 'src/app/Models/usercontact';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-usercontact',
  templateUrl: './usercontact.component.html',
  styleUrls: ['./usercontact.component.css']
})
export class UsercontactComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: UserContactReport = new UserContactReport();
  formTitle = " User Contact Report";
  dataList:any = [];
  dataList2 = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  groupname:string='';
  filterQuery: string = "";
  isFilterApplied: any = "default";
  exportLoading: boolean = false;
  filterClass: string = 'filter-invisible';
  isSpinning = false;
  assessment:any;
  columns: string[][] = [["NAME","Name"],["MOBILE_NO","Mobile Number"],
  ["EMAIL_ID"," Email ID "],["SUBJECT"," Subject "],["MESSAGE"," Message "]];

  constructor(private api: ApiServiceService,private message: NzNotificationService,private _exportService: ExportService,private datePipe:DatePipe,private router: Router) { }

  ngOnInit(): void {

  }

  keyup(event:any) {
    this.search();
  }
  
  search(reset: boolean = false,exportInExcel: boolean = false) {
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
    console.log("search text:" + this.searchText);
    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
      console.log("likeQuery" + likeQuery);
    }
    if (exportInExcel == false) {
    this.api.getAllUserContactReport(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery+
      this.filterQuery).subscribe(data => {
        if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      this.loadingRecords = false;
      this.dataList.forEach(item => item.checked = this.selectedIds.has(item.ID));
      this.updateSelectedRows();
      // if(this.totalRecords==0){
      //   data.SEQUENCE_NO=1;
      // }else{
      //   data.SEQUENCE_NO= this.dataList[this.dataList.length-1]['SEQUENCE_NO']+1
      // }
      }else{
        this.message.error("Something Went Wrong","")
        this.loadingRecords = false;
      }
    }, err => {
      console.log(err);
    });
  }else{
     this.api
      .getAllUserContactReport(0, 0, this.sortKey, sort, this.filterQuery + likeQuery)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
             this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList2 = data['data'];
             this.convertInExcel();
            this.isSpinning = false;
          } else {
            this.dataList2 = [];
              this.exportLoading = false;
            this.loadingRecords = false;
            this.isSpinning = false;
            this.message.error('Something Went wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  // add(): void {
  //   this.drawerTitle = "Add Assessment";
  //   this.drawerData = new GuravMaster();
  //   this.api.getAllGuravMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
  //     if (data['count']==0){
  //       this.drawerData.SEQUENCE_NO=1;
  //     }else
  //     {
  //       this.drawerData.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
  //     }
  //   },err=>{
  //     console.log(err);
  //   })
  //   this.drawerVisible = true;
  // }
  // edit(data: AssessmentMaster): void {
  //   this.drawerTitle = "Map Assessment";
  //   this.drawerData = Object.assign({}, data);
  //   console.log(this.drawerData)
  //   // this.drawerData.TIME= new Date('01-01-1970 '+this.drawerData.TIME)
  //   this.drawerVisible = true;
  // }
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

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  // applyFilter() { 
    
  //   // this.isSpinning=true
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
  //   } catch (error) {
  //     sort = '';
  //   }
    
  //   var likeQuery = "";
  //   // console.log("search text:" + this.searchText);

  //   if (this.searchText != "") {
  //     likeQuery = " AND";
  //     this.columns.forEach(column => {
  //       likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
  //     });
  //     likeQuery = likeQuery.substring(0, likeQuery.length - 2)
  //     // this.filterQuery=" AND MOCK_GROUP_NAME '"+this.groupname
  //     this.filterQuery += " AND MOCK_GROUP_NAME='" + this.groupname+"'"

  //     //console.log("likeQuery" + likeQuery);
  //   }
  //   this.api
  //   .getAllassessment(
  //     0,0,
  //     this.sortKey,
  //     sort,
  //    this.filterQuery
  //   )
  //   .subscribe(
  //     (data) => {
  //       console.log(data);
  //       this.loadingRecords = false;
  //       this.isFilterApplied = 'primary';
  //       this.totalRecords = data['count'];
  //       this.dataList = data['data'];
  //       this.isSpinning = false;
  //       this.filterClass = 'filter-invisible';
  //       // this.search();
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );

  //   // this.dataList=[];
  // }

  applyFilter() {
    // this.isSpinning=true
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
 
    if(this.groupname == ''){
      this.message.error("Please select group name",'');
    } else if (this.groupname != undefined){
     {
      this.filterQuery = 'AND MOCK_GROUP_NAME=' + "'" + this.groupname + "'";
    
    }
  }
    var likeQuery = "";
    // console.log("search text:" + this.searchText);

    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
      
      //console.log("likeQuery" + likeQuery);
    }
    this.api
    .getAllUserContactReport(
      this.pageIndex,
      this.pageSize,
      this.sortKey,
      sort,likeQuery+
     this.filterQuery
    )
    .subscribe(
      (data) => {
        if(data['code'] == 200){
        this.isFilterApplied = 'primary';
        this.totalRecords = data['count'];
        this.dataList = data['data'];
        this.isSpinning = false;
        this.filterClass = 'filter-invisible';
        this.loadingRecords = false;
        // this.search();
        }else{
          this.message.error("Something Went Wrong","");
          this.loadingRecords = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
    
    // this.dataList=[];
  }

  clearFilter() {
    this.groupname='';
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.dataList = [];
    this.search();
    // this.startValue = new Date(
    //   this.current.getFullYear() + "-" + (this.current.getMonth() + 1) + "-01"
    // );
    // this.endValue = this.current;
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

   importInExcel() {
    this.search(true, true);
  }


    convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList2.length > 0) {
      for (var i = 0; i < this.dataList2.length; i++) {
        obj1["Name"] = this.dataList2[i]["NAME"];
        obj1["Mobile No"] = this.dataList2[i]["MOBILE_NO"];
        obj1["Email Id"] = this.dataList2[i]["EMAIL_ID"];
        obj1["Subject"] = this.dataList2[i]["SUBJECT"];
        obj1["Message"] = this.dataList2[i]["MESSAGE"]; 
        
        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList2.length - 1) {
          this._exportService.exportExcel(
            arry1,
            "User Contact Report" +
            this.datePipe.transform(new Date(), "dd/MM/yyyy")
          );
        }
      }
    } else {
      this.message.error("There is a No Data", "");
    }
  }

    allChecked = false;
  selectedIds = new Set<number>(); 
  selectedRows: any[] = [];        
  headerToggles: any = {
     STATUS: false
  };
  chekedproduct(){
     this.api.getAllUserContactReport(1, this.totalRecords, this.sortKey, 'desc', '')
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
  updateSelectedRows() {
    // rows on current page
    this.selectedRows = this.dataList.filter(item => this.selectedIds.has(item.ID));
  
  
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
  
bulkDelete() {
  this.loadingRecords = true;

  if (this.selectedIds.size === 0) return;

  // Convert selectedIds set -> array -> comma separated string
  const payload = {
    IDS: Array.from(this.selectedIds).join(',')  // "1,2,3"
  };

  this.api.usercontactDelete(payload).subscribe(
    (res: any) => {
      if (res.code == 200) {
        // Remove deleted items from current page
        this.dataList = this.dataList.filter(
          item => !this.selectedIds.has(item.ID)
        );

        this.message.success('Successfully deleted data.', '');
        this.loadingRecords = false;

        // Clear selection
        this.selectedIds.clear();
        this.selectedRows = [];
        this.allChecked = false;
      } 
      else if (res.code == '400') {
        this.message.info(res.message, '');
              this.loadingRecords = false;

      } 
      else {
        this.message.error('Failed to delete data.', '');
      }

      this.loadingRecords = false;
    },
    (err) => {
      console.error("Failed to delete data.", err);
      this.loadingRecords = false;
    }
  );
}

  
  
 deleteSingleRecord(row: UserContactReport) {
  this.loadingRecords = true;

  const payload = {
    IDS: row.ID.toString()   // single record ID in string format
  };

  console.log("Deleting:", payload);

  this.api.usercontactDelete(payload).subscribe(
    (res: any) => {
      if (res.code === 200) {
        // Remove record from list
        this.dataList = this.dataList.filter(item => item.ID !== row.ID);
        this.selectedIds.delete(row.ID);
        this.selectedRows = [];
        this.allChecked = false;

        this.message.success('Successfully deleted data.', '');
                this.loadingRecords = false;

      } else if (res.code === 400) {
        this.message.info(res.message, '');
        this.loadingRecords = false;
      } else {
        this.message.error('Failed to delete data.', '');
        this.loadingRecords = false;
      }
    },
    (err) => {
      console.error("Failed to delete data.", err);
      this.loadingRecords = false;
    }
  );
}

}

