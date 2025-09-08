import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-benefitsmapping',
  templateUrl: './benefitsmapping.component.html',
  styleUrls: ['./benefitsmapping.component.css']
})
export class BenefitsmappingComponent {
 @Input()drawerClose3!: Function;
 @Input()dataList1: any[] = [];
 formTitle:string="Manage Benefits";
isSpinning:boolean = false;
totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
 loadingRecords = true;
  add(addNew: boolean, websitebannerPage: NgForm): void {

  }
  save(addNew: boolean, websitebannerPage: NgForm): void {}

  close(): void {
    this.drawerClose3();
  }

  search(reset: boolean = false) {
  
  }

  sort(params: NzTableQueryParams): void {
    
  }


    edit(data): void {}

  
}
