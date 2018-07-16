import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import swal from 'sweetalert2';
import { error } from 'util';

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
    if (this.emailValidation() && this.masterkey != undefined ) {
      if (this.email.length <= 20) {
        if (this.masterkey.length >= 8) {
          var body = { email: this.email, masterkey: this.masterkey };
          this.http.post(this.server, body).subscribe(val => {
            if (val['logged'] == true) {
              localStorage.setItem("token", val['token']);
              swal({
                type: 'success',
                confirmButtonColor: '#FDD835',
                title: "Loggato con successo",
              }).then(val => this.router.navigate(['/']));
            }
            else {
              swal({
                type: 'warning',
                confirmButtonColor: '#FDD835',
                title: "Email o password errati",
              });
              this.email = null;
              this.masterkey = null;
            }
          },
            error => {
              swal({
                type: 'error',
                confirmButtonColor: '#FDD835',
                title: "Qualcosa è andato storto",
              });
            });
        } else {
          swal({
            type: 'warning',
            confirmButtonColor: '#FDD835',
            title: "Email o password errati",
          });
          this.email = null;
          this.masterkey = null;
        }
      } else swal({
        type: 'warning',
        confirmButtonColor: '#FDD835',
        title: "La mail può essere lunga al massimo 20 caratteri",
      });
    } else swal({
      type: 'warning',
      confirmButtonColor: '#FDD835',
      title: "Inserisci tutti i parametri correttamente",
    });
  }

  emailValidation() {
    var regMail = /^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/;
    return regMail.test(this.email);
  }

}