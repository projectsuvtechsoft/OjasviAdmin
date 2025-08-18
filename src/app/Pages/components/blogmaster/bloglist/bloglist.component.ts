import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { BlogMaster } from 'src/app/Models/blogmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-bloglist',
  templateUrl: './bloglist.component.html',
  styleUrls: ['./bloglist.component.css']
})
export class BloglistComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: BlogMaster = new BlogMaster();
  formTitle = "Manage Blogs ";
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
  columns: string[][] = [ ["SEQUENCE_NO"," Sequence Number "], ["TITLE"," Title(English) "],
  ["TITLE_MR"," Title(Marathi) "],["BLOGGER_NAME"," Blogger Name(English) "],
  ["BLOGGER_NAME_MR"," Blogger Name(Marathi) "], ["BLOG_DATE"," Blog Date  "]];

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
    this.api.getAllBlogMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      console.log(this.dataList)
      for (var i=0;i<this.dataList.length;i++){
      console.log(this.imgurl+'blogImage/'+this.dataList[i]['IMG_URL'])
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
    this.drawerTitle = " Add New Blog "; 
    this.drawerData = new BlogMaster();
    this.api.getAllBlogMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
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
  edit(data: BlogMaster): void {
    this.drawerTitle = " Update Blog Information";
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

}

