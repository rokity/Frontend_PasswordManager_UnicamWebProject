import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { RegistrationComponent } from '../components/registration/registration.component';
import { LogoutComponent } from '../components/logout/logout.component';

//your component

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'logout', component: LogoutComponent},
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
      RouterModule
   ] 
})
export class RoutingModule { };