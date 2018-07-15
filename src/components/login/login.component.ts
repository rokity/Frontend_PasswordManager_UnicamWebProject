import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),
      transition(':leave',
        animate(600, style({ opacity: 0 })))
    ])]
})
export class LoginComponent {
  email: string;
  masterkey: string;

  server = "http://localhost:8000/api/login"

  constructor(private http: HttpClient, private router: Router) {
    
  }
  login() {
    if (this.emailValidation() || !this.masterkey == undefined) {
      var body = { email: this.email, masterkey: this.masterkey };
      fetch(this.server, {
        method: "POST",
        body: JSON.stringify(body)
      }).then(res => res.json()).then(val => {
        if (val.logged == true) {
          localStorage.setItem("token", val.token);
          this.router.navigate(['/']);
        }
        else {
          alert("Email o password errati");
          this.email = null;
          this.masterkey = null;
        }
      })
    } else alert("Inserisci tutti i parametri correttamente");
  }

  emailValidation() {
    var regMail = /^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/;
    return regMail.test(this.email);
  }

}