import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ChildActivationStart } from '@angular/router';
import { trigger,state,style,animate,transition} from '@angular/animations';
import { generate } from 'generate-password-browser';
import swal from 'sweetalert2';

@Component({
  selector: 'domain-component',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
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
    this.loadDomains();
  }

  navbar() {
    if (this.token != null) {
      this.domains = false;
      this.registration = true;
      this.testo = "Logout"
      this.link = 'http://localhost:4200/logout'
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
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
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
          this.hiddenTable = true
        else {
          this.hiddenTable = false
          swal({text:data['password']})
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
    else
      swal("Lunghezza Password non corretta! \nMassimo 30 , Minimo 5")
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
    else
      swal("Lunghezza Password non corretta! \nMassimo 30 , Minimo 5")
  }


  salvaPassword() {
    var params = { token: this.token, domain: this.nuovoDominio.domain, psw: this.nuovoDominio.password };
    var url = "http://localhost:8000/api/domain/add"
    this.http.put(url, params)
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        if (data['domainAlreadyInserted'] == true)
          swal('Dominio già esistente')
        else if (data['DomainAdded'] == false)
          swal('Dominio non aggiunto')
        else if (data['DomainAdded'] == true){
          swal('Dominio aggiunto').then(val => location.reload());
        }       
      },error => {
        swal("Parametri Mancanti")
      })
  }

  domainDelete(event, domainID) {
    var params = { token: this.token, domainID };
    var url = "http://localhost:8000/api/domain/delete"
    this.http.delete(url,{params})
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        else if (data['deleted'] == 0) {
          console.error(data['error']);
          swal("Dominio non eliminato");
        }
        else {
          swal('Dominio eliminato').then(val => location.reload());
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
          swal('Dominio Non Aggiornato')
        else {
          swal('Dominio Aggiornato').then(val => location.reload());
        }
      },error => {
        swal("Parametri Mancanti")
      })
  }


}