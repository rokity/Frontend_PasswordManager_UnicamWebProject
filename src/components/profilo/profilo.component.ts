import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import swal from 'sweetalert2';

@Component({
    selector: 'profilo-component',
    templateUrl: './profilo.component.html',
    styleUrls: ['./profilo.component.css'],
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
export class ProfiloComponent {
    profilo = { name: '', surname: '', email: '', masterkey: '',confirmMasterkey:'' };

    constructor(private http: HttpClient, private router: Router) {
        if (localStorage.getItem('token') == null)
            this.router.navigate(['/login']);
        else {
            var url = "http://localhost:8000/api/profile/get"
            let params = new HttpParams().set('token', localStorage.getItem('token'));
            this.http.get(url, { params: params })
                .subscribe(data => {
                    if (data['authenticated'] == false) {
                        localStorage.removeItem('token')
                        this.router.navigate(['/login']);
                    }
                    else {
                        this.profilo.name = data['name'];
                        this.profilo.surname = data['surname'];
                        this.profilo.email = data['email'];
                    }

                })
        }
    }

    modifica()
    {
        if ((this.profilo.name && this.profilo.surname && this.profilo.email && this.profilo.masterkey) != undefined) {
            if (this.emailValidation()) {
              if (this.isStrongPwd()) {
                if (this.checkPswConfirm()) {
                    var url="http://localhost:8000/api/profile/modify"
                  this.http.put(url, {token:localStorage.getItem('token'), name: this.profilo.name, surname: this.profilo.surname, email: this.profilo.email, masterkey: this.profilo.masterkey })
                    .subscribe(data => {
                      if (data['modified']==true) {
                        swal("Account modificato!");
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
        if (this.profilo.masterkey == this.profilo.confirmMasterkey) {
          return true;
        } else { return false; }
      }
    
      emailValidation() {
        var regMail = /^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/;
        return regMail.test(this.profilo.email);
      }
    
      isStrongPwd() {
        var regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[,!@#$%&*().]).{8,}/;
        var validPassword = regExp.test(this.profilo.masterkey);
        return validPassword;
      }
      annulla()
    {
        this.router.navigate(['/']);
    }
};