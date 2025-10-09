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
import { AboutmasterlistComponent } from './components/aboutmaster/aboutmasterlist/aboutmasterlist.component';
import { AdbannerlistComponent } from './components/adbannermaster/adbannerlist/adbannerlist.component';
import { BloglistComponent } from './components/blogmaster/bloglist/bloglist.component';
import { ContactlistComponent } from './components/contactinfo/contactlist/contactlist.component';
import { ListCustomerMasterComponent } from './components/CustomerMaster/list-customer-master/list-customer-master.component';
import { ListPackagingChargesComponent } from './components/Packaging Charges/list-packaging-charges/list-packaging-charges.component';
import { ListPincodeMasterComponent } from './components/PinCodeMaster.ts/list-pincode-master/list-pincode-master.component';
import { ListstateComponent } from './components/StateMaster/liststate/liststate.component';
import { WebsitebannerlistComponent } from './components/websitebannermaster/websitebannerlist/websitebannerlist.component';
import { CustomerDetailsReportComponent } from './Reports/customer-details-report/customer-details-report.component';
import { NewsubscribersComponent } from './Reports/newsubscribers/newsubscribers.component';
import { OTPReportComponent } from './Reports/OTPReport/otpreport/otpreport.component';
import { ListPaymentReportComponent } from './Reports/PaymentReport/list-payment-report/list-payment-report.component';
import { ProductSaleDetailsReportComponent } from './Reports/product-sale-details-report/product-sale-details-report.component';
import { ProductSummaryReportComponent } from './Reports/product-summary-report/product-summary-report.component';
import { UsercontactComponent } from './Reports/usercontact/usercontact.component';
import { ListingredientsComponent } from './components/Ingredientmaster/listingredients/listingredients.component';
import { PackagingListViewComponent } from './components/Orders/manage-orders/Packaging order/packaging-list-view/packaging-list-view.component';
import { PackagingListComponent } from './components/Orders/manage-orders/Packaging order/packaging-list/packaging-list.component';
import { PackagedOrdersComponent } from './components/Orders/manage-orders/Packaged order/packaged-orders/packaged-orders.component';
import { DespatchingOrdersviewComponent } from './components/Orders/manage-orders/Dispatching orders/despatching-ordersview/despatching-ordersview.component';
import { DespatchingOrdersComponent } from './components/Orders/manage-orders/Dispatching orders/despatching-orders/despatching-orders.component';
import { DespatchedOrderComponent } from './components/Orders/manage-orders/Despatched orders/despatched-order/despatched-order.component';
import { DeliveredOrdersComponent } from './components/Orders/manage-orders/Delivered Orders/delivered-orders/delivered-orders.component';
import { ShippingandhandlingComponent } from './components/shippingandhandling/shippingandhandling.component';
import { ReviewenabledisableComponent } from './components/reviewenabledisable/reviewenabledisable.component';
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
      { path: 'pending_orders', component: ManageOrdersComponent },

      {
        path: 'user-login-logs-report',
        component: UserloginlogsComponent,
      },
      { path: 'country_list', component: ListcountryComponent },
      { path: 'pincode', component: ListPincodeMasterComponent },
      { path: 'state_list', component: ListstateComponent },
      { path: 'packaging_charges', component: ListPackagingChargesComponent },
      { path: 'customer', component: ListCustomerMasterComponent },

      { path: 'websitebanner', component: WebsitebannerlistComponent },
      { path: 'adwebsitebanner', component: AdbannerlistComponent },
      { path: 'blog', component: BloglistComponent },

      { path: 'contact_us', component: ContactlistComponent },
      { path: 'about_us', component: AboutmasterlistComponent },
      { path: 'customer_details', component: CustomerDetailsReportComponent },
      { path: 'ingredients_master', component: ListingredientsComponent },

      {
        path: 'productsalesdetailreport',
        component: ProductSaleDetailsReportComponent,
      },
      { path: 'payment_report', component: ListPaymentReportComponent },
      { path: 'product_summary', component: ProductSummaryReportComponent },
      { path: 'otp_report', component: OTPReportComponent },
      { path: 'news_subscribers', component: NewsubscribersComponent },
      { path: 'user_contact', component: UsercontactComponent },
      { path: 'packaging_order', component: PackagingListComponent },
      { path: 'packaged_order', component: PackagedOrdersComponent },
      { path: 'dispatching_orders', component: DespatchingOrdersComponent },
      { path: 'dispatched_orders', component: DespatchedOrderComponent },
      { path: 'delivered_orders', component: DeliveredOrdersComponent },
      { path: 'shippingandhandling', component:ShippingandhandlingComponent },
      { path: 'enabledisablereviews', component: ReviewenabledisableComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}
