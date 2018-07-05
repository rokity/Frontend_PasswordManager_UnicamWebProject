import { Component } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent {
  title = 'DominKey';
  testo = ''
  link = ''
  constructor(private http: HttpClient) {
    if(localStorage.getItem('token'))
      {
        this.testo = "Logout"
        this.link = 'http://localhost:4200/logout'
      }
    else
    {
      this.testo = "Login"
      this.link = 'http://localhost:4200/login'
    }
  }
}