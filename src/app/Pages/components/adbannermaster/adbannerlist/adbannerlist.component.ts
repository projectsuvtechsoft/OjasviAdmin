import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { ApexChart } from 'ng-apexcharts';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AdBannerMaster } from 'src/app/Models/adbannermaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-adbannerlist',
  templateUrl: './adbannerlist.component.html',
  styleUrls: ['./adbannerlist.component.css']
})
export class AdbannerlistComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: AdBannerMaster = new AdBannerMaster();
  formTitle = "Manage Ad Banner ";
  dataList :any []= [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["SEQUENCE_NO"," Sequence Number"],["NAME", " Ad Banner Name (English)"],["NAME_MR"," Ad Banner Name (Marathi)"]
  ,["SUB_TITLE", " Sub Title (English)"],["SUB_TITLE_MR"," Sub Title (Marathi)"]
  ,["SUB_TITLE2", " Sub Title2 (English)"],["SUB_TITLE2_MR"," Sub Title2 (Marathi)"]]

  constructor( private api: ApiServiceService, private message: NzNotificationService,private router:Router, private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
  // this.loadingRecords = false;
  this.search();

  }

  keyup(event:any) {
    this.search();
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
    this.api.getAllAdBanner(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
     if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      this.loadingRecords = false;
      // if(this.totalRecords==0){
      //   data.SEQUENCE_NO=1;
      // }else{
      //   data.SEQUENCE_NO= this.dataList[this.dataList.length-1]['SEQUENCE_NO']+1
      // }
    } else{
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
    back() {
    this.router.navigate(['/masters/menu']);
  }
  add(): void {
    this.drawerTitle = " Add New Ad Banner ";
    this.drawerData = new AdBannerMaster();
    this.api.getAllAdBanner(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
      if (data['count']==0){
        this.drawerData.SEQUENCE_NO=1;
      }else
      {
        this.drawerData.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
      }
    },err=>{
      console.log(err);
    })
    // this.drawerData.STATUS=true;
    this.drawerVisible = true;
  }
  edit(data: AdBannerMaster): void {
    this.drawerTitle = " Update Ad Banner Information";
    this.drawerData = Object.assign({}, data);
    this.drawerData.COLOR_CODE_NAME=data.COLOR_CODE_NAME?data.COLOR_CODE_NAME.toString():'';
    this.drawerData.COLOR_CODE_T1=data.COLOR_CODE_T1?data.COLOR_CODE_T1.toString():'';
    // this.drawerData.COLOR_CODE_T2=data.COLOR_CODE_T2.toString();
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
    // const sortOrder = (currentSort && currentSort.value) || 'asc';

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

 ViewImage: any;
  ImageModalVisible: boolean = false;
  imageshow: any;
  isSpinning: boolean = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }

  sanitizedLink: any = '';

  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'adBanner/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }

}


