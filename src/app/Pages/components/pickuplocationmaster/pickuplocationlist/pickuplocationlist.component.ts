import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { pickupLocation } from 'src/app/Models/pickupLocation';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-pickuplocationlist',
  templateUrl: './pickuplocationlist.component.html',
  styleUrls: ['./pickuplocationlist.component.css'],
})
export class PickuplocationlistComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: pickupLocation = new pickupLocation();
  formTitle = 'Manage Pickup Locations';

  @Input() dataList: any[] = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';

  columns: string[][] = [
    ['ADDRESS', 'Address'],
    ['LOCALITY', 'Locality'],
    ['CITY_NAME', 'City'],
    ['STATE_NAME', 'State Name'],
    ['COUNTRY_NAME', 'Country Name'],
    ['PINCODE', 'Pincode'],
    ['LANDMARK', 'Landmark'],
    // ['CLIENT_ID', 'Client ID'],
  ];

  @Input() drawerClose2!: Function;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.search();
  }

  keyup(event: any) {
    this.search();
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;

    let sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    let likeQuery = '';

    if (this.searchText.trim() !== '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ` ${column[0]} like '%${this.searchText}%' OR`;
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    // ✅ Replace city API with address API
    this.api
      .getAllpickupLocation(
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

            // this.dataList.forEach(
            //   (item) => (item.checked = this.selectedIds.has(item.ID))
            // );
            // this.updateSelectedRows();
          } else {
            this.message.error('Something went wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          console.error(err);
          this.loadingRecords = false;
        }
      );
  }

  // Drawer Controls
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  add(): void {
    this.drawerTitle = 'Add New Pickup Location';
    this.drawerData = new pickupLocation();
    this.drawerVisible = true;
  }

  edit(data: pickupLocation): void {
    this.drawerTitle = 'Update Pickup Location';
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
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  // ✅ Bulk Selection
  // allChecked = false;
  // selectedIds = new Set<number>();
  // selectedRows: any[] = [];
  // toggleVisible: boolean = false;

  // headerToggles: any = {
  //   STATUS: false,
  // };

  // chekedproduct() {
  //   this.api
  //     .getAllAddressMaster(1, this.totalRecords, this.sortKey, 'desc', '')
  //     .subscribe((res) => {
  //       if (res['code'] === 200) {
  //         res.data.forEach((item) => {
  //           this.selectedIds.add(item.ID);
  //         });
  //         this.dataList.forEach((item) => (item.checked = true));
  //         this.updateSelectedRows();
  //       }
  //     });
  // }

  // checkAll(checked: boolean) {
  //   if (checked) {
  //     this.chekedproduct();
  //   } else {
  //     this.selectedIds.clear();
  //     this.dataList.forEach((item) => (item.checked = false));
  //     this.updateSelectedRows();
  //   }
  // }

  // onRowChecked(row: any) {
  //   if (row.checked) {
  //     this.selectedIds.add(row.ID);
  //   } else {
  //     this.selectedIds.delete(row.ID);
  //   }
  //   this.updateSelectedRows();
  // }

  // updateSelectedRows() {
  //   this.selectedRows = this.dataList.filter((item) =>
  //     this.selectedIds.has(item.ID)
  //   );
  //   this.toggleVisible = this.selectedIds.size > 0;

  //   Object.keys(this.headerToggles).forEach((field) => {
  //     if (this.selectedRows.length) {
  //       this.headerToggles[field] = this.selectedRows.every((r) => !!r[field]);
  //     } else {
  //       this.headerToggles[field] = false;
  //     }
  //   });
  // }

  // ✅ Bulk Update Example (optional)
  // bulkUpdate(fieldName: string, value: any) {
  //   if (this.selectedIds.size === 0) return;
  //   this.loadingRecords = true;

  //   const payload = {
  //     DATA: Array.from(this.selectedIds).map((id) => {
  //       const obj: any = { ID: id };
  //       obj[fieldName] = value;
  //       return obj;
  //     }),
  //   };

  //   this.api.addressBulkUpdate(payload).subscribe(
  //     (res: any) => {
  //       if (res.code == 200) {
  //         this.dataList.forEach((item) => {
  //           if (this.selectedIds.has(item.ID)) {
  //             (item as any)[fieldName] = value;
  //           }
  //           item.checked = false;
  //         });

  //         this.updateSelectedRows();
  //         this.loadingRecords = false;
  //         this.toggleVisible = false;
  //         this.selectedRows = [];
  //         this.selectedIds.clear();
  //         this.allChecked = false;

  //         this.message.success('Bulk update successful', '');
  //       } else {
  //         this.message.error('Bulk update failed', '');
  //         this.loadingRecords = false;
  //       }
  //     },
  //     (err) => {
  //       console.error('Bulk update failed', err);
  //       this.loadingRecords = false;
  //     }
  //   );
  // }

  // ✅ Bulk Delete
  // bulkDelete() {
  //   if (this.selectedIds.size === 0) return;
  //   this.loadingRecords = true;

  //   const payload = {
  //     data: this.selectedRows.map((item) => ({
  //       ID: item.ID,
  //       ADDRESS: item.ADDRESS,
  //     })),
  //   };

  //   this.api.addressDeleteBulk(payload).subscribe(
  //     (res: any) => {
  //       if (res.code == 200) {
  //         this.message.success('Addresses deleted successfully.', '');
  //         this.search();
  //         this.loadingRecords = false;
  //         this.selectedIds.clear();
  //         this.selectedRows = [];
  //         this.allChecked = false;
  //       } else {
  //         this.message.error('Failed to delete addresses.', '');
  //         this.loadingRecords = false;
  //       }
  //     },
  //     (err) => {
  //       console.error('Failed to delete addresses', err);
  //       this.loadingRecords = false;
  //     }
  //   );
  // }

  // ✅ Single Delete
  // deleteSingledata(data: Address) {
  //   this.loadingRecords = true;
  //   const payload = {
  //     data: [{ ID: data.ID, ADDRESS: data.ADDRESS }],
  //   };

  //   this.api.addressDeleteBulk(payload).subscribe(
  //     (res: any) => {
  //       if (res.code == 200) {
  //         this.message.success('Address deleted successfully.', '');
  //         this.search();
  //       } else {
  //         this.message.error('Failed to delete address.', '');
  //       }
  //       this.loadingRecords = false;
  //     },
  //     (err) => {
  //       console.error('Failed to delete address', err);
  //       this.loadingRecords = false;
  //     }
  //   );
  // }
}
