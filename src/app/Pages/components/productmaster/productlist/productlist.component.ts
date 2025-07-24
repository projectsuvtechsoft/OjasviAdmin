import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { ProductMaster } from 'src/app/Models/productmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css'],
})
export class ProductlistComponent implements OnInit {
  drawerVisible!: boolean;
  mapdrawerVisible!: boolean;

  drawerTitle!: string;
  mapdrawerTitle!: string;
  drawerData: ProductMaster = new ProductMaster();
  formTitle = ' Manage Products ';
  @Input()
  dataList: any[] = [];
  mapDataList: any[] = [];
  imgurl = appkeys.retriveimgUrl;

  // dataList = [];
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
    ['NAME', ' Product Name(English) '],
    ['NAME_MR', ' Product Name(Marathi) '],
    ['DESCRIPTION', ' Description '],
    ['CATEGORY_NAME', ' Category Name '],
    ['IGST', ' IGST '],
    ['CGST', ' CGST  '],
    ['SGST', ' SGST '],
    ['GST_TYPE', ' GST Type '],
    ['DISCOUNT_TYPE', 'Discount Type'],
    ['DISCOUNT', ' Discount '],
    ['UNIQUE_CODE', ' Unique Code'],
    ['UNIT_NAME', ' Unit Name '],
    ['OPENING_STOCK', 'Opening Stock'],
    ['CURRENT_STOCK', ' Current Stock '],
    ['SIZE', ' Size '],
    ['RATE', ' Rate '],
    ['OUT_COUNTRY', ' OUT_COUNTRY '],
    ['IN_COUNTRY', ' IN_COUNTRY '],
  ];
  @Input()
  drawerClose2!: Function;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.loadingRecords = false;
    // this.search();
  }
  back() {
    this.router.navigate(['/masters/menu']);
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
    var filter = '';
    if (this.searchText != '') {
      filter = likeQuery + this.filterQuery;
    } else {
      filter = this.filterQuery;
    }
    this.api
      .getAllProductMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        filter
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          console.log(this.dataList);

          for (var i = 0; i < this.dataList.length; i++) {
            console.log(
              this.imgurl + 'productImages/' + this.dataList[i]['PHOTO_URL']
            );
          }
          this.loadingRecords = false;
          //   if (this.totalRecords == 0) {
          //     data.SEQ_NO = 1;
          //   } else {
          //     data.SEQ_NO = this.dataList[this.dataList.length - 1]['SEQ_NO'] + 1;
          //   }
          // },
          // (err) => {
          //   console.log(err);
        } else {
          this.message.error('Something Went Wrong', '');
          this.loadingRecords = false;
        }
      });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.disabled = true;

    // this.disabled = false
    this.drawerTitle = ' Add New Product ';
    this.drawerData = new ProductMaster();
    // this.api.getAllProductMaster(1, 1, '', 'desc', '').subscribe(
    //   (data) => {
    // if (data['count']==0){
    //   this.drawerData.SEQ_NO=1;
    // }else
    // {
    //   this.drawerData.SEQ_NO=data['data'][0]['SEQ_NO']+1;
    // }
    // },
    // (err) => {
    //   console.log(err);
    // }
    // );
    this.multipleImages = [];

    this.drawerVisible = true;
  }
  disabled: boolean = false;

  edit(data: ProductMaster): void {
    console.log(this.disabled);

    this.disabled = true;

    this.drawerTitle = ' Update Product Information';
    this.drawerData = Object.assign({}, data);
    this.drawerData.PRICE2 = data['PRICE2'];
    this.drawerData.SIZE2 = data['SIZE2'];
    this.drawerData.UNIT_ID2 = data['UNIT_ID2'];

    this.drawerData.PRICE3 = data['PRICE3'];
    this.drawerData.SIZE3 = data['SIZE3'];
    this.drawerData.UNIT_ID3 = data['UNIT_ID3'];

    this.drawerData.PRICE4 = data['PRICE4'];
    this.drawerData.SIZE4 = data['SIZE4'];
    this.drawerData.UNIT_ID4 = data['UNIT_ID4'];
    // this.api.getAllImages(this.pageIndex, this.pageSize, this.sortKey, '', ' AND PRODUCT_ID=' + data.ID).subscribe(data => {
    //   this.loadingRecords = false;
    //   this.totalRecords = data['count'];
    //   this.dataList = data['data'];
    this.getImages(data.ID);
    console.log(this.dataList);
    //   for (var i=0;i<this.dataList.length;i++){
    //   console.log(this.imgurl+'AboutImage/'+this.dataList[i]['IMG_URL'])

    //   }
    //   if(this.totalRecords==0){
    //     data.SEQ_NO=1;
    //   }else{
    //     data.SEQ_NO= this.dataList[this.dataList.length-1]['SEQ_NO']+1
    //   }
    // }, err => {
    //   console.log(err);
    // });

    this.drawerVisible = true;
  }

  multipleImages: any;

  getImages(enquiryNo: any) {
    this.multipleImages = [];

    this.api
      .getAllImages(0, 0, 'PHOTO_URL', 'asc', ' AND PRODUCT_ID=' + enquiryNo)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            var mappedImage = data['data'];
            console.log(mappedImage);

            for (var i = 0; i < mappedImage.length; i++) {
              var obj1: any = new Object();

              obj1['ImgSrc'] =
                this.imgurl + 'productImages/' + mappedImage[i]['PHOTO_URL'];
              obj1['PHOTO_SEQ_NO'] = mappedImage[i]['PHOTO_SEQ_NO'];
              obj1['File'] = '';
              obj1['PHOTO_URL'] = mappedImage[i]['PHOTO_URL'];
              this.multipleImages.push(obj1);
            }

            console.log(this.multipleImages);
          } else {
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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

  productId: any;
  Ismaintainstock: any;
  Isvarientavailable: any;

  map(data: any): void {
    this.productId = data.ID;
    this.mapdrawerTitle = ' Product Variant Mapping';
    // this.drawerData = Object.assign({}, data);
    console.log('productlist ' + data);
    this.Ismaintainstock = data.IS_MAINTAIN_STOCK;
    console.log(this.Ismaintainstock);
    this.Isvarientavailable = data.IS_VERIENT_AVAILABLE;
    console.log(this.Isvarientavailable);

    this.api
      .getAllProductVarient(0, 0, 'id', '', ' AND PRODUCT_ID = ' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          this.mapDataList = data['data'];
          this.mapdrawerVisible = true;
        } else {
          // this.message.error("Something Went Wrong","");
          this.loadingRecords = false;
          this.mapdrawerVisible = true;
        }
      });
  }
  mapDrawerClose(): void {
    this.search();
    this.mapdrawerVisible = false;
  }
  get mapCloseCallback() {
    return this.mapDrawerClose.bind(this);
  }
}
