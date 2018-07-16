import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import swal from 'sweetalert2';

@Component({
    selector: 'profile-component',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
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
export class ProfileComponent {
    profile = { name: '', surname: '', email: '', masterkey: '', confirmMasterkey: '' };

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
                        this.profile.name = data['name'];
                        this.profile.surname = data['surname'];
                        this.profile.email = data['email'];
                    }

                })
        }
    }

    modify() {
        if ((this.profile.name && this.profile.surname && this.profile.email && this.profile.masterkey) != undefined) {
            if (this.emailValidation()) {
                if (this.profile.email.length <= 20) {
                    if (this.isStrongPwd()) {
                        if (this.checkPswConfirm()) {
                            var url = "http://localhost:8000/api/profile/modify"
                            this.http.put(url, { token: localStorage.getItem('token'), name: this.profile.name, surname: this.profile.surname, email: this.profile.email, masterkey: this.profile.masterkey })
                                .subscribe(data => {
                                    if (data['modified'] == true) {
                                        swal({
                                            type: 'success',
                                            confirmButtonColor: '#FDD835',
                                            title: "Profilo aggiornato",
                                          }).then(val => this.router.navigate(['/']));
                                    }
                                    else if (data['mailUsed']) {
                                        swal({
                                            type: 'warning',
                                            confirmButtonColor: '#FDD835',
                                            title: "Email già utilizzata",
                                          });
                                    }
                                    else swal({
                                        type: 'error',
                                        confirmButtonColor: '#FDD835',
                                        title: "Qualcosa è andato storto",
                                      });
                                },
                                    error => {
                                        swal({
                                            type: 'error',
                                            confirmButtonColor: '#FDD835',
                                            title: "Qualcosa è andato storto",
                                          });
                                    });
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
        if (this.profile.masterkey == this.profile.confirmMasterkey) {
            return true;
        } else { return false; }
    }

    emailValidation() {
        var regMail = /^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/;
        return regMail.test(this.profile.email);
    }

    isStrongPwd() {
        var regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[,!@#$%&*().]).{8,}/;
        var validPassword = regExp.test(this.profile.masterkey);
        return validPassword;
    }
    giveup() {
        this.router.navigate(['/']);
    }
};