import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NewSubscriberReport } from 'src/app/Models/newsubscriber';
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as moment from 'moment';
import { ExportService } from 'src/app/Service/export.service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-newsubscribers',
  templateUrl: './newsubscribers.component.html',
  styleUrls: ['./newsubscribers.component.css']
})
export class NewsubscribersComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: NewSubscriberReport = new NewSubscriberReport();
  formTitle = "News Subscribers Report";
  dataList: any[] = [];
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
  filterClass: string = 'filter-invisible';
  isSpinning = false;
  assessment:any;
  selectedDate: Date[] = []
  value1: any;
  value2: any;
  current = new Date();
  columns: string[][] = [["EMAIL_ID"," Email ID "],["DATE","Date"],["DEVICE_ID","Device ID"]];
     exportLoading: boolean = false;
  dataList2: any[] = [];
  constructor(private api: ApiServiceService,private message: NzNotificationService,private datePipe: DatePipe,private _exportService: ExportService,private router: Router) { }

  ngOnInit(): void {
  // this.loadingRecords = false;
  // this.loadassessment();
  this.changeDate(this.selectedDate)

  }

//   loadassessment(){
//   this.api.getAllassessment(0,0,'','',' ').subscribe(data =>{
//     this.assessment=data['data'];
//   },err => {
//     console.log(err);
//     this.isSpinning=false;
//   });
// }
changeDate(value: any) {
  this.value1 = this.datePipe.transform(value[0], "yyyy-MM-dd")
  this.value2 = this.datePipe.transform(value[1], "yyyy-MM-dd")
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
    this.api.getAllNewSubscriberReport(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery+
      this.filterQuery).subscribe(data => {
      if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      this.loadingRecords = false;
                    this.dataList.forEach(item => item.checked = this.selectedIds.has(item.ID));
this.updateSelectedRows();
      }else{
        this.message.error("Something Went Wrong","")
        this.loadingRecords = false;
      }
    }, err => {
      console.log(err);
    });
  }else{
      this.api
      .getAllNewSubscriberReport(0, 0, this.sortKey, sort, this.filterQuery)
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

  // applyFilter() {
  //   // this.isSpinning=true
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
  //   } catch (error) {
  //     sort = '';
  //   }
 
  //   if(this.groupname == ''){
  //     this.message.error("Please select group name",'');
  //   } else if (this.groupname != undefined){
  //    {
  //     this.filterQuery = 'AND MOCK_GROUP_NAME=' + "'" + this.groupname + "'";
    
  //   }
  // }
  //   var likeQuery = "";
  //   // console.log("search text:" + this.searchText);

  //   if (this.searchText != "") {
  //     likeQuery = " AND";
  //     this.columns.forEach(column => {
  //       likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
  //     });
  //     likeQuery = likeQuery.substring(0, likeQuery.length - 2)
      
  //     //console.log("likeQuery" + likeQuery);
  //   }
  //   this.api
  //   .getAllNewSubscriberReport(
  //     this.pageIndex,
  //     this.pageSize,
  //     this.sortKey,
  //     sort,likeQuery+
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
  back() {
    this.router.navigate(['/masters/menu']);
  }
  applyFilter() {
    // this.isSpinning=true
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    // this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    // this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
    // if(this.startValue==undefined || this.endValue==undefined)
    // if(this.startValue==null && this.endValue==null){
    //   this.message.error("Please Select From Date and To Date", "");
      
    // }else {
  
    // if(this.startValue==null && this.endValue!=null){
    //       this.message.error("Please Select From Date", "");
    //     }else{
  
    //     if(this.startValue!=null && this.endValue==null){
    //              this.message.error("Please Select To Date", "");
    //         }else{
      if (this.value1 != undefined && this.value2 != undefined) {
        if (this.value1 != null && this.value2 == null) {
          this.message.error("Please Select End Date", "");
        }
        else if (this.value1 == null && this.value2 != null) {
          this.message.error("Please Select Start Date", "");
        }
        else {
          // this.filterQuery += " AND ( START_DATE BETWEEN '" + this.value1 + ":00:00:00" + "' AND '" + this.value2 + ":23:59:59" + "' ) AND ( EXPIRY_DATE BETWEEN '" + this.value1 + ":00:00:00" + "' AND '" + this.value2 + ":23:59:59" + "' ) "
          // this.filterQuery += " AND START_DATE BETWEEN '" + this.value1 + " 00:00:00" + "' AND EXPIRY_DATE '" + this.value2 + " 23:59:59" + "'"
          this.filterQuery=" AND DATE between '"+ this.value1 + ":00:00:00" +"' AND '"+ this.value2 + ":23:59:59" +"' "
      //   }
      // }
      // alert(this.startValue)
     
  
      
        // this.filterQuery=" AND DATE between '"+this.startValue+"' AND '"+ this.endValue+"' "
            
        var filter = '';
        filter = this.filterQuery;
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
        .getAllNewSubscriberReport(
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
              this.message.error("Something Went Wrong","")
              this.loadingRecords = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
        }
      }
    // this.dataList=[];
  }
  clearFilter() {
    // this.groupname='';
    this.value1='';
    this.value2='';
    this.selectedDate=[];
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

  disabledDate = (selected: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(selected, this.current) > 0


     importInExcel() {
    this.search(true, true);
  }


    convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList2.length > 0) {
      for (var i = 0; i < this.dataList2.length; i++) {
        obj1["Date"] = this.dataList2[i]["DATE"]
          ? this.datePipe.transform(
            this.dataList2[i]["DATE"],
            "dd/MM/yyyy"
          )
          :"-";
        obj1["Email Id"] = this.dataList2[i]["EMAIL_ID"];
        // obj1["Device Id"] = this.dataList2[i]["DEVICE_ID"];
       
        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList2.length - 1) {
          this._exportService.exportExcel(
            arry1,
            "News Subscribers Report" +
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
   this.api.getAllIngredientMaster(1, this.totalRecords, this.sortKey, 'desc', '')
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
  if (this.selectedIds.size === 0) return;

  // Convert Set to array for API
  const ids = Array.from(this.selectedIds);

  this.api.deleteBulkRecords(ids).subscribe({
    next: () => {
      // Remove deleted items from current page
      this.dataList = this.dataList.filter(item => !this.selectedIds.has(item.ID));

      // Clear selection
      this.selectedIds.clear();
      this.selectedRows = [];
      this.allChecked = false;
    },
    error: (err) => {
      console.error("Bulk delete failed", err);
    }
  });
}
deleteRecord(id: number) {
  this.api.deleteBulkRecords([id]).subscribe({
    next: () => {
      this.dataList = this.dataList.filter(item => item.ID !== id);
      this.selectedRows = [];
      this.allChecked = false;
    },
    error: (err) => {
      console.error("Delete failed", err);
    }
  });
}
}

