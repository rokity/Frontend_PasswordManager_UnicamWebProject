import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { RegistrationComponent } from '../components/registration/registration.component';
import { LogoutComponent } from '../components/logout/logout.component';
import { DomainComponent } from '../components/domain/domain.component';
import { ProfiloComponent } from '../components/profilo/profilo.component';

//your component

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'logout', component: LogoutComponent},
    { path: 'domains', component: DomainComponent},
    { path: 'profilo', component: ProfiloComponent},
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
      RouterModule
   ] 
})
export class RoutingModule { };