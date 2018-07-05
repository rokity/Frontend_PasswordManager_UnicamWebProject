import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',

})
export class LoginComponent {
  email: String;
  masterkey: String;

  server = "http://localhost:8000/api/login"

  constructor(private http: HttpClient, private router: Router, private cookie: CookieService) {

  }
  login() {
   
    var body = { email: this.email, masterkey: this.masterkey };
    fetch(this.server, {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body)
    }).then(res => 
      {
        console.log(res.headers.get('set-cookie')); 
        console.log(document.cookie)
        return res.json()
      }).then(val => {
      if (val.logged == true)
        this.router.navigate(['/']);
      else {
        alert("Parametri non validi");
        this.email = null;
        this.masterkey = null;
      }
    })

    // this.http.post(this.server, { email: this.email, masterkey: this.masterkey }, { withCredentials: true })
    //   .subscribe(data => {
    //     console.log(this.cookie.getAll())
    //     if (data['logged'])
    //       this.router.navigate(['/']);
    //     else {
    //       alert("Parametri non validi");
    //       this.email = null;
    //       this.masterkey = null;
    //     }
    //   })

  }




}