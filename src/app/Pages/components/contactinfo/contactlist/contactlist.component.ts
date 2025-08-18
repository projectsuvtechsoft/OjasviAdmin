import { Component, OnInit } from '@angular/core';
import { Router, RouterConfigOptions } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ContactInfo } from 'src/app/Models/contactinfo';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css']
})
export class ContactlistComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: ContactInfo = new ContactInfo();
  formTitle = "Manage Contact";
  dataList:any[] = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  datacount:any;
  columns: string[][] = [["EMAIL_ID"," Email ID"], ["CONTACT_NO"," Contact Number"],
  ["WHATSAPP_NO","Whatsapp Number"] ,["LONGITUDE  ", " Longitude "], ["LATITUDE"," Latitude"]];

  constructor(private api: ApiServiceService, private message: NzNotificationService,private router:Router) { } 

  ngOnInit(): void {
  // this.loadingRecords = false;

  }
  back() {
    this.router.navigate(['/masters/menu']);
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
    console.log("search text:" + this.searchText);
    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
      console.log("likeQuery" + likeQuery);
    }
    this.api.getAllcontact(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
    if(data['code'] == 200){
      this.totalRecords = data['count'];
      this.datacount = data['count'];
      // alert(this.datacount)
      this.dataList = data['data'];
      this.loadingRecords = false;
      // if(this.totalRecords==0){
      //   data.SEQUENCE_NO=1;
      // }
    }else{
      this.message.error("Something Went Wrong","")
      this.loadingRecords = false
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
    this.drawerTitle = " Add New Contact Information";
    this.drawerData = new ContactInfo();
    // this.drawerData.IS_ACTIVE=true;
    this.drawerVisible = true;
  }
  edit(data: ContactInfo): void {
    this.drawerTitle = " Update Contact Information ";
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

