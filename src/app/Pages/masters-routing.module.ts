import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MastersComponent } from './Masters/masters.component';

import { UserloginlogsComponent } from './Reports/userloginlogs/userloginlogs.component';
import { DashboardComponent } from 'src/dashboard.component/dashboard.component';
import { FormsComponent } from '../CommonForms/Forms/forms/forms.component';
import { RolesComponent } from '../CommonForms/Roles/roles/roles.component';

import { ListcountryComponent } from './components/CountryMaster/listcountry/listcountry.component';

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
      // { path: 'login', component: LoginComponent },
      // { path: 'contact', component: ContactlistComponent },
      // { path: 'about', component: AboutmasterlistComponent },
      // { path: 'category', component: CategorieslistComponent },
      // { path: 'blog', component: BloglistComponent },
      // { path: 'adwebsitebanner', component: AdbannerlistComponent },
      // { path: 'unitmaster', component: UnitlistComponent },
      // { path: 'mapbanner', component: MapbannerComponent },
      // { path: 'cartaddonmaster', component: ListcartaddonmasterComponent },
      // { path: 'cartaddondetail', component: ListcartaddondetailsComponent },
      // { path: 'cartmaster', component: ListcartmasterComponent },
      // { path: 'statemaster', component: ListstateComponent },
      // { path: 'listcustomer', component: ListCustomerMasterComponent },
      // { path: 'listaddressmaster', component: ListAddressMasterComponent },

      { path: 'country_list', component: ListcountryComponent },

      // { path: 'orderdetails', component: OrderComponent },

      // { path: 'BeingPrepared', component: ListBeingPrepareComponent },
      // { path: 'dispatched', component: ListDeliveredComponent },
      // { path: 'DeliveryDone', component: ListDeliveryDoneComponent },

      // { path: 'deliveryteam1', component: ListDeliveryInProgressComponent },
      // { path: 'delivered', component: ListFinalDeliveryComponent },

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
