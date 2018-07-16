import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import swal from 'sweetalert2';

@Component({
  selector: 'registration-component',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
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
export class RegistrationComponent {
  email: string;
  name: string;
  surname: string;
  masterkey: string;
  confirmMasterkey: string;

  server = "http://localhost:8000/api/registation"

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('token') != null)
      this.router.navigate(['/']);
  }
  registration() {
    if ((this.name && this.surname && this.email && this.masterkey) != undefined) {
      if (this.emailValidation()) {
        if (this.email.length < 20) {
          if (this.isStrongPwd()) {
            if (this.checkPswConfirm()) {
              this.http.post(this.server, { name: this.name, surname: this.surname, email: this.email, masterkey: this.masterkey })
                .subscribe(data => {
                  if (data['logged']) {
                    localStorage.setItem('token', data['token'])
                    swal({
                      type: 'success',
                      confirmButtonColor: '#FDD835',
                      title: "Registrato con successo",
                    }).then(val => this.router.navigate(['/']));
                  }
                  else if (data['mailUsed']) {
                    swal({
                      type: 'warning',
                      confirmButtonColor: '#FDD835',
                      title: "Email già utilizzata",
                    });
                  } else {
                    swal({
                      type: 'error',
                      confirmButtonColor: '#FDD835',
                      title: "Qualcosa è andato storto",
                    });
                  }
                },
                  error => {
                    swal({
                      type: 'warning',
                      confirmButtonColor: '#FDD835',
                      title: "Inserisci tutti i parametri correttamente",
                    });
                  })
            } else swal({
              type: 'warning',
              confirmButtonColor: '#FDD835',
              title: "Le password inserite non combaciano",
            });
          } else swal({
            type: 'warning',
            confirmButtonColor: '#FDD835',
            title: "La masterkey non rispetta i requisiti di sicurezza",
          });
        } else swal({
          type: 'warning',
          confirmButtonColor: '#FDD835',
          title: "La mail può essere lunga al massimo 20 caratteri",
        });
      } else swal({
        type: 'warning',
        confirmButtonColor: '#FDD835',
        title: "Inserisci una mail valida",
      });
    } else swal({
      type: 'warning',
      confirmButtonColor: '#FDD835',
      title: "Compila tutti i campi",
    });
  }

  checkPswConfirm() {
    if (this.masterkey == this.confirmMasterkey) {
      return true;
    } else { return false; }
  }

  emailValidation() {
    var regMail = /^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/;
    return regMail.test(this.email);
  }

  isStrongPwd() {
    var regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[,!@#$%&*().]).{8,}/;
    var validPassword = regExp.test(this.masterkey);
    return validPassword;
  }

}



