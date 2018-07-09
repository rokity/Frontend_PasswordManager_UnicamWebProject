import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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
      this.link = 'http://localhost:4200/logout'
    }
    else {
      this.registration = false;
      this.domains = true;
      this.testo = "Login"
      this.link = 'http://localhost:4200/login'
    }
  }
}