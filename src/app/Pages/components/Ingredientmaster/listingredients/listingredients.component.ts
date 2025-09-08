import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { BlogMaster } from 'src/app/Models/blogmaster';
import { IngredientMaster } from 'src/app/Models/ingredients';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-listingredients',
  templateUrl: './listingredients.component.html',
  styleUrls: ['./listingredients.component.css']
})
export class ListingredientsComponent {
 drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: IngredientMaster = new IngredientMaster();
  formTitle = "Manage Ingredients ";
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
  columns: string[][] = [  ["NAME"," Name"],
  ["DESCRIPTION"," Description"]];

  @Input()
  drawerClose2!: Function;  
  imgurl= appkeys.retriveimgUrl;

  constructor(private api: ApiServiceService, private message: NzNotificationService,private router:Router) { }

  ngOnInit(): void {
  // this.loadingRecords = false; 
  this.search()

  }

  keyup(event:any) {
    this.search();
  }
  back() {
    this.router.navigate(['/masters/menu']);
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
    console.log("search text:" + this.searchText);
    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
      console.log("likeQuery" + likeQuery);
    }
    this.api.getAllIngredientMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      console.log(this.dataList)
      this.dataList.forEach(item => item.checked = this.selectedIds.has(item.ID));
      this.updateSelectedRows();
      for (var i=0;i<this.dataList.length;i++){
      console.log(this.imgurl+'ingredientLogo/'+this.dataList[i]['IMG_URL'])
      }
      this.loadingRecords = false;
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
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = " Add New Ingredient "; 
    this.drawerData = new IngredientMaster();
    // this.api.getAllIngredientMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
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
  edit(data: IngredientMaster): void {
    this.drawerTitle = " Update Ingredient";
    this.drawerData = Object.assign({}, data);
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

//bulk operation
allChecked = false;
selectedIds = new Set<number>(); 
selectedRows: any[] = [];      
selectedRecords  : any[] = [];  
headerToggles: any = {
   STATUS: false,
   IS_PRIMARY: false
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

   
  this.api.ingredientBulkUpdate(payload).subscribe( (res: any)  => {
      if (res.code == 200) {
  this.dataList.forEach(item => {
    if (this.selectedIds.has(item.ID)) {
      (item as any)[fieldName] = value;
    }
    item.checked = false;
  });

  this.updateSelectedRows();  
  this.loadingRecords = false;

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

bulkDelete() {
  this.loadingRecords = true;
  if (this.selectedIds.size === 0) return;

  const ids = Array.from(this.selectedIds);

const payload = {
  data: this.dataList
    .filter(item => this.selectedIds.has(item.ID)) 
    .map(item => {
      const obj: any = {
        ID: item.ID,
        NAME: item.NAME  
      };
    // also attach fieldName dynamically
      return obj;
    })
};



  
  this.api.ingredientDelete(payload).subscribe((res: any)  => {
       if (res.code == 200) {
      // Remove deleted items from current page
      this.dataList = this.dataList.filter(item => !this.selectedIds.has(item.ID));
      this.message.success('Successfully deleted data.', '');
        this.search();
  this.loadingRecords=false

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
      this.message.error('Failed to delete data.', '');
          this.loadingRecords = false;

    }
    },
    (err) => {
      console.error("Failed to delete data.", err);
    }
  );
}
deleteSingleRecord(row: IngredientMaster) {
  this.loadingRecords = true;
  const drawerData = Object.assign({}, row);
  const payload = {
    data: [
      {
        ID: drawerData.ID,
        NAME: drawerData.NAME
      }
    ]
  };

  console.log("Deleting:", payload); // 👀 check if it logs on confirm

  this.api.ingredientDelete(payload).subscribe((res: any)  => {
 
      if (res.code === 200) {
        this.dataList = this.dataList.filter(item => item.ID !== row.ID);
        this.selectedIds.delete(row.ID);
        this.selectedRows = [];
        this.allChecked = false;

        this.message.success('Successfully deleted data.', '');
          this.search();
          this.loadingRecords=false

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
    }
  )}



}



