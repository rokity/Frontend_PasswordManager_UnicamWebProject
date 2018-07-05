import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  providers: [  ],
})
export class LoginComponent {
  email: String;
  masterkey: String;

  server = "http://localhost:8000/api/login"

  constructor(private http: HttpClient, private router: Router) {
    if(localStorage.getItem('token')!=null)
      this.router.navigate(['/']);
  }
  login() {
   
    var body = { email: this.email, masterkey: this.masterkey };
    fetch(this.server, {
      method: "POST",
      body: JSON.stringify(body)
    }).then(res => res.json()).then(val => {
      if (val.logged == true)
        {
          localStorage.setItem("token", val.token);
          this.router.navigate(['/']);
        }        
      else {
        alert("Parametri non validi");
        this.email = null;
        this.masterkey = null;
      }
    })

  }




}