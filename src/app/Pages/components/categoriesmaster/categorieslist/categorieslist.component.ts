import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { CategoryMaster } from 'src/app/Models/categorymaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-categorieslist',
  templateUrl: './categorieslist.component.html',
  styleUrls: ['./categorieslist.component.css'],
})
export class CategorieslistComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: CategoryMaster = new CategoryMaster();
  formTitle = ' Manage Categories ';
  @Input()
  dataList: any[] = [];
  // dataList = [];
  back() {
    this.router.navigate(['/masters/menu']);
  }
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
    ['CATEGORY_NAME', ' Category Name '],
    ['SHORT_CODE', ' Short Code '],
  ];
  @Input()
  drawerClose2!: Function;
  imgurl = appkeys.retriveimgUrl;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.loadingRecords = false;
    // this.search();
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
      .getAllCategoryMaster(
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
             this.dataList.forEach(item => item.checked = this.selectedIds.has(item.ID));
             this.updateSelectedRows();
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
  //   this.api.getAllCategoryMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
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
    this.drawerTitle = ' Add New Category ';
    this.drawerData = new CategoryMaster();
    this.api.getAllCategoryMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
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
  edit(data: CategoryMaster): void {
    this.drawerTitle = ' Update Category';
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
//bulk operation
allChecked = false;
selectedIds = new Set<number>(); 
selectedRows: any[] = [];        
headerToggles: any = {
   STATUS: false
};
chekedproduct(){
   this.api.getAllCategoryMaster(1, this.totalRecords, this.sortKey, 'desc', '')
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

   
  this.api.categoryBulkUpdate(payload).subscribe( (res: any)  => {
   if (res.code == 200) {
  this.dataList.forEach(item => {
    if (this.selectedIds.has(item.ID)) {
      (item as any)[fieldName] = value;
    }
    // ✅ uncheck all rows
    item.checked = false;
  });

  this.updateSelectedRows();  
  this.loadingRecords = false;

  // ✅ clear selection state
  this.toggleVisible=false
  this.selectedRows = [];
  this.selectedIds.clear();
  this.allChecked = false;

  this.message.success('Bulk update successful', '');
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


// delete functionality
bulkDelete() {
  if (this.selectedIds.size === 0) return;

  const ids = Array.from(this.selectedIds);

const payload = {
  data: this.dataList
    .filter(item => this.selectedIds.has(item.ID)) // only selected rows
    .map(item => {
      const obj: any = {
        ID: item.ID,
        NAME: item.CATEGORY_NAME   // include NAME from dataList
      };
    // also attach fieldName dynamically
      return obj;
    })
};



  
  this.api.categoryDelete(payload).subscribe((res: any)  => {
       if (res.code == 200) {
      // Remove deleted items from current page
      this.dataList = this.dataList.filter(item => !this.selectedIds.has(item.ID));
      this.message.success('Successfully deleted information.', '');

      // Clear selection
      this.selectedIds.clear();
      this.selectedRows = [];
      this.allChecked = false;
       }
       else if (res.code == '400') {
              this.message.info(res.message, '');
              this.loadingRecords = false;
            }
    else{
      this.message.error('delete updation failed', '');
          this.loadingRecords = false;

    }
    },
    (err) => {
      console.error("Bulk update failed", err);
    }
  );
}


deleteRecord(id: number) {
  const payload = { IDS: [id] };

  this.api.categoryDelete(payload as any).subscribe((res: any)  => {
       if (res.code == 200) {
      this.dataList = this.dataList.filter(item => !this.selectedIds.has(item.ID));
      this.message.success('Bulk delete sucess', '');

      this.selectedIds.clear();
      this.selectedRows = [];
      this.allChecked = false;
       }
       else if (res.code == '400') {
              this.message.info('This Cateory Name Alredy in use', '');
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

