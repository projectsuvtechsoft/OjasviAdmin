import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './CommonForms/Users/users/users.component';
import { RolesComponent } from './CommonForms/Roles/roles/roles.component';
import { FormsComponent } from './CommonForms/Forms/forms/forms.component';
import { MainDashboardComponent } from './CommonForms/main-dashboard/main-dashboard.component';
import { AdminDashboardComponent } from './AdminDashboard/admin-dashboard/admin-dashboard.component';
// import { MaindashboardComponent } from "./maindashboard/maindashboard.component";
// import { SearchpageComponent } from './searchpage/searchpage.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'dashboard', component: MainDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  // { path: "search", component: SearchpageComponent },
  {
    path: 'masters',
    loadChildren: () =>
      import('./Pages/masters.module').then((m) => m.MasterModule),
  },

  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})


export class AppRoutingModule {
}
