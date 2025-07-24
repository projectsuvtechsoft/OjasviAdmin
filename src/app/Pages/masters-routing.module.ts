import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MastersComponent } from './Masters/masters.component';

import { UserloginlogsComponent } from './Reports/userloginlogs/userloginlogs.component';
import { DashboardComponent } from 'src/dashboard.component/dashboard.component';
import { FormsComponent } from '../CommonForms/Forms/forms/forms.component';
import { RolesComponent } from '../CommonForms/Roles/roles/roles.component';

import { ListcountryComponent } from './components/CountryMaster/listcountry/listcountry.component';
import { UnitlistComponent } from './components/unitmaster/unitlist/unitlist.component';
import { CategorieslistComponent } from './components/categoriesmaster/categorieslist/categorieslist.component';
import { MasterMenuListComponent } from './components/Master_Menu/master-menu-list/master-menu-list.component';
import { ProductlistComponent } from './components/productmaster/productlist/productlist.component';
import { ManageOrdersComponent } from './components/Orders/manage-orders/manage-orders.component';

const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      // { path: 'users', component: UsersComponent },
      // { path: 'roles', component: RolesComponent },
      // { path: 'forms', component: FormsComponent },
      // { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'category_list', component: CategorieslistComponent },
      { path: 'unit_list', component: UnitlistComponent },
      { path: 'menu', component: MasterMenuListComponent },
      { path: 'product_list', component: ProductlistComponent },

      { path: 'country_list', component: ListcountryComponent },
      { path: 'orders', component: ManageOrdersComponent },

      {
        path: 'user-login-logs-report',
        component: UserloginlogsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}
