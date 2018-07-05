import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { RegistrationComponent } from '../components/registration/registration.component';

//your component

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'my-app/login', component: LoginComponent},
    { path: 'my-app/registration', component: RegistrationComponent},
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
      RouterModule
   ] 
})
export class RoutingModule { };