import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { trigger,state,style,animate,transition} from '@angular/animations';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [],
  animations: [
    trigger('simpleFadeAnimation', [

      state('in', style({opacity: 1})),

      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      transition(':leave',
        animate(600, style({opacity: 0})))
    ])]
})
export class HomeComponent {
  title = 'DominKey';
  testo = ''
  link = ''
  modifyProfile = true; 
  registration = false;
  domains = false;

  
  constructor(private http: HttpClient) {
    this.navbar();
  }

  navbar() {
    if (localStorage.getItem('token')) {
      this.domains = false;
      this.registration = true;
      this.testo = "Logout"
      this.link = '/logout'
      this.modifyProfile = false;
    }
    else {
      this.registration = false;
      this.domains = true;
      this.testo = "Login"
      this.link = '/login'
      this.modifyProfile = true;
    }
  }
}