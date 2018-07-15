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
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
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
        if (this.isStrongPwd()) {
          if (this.checkPswConfirm()) {
            this.http.post(this.server, { name: this.name, surname: this.surname, email: this.email, masterkey: this.masterkey })
              .subscribe(data => {
                if (data['logged']) {
                  localStorage.setItem('token', data['token'])
                  this.router.navigate(['/']);
                }
                else if (data['mailUsed']) {
                  swal("Email già utilizzata");
                }
              },
              error=>
              {
                swal("Parametri non corretti");
              })
          } else swal("Le password inserite non combaciano");
        } else swal("La masterkey non rispetta i requisiti di sicurezza")
      } else swal("Inserisci una mail valida");
    } else swal("Compila tutti i campi");
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



