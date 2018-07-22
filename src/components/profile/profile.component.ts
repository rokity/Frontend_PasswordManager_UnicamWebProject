import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import swal from 'sweetalert2';
import * as globals from '../../app/globals';

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
    profile = { name: '', surname: '', email: '', oldmasterkey: '', masterkey: '', confirmMasterkey: '' };

    constructor(private http: HttpClient, private router: Router) {
        if (localStorage.getItem('token') == null)
            this.router.navigate(['/login']);
        else {
            var url = "http://"+globals.server+"/api/profile/get"
            let params = new HttpParams().set('token', localStorage.getItem('token'));
            this.http.get(url, { params: params })
                .subscribe(data => {
                    if (data['authenticated'] == false) {
                        localStorage.removeItem('token');
                        swal({
                            type: 'warning',
                            confirmButtonColor: '#FDD835',
                            title: "Sessione scaduta"
                        }).then(val => this.router.navigate(['/login']));

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
        if ((this.profile.name && this.profile.surname && this.profile.email && this.profile.masterkey && this.profile.oldmasterkey) != undefined && 
        (this.profile.name.length && this.profile.surname.length && this.profile.email.length && this.profile.masterkey.length && this.profile.oldmasterkey.length) >0) {
            if (this.emailValidation()) {
                if (this.profile.email.length <= 20) {
                    if (this.isStrongPwd()) {
                        if (this.checkPswConfirm()) {
                            if (this.profile.oldmasterkey.length >= 8) {
                                if (this.profile.oldmasterkey != this.profile.masterkey) {
                                    var url = "http://"+globals.server+"/api/profile/modify"
                                    this.http.put(url, { token: localStorage.getItem('token'), name: this.profile.name, surname: this.profile.surname, email: this.profile.email, oldmasterkey: this.profile.oldmasterkey, masterkey: this.profile.masterkey })
                                        .subscribe(data => {
                                            if (data['authenticated']) {
                                                if ((data['errordselect'] && data['errordselect']) == undefined) {
                                                    if (data['matchold']) {
                                                        if (data['modified']) {
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
                                                    } else {
                                                        swal({
                                                            type: 'warning',
                                                            confirmButtonColor: '#FDD835',
                                                            title: "Vecchia masterkey errata",
                                                        });
                                                        this.profile.oldmasterkey = null;
                                                        this.profile.masterkey = null;
                                                        this.profile.confirmMasterkey = null;
                                                    }
                                                } else {
                                                    swal({
                                                        type: 'warning',
                                                        confirmButtonColor: '#FDD835',
                                                        title: "Qualcosa è andato storto",
                                                    });
                                                }
                                            } else {
                                                localStorage.removeItem('token');
                                                swal({
                                                    type: 'warning',
                                                    confirmButtonColor: '#FDD835',
                                                    title: "Sessione scaduta"
                                                }).then(val => this.router.navigate(['/login']));
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
                                    title: "La vecchia e la nuova masterkey che hai inserito coincidono",
                                });
                                }
                            } else {
                                swal({
                                    type: 'warning',
                                    confirmButtonColor: '#FDD835',
                                    title: "Vecchia masterkey errata",
                                });
                                this.profile.oldmasterkey = null;
                                this.profile.masterkey = null;
                                this.profile.confirmMasterkey = null;
                            }
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