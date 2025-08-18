import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NgxPrintModule } from 'ngx-print';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MastersRoutingModule } from './masters-routing.module';
// import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MastersComponent } from './Masters/masters.component';

import { MasterMenuListComponent } from './components/Master_Menu/master-menu-list/master-menu-list.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { NzCalendarModule } from 'ng-zorro-antd/calendar';

import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { ColorPickerModule } from 'ngx-color-picker';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzRateModule } from 'ng-zorro-antd/rate';

import { ImageCropperModule } from 'ngx-image-cropper';

import { AddcountryComponent } from './components/CountryMaster/addcountry/addcountry.component';
import { ListcountryComponent } from './components/CountryMaster/listcountry/listcountry.component';
import { UserloginlogsComponent } from './Reports/userloginlogs/userloginlogs.component';
import { MainFilterComponent } from './components/main-filter/main-filter.component';
import { AddunitComponent } from './components/unitmaster/addunit/addunit.component';
import { UnitlistComponent } from './components/unitmaster/unitlist/unitlist.component';
import { AddcategoriesComponent } from './components/categoriesmaster/addcategories/addcategories.component';
import { CategorieslistComponent } from './components/categoriesmaster/categorieslist/categorieslist.component';
import { AddproductComponent } from './components/productmaster/addproduct/addproduct.component';
import { AddproductmappingComponent } from './components/productmaster/addproductmapping/addproductmapping.component';
import { ProductlistComponent } from './components/productmaster/productlist/productlist.component';
import { ProductmappinglistComponent } from './components/productmaster/productmappinglist/productmappinglist.component';
import { ManageOrdersComponent } from './components/Orders/manage-orders/manage-orders.component';

@NgModule({
  declarations: [
    MastersComponent,
    MasterMenuListComponent,
    MainFilterComponent,
    UserloginlogsComponent,
    UnitlistComponent,
    AddunitComponent,
    AddproductComponent,
    AddproductmappingComponent,
    ProductlistComponent,
    ProductmappinglistComponent,
    CategorieslistComponent,
    AddcategoriesComponent,
    AddcountryComponent,
    ListcountryComponent,
    ManageOrdersComponent,
  ],
  imports: [
    // PickerComponent,
    CommonModule,
    NzCalendarModule,
    MastersRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    PickerModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzDrawerModule,
    NzSpinModule,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    NzNotificationModule,
    NzButtonModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTreeSelectModule,
    NzRadioModule,
    NzDividerModule,
    NzTagModule,
    NzModalModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzMessageModule,
    NzListModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzTimePickerModule,
    NzProgressModule,
    NzPopconfirmModule,
    NzBackTopModule,
    NzBadgeModule,
    NzAvatarModule,
    NzTypographyModule,
    NzTabsModule,
    NzTreeModule,
    ReactiveFormsModule,
    NzTimelineModule,
    NgxPrintModule,
    NzCarouselModule,
    DragDropModule,
    NzCardModule,
    NzImageModule,
    NzSpaceModule,
    NzEmptyModule,
    NzStepsModule,
    NzDropDownModule,
    AngularEditorModule,
    ColorPickerModule,
    NzCommentModule,
    NzRateModule,
    ImageCropperModule,
    DragDropModule,
  ],
  exports: [
    MastersComponent,

    MastersComponent,
    MastersComponent,

    MasterMenuListComponent,
  ],
})
export class MasterModule {}
