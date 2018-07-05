import { Component } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

import { trigger,state,style,animate,transition} from '@angular/animations';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])]
})
export class HomeComponent {
  title = 'DominKey';
  testo = ''
  link = ''
  registration = false;
  constructor(private http: HttpClient) {
    if(localStorage.getItem('token'))
      {
        this.registration =true;
        this.testo = "Logout"
        this.link = 'http://localhost:4200/logout'
      }
    else
    {
      this.registration =false;
      this.testo = "Login"
      this.link = 'http://localhost:4200/login'
    }
  }
}