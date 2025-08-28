import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { ProjectIngredientsMapping } from 'src/app/Models/IngrdientsMapping';
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
       this.dataList.forEach(item => item.checked = this.selectedIds.has(item.ID));

    this.updateSelectedRows();
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
    this.drawerTitle = 'Add New Product ';
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
    this.tags = [];        
    this.multipleImages = [];

    this.drawerVisible = true;
  }
  disabled: boolean = false;

tags
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
    this.tags = data.BENIFITS
    ? data.BENIFITS.split(',').map(tag => tag.trim()).filter(tag => tag)
    : [];
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




  isIngredientMappingvisible = false;
 IngredientMappingData = new ProjectIngredientsMapping();
  mapIngredienttitle = 'Map Ingredients';
  // mapProceduretitle = 'Map Procedure';
  mapIngredientSpinning = false;

  IngredientsList: any = [];
  UnitConfigurationList: any = [];
  OriginalList: any = [];
  // tecnicalSpecificationdrawerVisible: boolean = false;
  // tecnicalSpecificationisSpinning = false;
  checked = false;
  indeterminate = false;
  SELECTED_RECORDS = 0;
  RECORDS = 0;
  setOfCheckedId = new Set();
  datatoSendIngredient: any = [];
  datatoSendProcedure: any = [];
  selectedItems: any = [];
  searchText2 = '';
  checked2 = false;
  indeterminate2 = false;
  SELECTED_RECORDS2 = 0;
  RECORDS2 = 0;
  setOfCheckedId2 = new Set();
  datatoSendIngredient2: any = [];
  selectedItems2: any = [];
  searchText3 = '';
  sortData(sortKey, sortOrder) {
    this.IngredientsList.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return valA.localeCompare(valB) * (sortOrder === 'ascend' ? 1 : -1);
    });
  }

  mappedIDs = new Set<number>();
 onAllChecked(value: boolean): void {
  this.mappedIDs.clear();
  this.setOfCheckedId.clear();
  this.selectedItems = [];
  this.datatoSendIngredient = [];

  // Collect already mapped IDs to preserve them later
  if (this.datatoSendIngredient.length > 0) {
    this.datatoSendIngredient.forEach((data) => {
      this.mappedIDs.add(data.INGREDIENT_ID);
    });
  }

  this.checked = value;
  this.indeterminate = false;

  this.IngredientsList.forEach((data) => {
    if (typeof data === 'object') {
      // Update visual checkbox state
      data.checked = value;

      // Create ingredient payload
      const ingredientPayload = {
        INGREDIENT_ID: data.INGREDIENT_ID,
        STATUS: value ? 1 : 0,
      };

      // Only include if selected
      if (value) {
        this.setOfCheckedId.add(data.INGREDIENT_ID);
        this.selectedItems.push(data);
        this.datatoSendIngredient.push(ingredientPayload);
      }
    }
  });

  // Reapply mapped IDs for edit flow (preserve existing DB IDs)
  if (this.mappedIDs.size > 0 && this.datatoSendIngredient.length > 0) {
    const mappedIDsArray = Array.from(this.mappedIDs);
    this.datatoSendIngredient.forEach((data, index) => {
      if (mappedIDsArray[index] !== undefined) {
        data.INGREDIENT_ID = mappedIDsArray[index];
      }
    });
  }

  localStorage.setItem('editData', JSON.stringify(this.selectedItems));
  this.updateTotalRecords();
}

  keyup2() {
    if (this.searchText2.trim().length >= 3 || this.searchText2.length === 0) {
      this.searchIngredients();
    }
  }
  searchIngredients() {
    if (!this.searchText2.trim()) {
      this.IngredientsList = [...this.OriginalList];
    } else {
      const searchText = this.searchText2.trim().toLowerCase();
      this.IngredientsList = this.OriginalList.filter((Ingredients) =>
        Ingredients.NAME.toLowerCase().includes(searchText)
      );
    }
  }
  updateTotalRecords() {
    this.SELECTED_RECORDS = this.setOfCheckedId.size;
  }
  onItemChecked(item, checked) {
    // Update the item properties
    // item.ASSOCIATION_DATE = new Date();
    item.STATUS = checked ? 1 : 0;

    const IngredientsData = {
      // CLIENT_ID: 1,
      // PRODUCT_ID: this.IngredientMappingData.PRODUCT_ID,
      INGREDIENT_ID: item.INGREDIENT_ID,
      // ASSOCIATION_DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd') ,
      STATUS: checked ? 1 : 0,
    };

    const existingIndex = this.datatoSendIngredient.findIndex(
      (data) => data.INGREDIENT_ID === item.INGREDIENT_ID
    );

    if (existingIndex === -1) {
      // If the item is not in the array, add it
      this.datatoSendIngredient.push(IngredientsData);
    } else {
      // If the item exists, update its STATUS property
      this.datatoSendIngredient[existingIndex].STATUS = IngredientsData.STATUS;
    }

    // Update the selectedItems array similarly
    const selectedIndex = this.selectedItems.findIndex(
      (data) => data.INGREDIENT_ID === item.INGREDIENT_ID
    );

    if (checked) {
      if (selectedIndex === -1) {
        this.selectedItems.push(IngredientsData);
      }
    } else {
      if (selectedIndex !== -1) {
        this.selectedItems[selectedIndex].STATUS = 0;
      }
    }

  

    // Update other states or UI elements
    this.updateCheckedSet(item.INGREDIENT_ID, checked);
    this.updateTotalRecords();
  }

  updateCheckedSet(id, checked) {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    const totalItems = this.IngredientsList.length;
    const selectedItems = this.setOfCheckedId.size;
    this.checked = selectedItems === totalItems;
    this.indeterminate = selectedItems > 0 && selectedItems < totalItems;
  }
  statusVisible = false;
  selectedStatus: any = [];
  isstatusFilterApplied = false;
  onStatusChange(): void {
    //this.search();
    if (this.selectedStatus?.length) {
      this.search();
      this.isstatusFilterApplied = true; // Filter applied if selectedCategories has values
    } else {
      this.search();
      this.isstatusFilterApplied = false; // Filter reset if selectedCategories is null, undefined, or empty
    }
  }
  MapIngredients(data: any) {
    let filter = ' AND STATUS=1';
    this.isIngredientMappingvisible = true;
    this.IngredientMappingData = new ProjectIngredientsMapping();
    this.IngredientMappingData.PRODUCT_ID = data.ID;
    this.mapIngredientSpinning = true;
    let filter2 = data.ID;
    this.setOfCheckedId.clear();
    this.datatoSendIngredient = [];
    this.selectedItems = [];
    this.api
      .getProductMappedIngredientsList(0, 0, 'id', 'desc', '',filter2)
      .subscribe(
        (data) => {
          console.log(data)
          if (data.code === 200) {

            this.IngredientsList = data.data || [];
            this.OriginalList = [...this.IngredientsList];
            // let Id
            this.mapIngredientSpinning = false;
            this.api.getProductMappedIngredientsList(0, 0, 'id', 'desc', ' ',filter2).subscribe(
              (res) => {
                console.log(res)
                if (res.code === 200) {
              
                  const compareData = res.data || [];
                  if (compareData.length > 0) {

                    this.IngredientsList.forEach((Ingredients) => {
                      const matchedData = compareData.find(
                        (mapped) => mapped.INGREDIENT_ID === Ingredients.INGREDIENT_ID
                      );
                    if (matchedData && matchedData.STATUS === 1) {
  this.setOfCheckedId.add(matchedData.INGREDIENT_ID);
  Ingredients.checked = true;
  Ingredients.STATUS = 1;
  this.datatoSendIngredient.push({
    INGREDIENT_ID: matchedData.INGREDIENT_ID,
    STATUS: 1,
  });
  this.selectedItems.push({
    INGREDIENT_ID: matchedData.INGREDIENT_ID,
    STATUS: 1,
  });
} else {
  Ingredients.checked = false;
  Ingredients.STATUS = 0;
}

                    });
                  }
                  
                  const totalItems = this.IngredientsList.length;
                  const selectedItems = this.setOfCheckedId.size;
                  this.checked = selectedItems === totalItems;
                  this.indeterminate =
                    selectedItems > 0 && selectedItems < totalItems;
                }
              },
              () => {
                this.mapIngredientSpinning = false;
                this.message.error('Failed to fetch mapped Ingredients list', '');
              }
            );
            this.mapIngredientSpinning = false;

          }

          
           else {
            this.IngredientsList = [];
            this.OriginalList = [];
            this.mapIngredientSpinning = false;
            this.message.error('Failed to fetch Ingredients map list', '');
          }
        },
        () => {
          this.message.error('Something went wrong', '');
          this.mapIngredientSpinning = false;
        }
      
      
      );

  }
  preventDefault(event) {
    document.getElementById('search')?.focus();
    // event.preventDefault()
  }
  saveMapIngredients(boolean) {
    this.mapIngredientSpinning = true;
    if (this.datatoSendIngredient.length == 0) {
      this.message.error('Please Select Mapping Data', '');
      this.mapIngredientSpinning = false;
    } else {
      let data = 
      {
        CLIENT_ID: 1,
        PRODUCT_ID: this.IngredientMappingData.PRODUCT_ID,
        data: this.datatoSendIngredient,
      };
    
      //console.log(data);

      // this.validateData(data);
      this.api.MapProjectIngredients(data).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.mapIngredientSpinning = false;
            this.message.success('Ingredients Mapped Successfully', '');
            this.isIngredientMappingvisible = false;
          } else {
            this.mapIngredientSpinning = false;
            this.message.error('Failed to map Ingredients', '');
          }
        },
        (err) => {
          this.mapIngredientSpinning = false;
          console.log(err);
        }
      );
    }
  }

  
  closeIngredientsMapping() {
    this.isIngredientMappingvisible = false;
    this.IngredientMappingData = new ProjectIngredientsMapping();
    this.searchText2 = '';
  }


//bulk operation
allChecked = false;
selectedIds = new Set<number>(); 
selectedRows: any[] = [];        
headerToggles: any = {
  IS_MAINTAIN_STOCK: false,
  IS_VERIENT_AVAILABLE: false,
  IS_POPULAR: false,
  IS_BEST_SELLER: false,
  IS_NEW_ARRIVAL: false,
  STATUS: false
};
chekedproduct(){
   this.api.getAllProductMaster(1, this.totalRecords, this.sortKey, 'desc', '')
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
    PRODUCTS_DATA: Array.from(this.selectedIds).map(id => {
      const obj: any = { ID: id };
      obj[fieldName] = value; 
      return obj;
    })
  };

   
  this.api.productBulkUpdate(payload).subscribe( (res: any)  => {
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
  if (this.selectedIds.size === 0) return;

  const ids = Array.from(this.selectedIds);

  const payload = {
    IDS: ids
  };

  
  this.api.productDelete(payload).subscribe((res: any)  => {
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
