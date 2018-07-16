import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ChildActivationStart } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { generate } from 'generate-password-browser';
import swal from 'sweetalert2';

@Component({
  selector: 'domain-component',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css'],
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
export class DomainComponent {
  title = 'DominKey';
  testo = ''
  link = ''
  registration = false;
  domains = false;
  token = localStorage.getItem('token');
  aggiornaDominio = { id: '', domain: '', lengthPassword: 5, includeNumbers: false, includeSymbols: false, useUpperCase: false, excludeSimilarCharacters: false, excludeThisCharacters: '', mustInclude: false, password: '' }
  nuovoDominio = { domain: '', lengthPassword: 5, includeNumbers: false, includeSymbols: false, useUpperCase: false, excludeSimilarCharacters: false, excludeThisCharacters: '', mustInclude: false, password: '' }

  domainsArray: Object;
  hiddenTable = true;




  constructor(private http: HttpClient, private router: Router) {
    this.navbar();
  }

  navbar() {
    if (this.token != null) {
      this.domains = false;
      this.registration = true;
      this.testo = "Logout"
      this.link = 'http://localhost:4200/logout'
      this.loadDomains();
    }
    else {
      this.domains = true;
      this.registration = false;
      this.router.navigate(['/login']);
    }
  }

  loadDomains() {
    let params = new HttpParams().set('token', this.token);
    var url = "http://localhost:8000/api/domain/getall";
    this.http.get(url, { params: params })
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token');
          swal({
            type: 'warning',
            confirmButtonColor: '#FDD835',
            title: "Sessione scaduta"
          }).then(val => this.router.navigate(['/']));
        }
        if (data['domains'] == false)
          this.hiddenTable = true
        else {
          this.hiddenTable = false
          this.domainsArray = data['domains'];
        }
      })
  }


  displayPassword(event, domainID) {
    let params = new HttpParams().set('token', this.token).set('domainID', domainID);
    var url = "http://localhost:8000/api/domain/get"
    this.http.get(url, { params: params })
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        if (data['domain'] == false)
          this.hiddenTable = true;
        else {
          this.hiddenTable = false;
          swal({
            confirmButtonColor: '#FDD835',
            text: data['password'],
          });
        }
      })
  }



  domainUpdate(event, id, domain) {
    this.aggiornaDominio.domain = domain;
    this.aggiornaDominio.id = id;
    let params = new HttpParams().set('token', this.token).set('domainID', id);
    var url = "http://localhost:8000/api/domain/get"
    this.http.get(url, { params: params })
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        if (data['domains'] == false)
          this.hiddenTable = true
        else {
          this.hiddenTable = false
          this.aggiornaDominio.password = (data['password'])
        }
      })
  }

  generatePassword() {
    if (this.nuovoDominio.lengthPassword >= 5 && this.nuovoDominio.lengthPassword <= 30) {
      this.nuovoDominio.password = generate({
        length: this.nuovoDominio.lengthPassword,
        numbers: this.nuovoDominio.includeNumbers,
        symbols: this.nuovoDominio.includeSymbols,
        uppercase: this.nuovoDominio.useUpperCase,
        excludeSimilarCharacters: this.nuovoDominio.excludeSimilarCharacters,
        exclude: this.nuovoDominio.excludeThisCharacters,
        strict: this.nuovoDominio.mustInclude
      });
    }
    else swal({
      type: 'warning',
      confirmButtonColor: '#FDD835',
      title: "La password deve variare tra i 5 ed i 30 caratteri",
    });
  }

  generatePasswordUpdate() {
    if (this.aggiornaDominio.lengthPassword >= 5 && this.aggiornaDominio.lengthPassword <= 30) {
      this.aggiornaDominio.password = generate({
        length: this.aggiornaDominio.lengthPassword,
        numbers: this.aggiornaDominio.includeNumbers,
        symbols: this.aggiornaDominio.includeSymbols,
        uppercase: this.aggiornaDominio.useUpperCase,
        excludeSimilarCharacters: this.aggiornaDominio.excludeSimilarCharacters,
        exclude: this.aggiornaDominio.excludeThisCharacters,
        strict: this.aggiornaDominio.mustInclude
      });
    }
    else swal({
      type: 'warning',
      confirmButtonColor: '#FDD835',
      title: "La password deve variare tra i 5 ed i 30 caratteri",
    });
  }


  savePassword() {
    var params = { token: this.token, domain: this.nuovoDominio.domain, psw: this.nuovoDominio.password };
    var url = "http://localhost:8000/api/domain/add"
    this.http.post(url, params)
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        if (data['domainAlreadyInserted'] == true)
          swal({
            type: 'warning',
            confirmButtonColor: '#FDD835',
            title: "Dominio già esistente",
          });
        else if (data['DomainAdded'] == false)
          swal({
            type: 'error',
            confirmButtonColor: '#FDD835',
            title: 'Qualcosa è andato storto',
          });
        else if (data['DomainAdded'] == true) {
          swal({
            type: 'success',
            confirmButtonColor: '#FDD835',
            title: 'Dominio aggiunto',
          }).then(val => location.reload());
        }
      }, error => {
        swal({
          type: 'warning',
          confirmButtonColor: '#FDD835',
          title: "Inserisci tutti i parametri correttamente",
        });
      })
  }

  domainDelete(event, domainID) {
    var params = { token: this.token, domainID };
    var url = "http://localhost:8000/api/domain/delete"
    this.http.delete(url, { params })
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        else if (data['deleted'] == 0) {
          console.error(data['error']);
          swal({
            type: 'error',
            confirmButtonColor: '#FDD835',
            title: 'Qualcosa è andato storto',
          });
        }
        else {
          swal({
            type: 'success',
            confirmButtonColor: '#FDD835',
            title: 'Dominio eliminato',
          }).then(val => location.reload());
        }
      })
  }

  aggiornaPassword() {
    var params = { token: this.token, domain: this.aggiornaDominio.domain, psw: this.aggiornaDominio.password, domainID: this.aggiornaDominio.id };
    var url = "http://localhost:8000/api/domain/modify"
    this.http.put(url, params)
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        else if (data['error'])
          swal({
            type: 'error',
            confirmButtonColor: '#FDD835',
            title: "Qualcosa è andato storto",
          });
        else {
          swal({
            type: 'success',
            confirmButtonColor: '#FDD835',
            title: "Dominio aggiornato",
          }).then(val => location.reload());
        }
      }, error => {
        swal({
          type: 'warning',
          confirmButtonColor: '#FDD835',
          title: "Inserisci tutti i parametri correttamente",
        });
      })
  }


}