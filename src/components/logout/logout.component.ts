import { Component } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'logout-component',
    templateUrl: './logout.component.html'
  })
  export class LogoutComponent {
    server = "http://localhost:8000/api/logout"

    constructor(private http: HttpClient,private router: Router) {
      
      this.logout();
      
    }
    logout() {
      let params = new HttpParams().set('token', localStorage.getItem('token'));
      this.http.get(this.server,{ params: params })
      .subscribe( data =>  {
        localStorage.removeItem('token')
        this.router.navigate(['/'])
      } )
    }
  }