import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ChildActivationStart } from '@angular/router';
import { generate } from 'generate-password-browser';
import swal from 'sweetalert2';

@Component({
  selector: 'domain-component',
  templateUrl: './domain.component.html',
})
export class DomainComponent {
  title = 'DominKey';
  testo = ''
  link = ''
  registration = false;
  domains = false;
  token = localStorage.getItem('token');

  getAll = "http://localhost:8000/api/domain/getall"
  domainsArray: Object;
  hiddenTable = true;

  addDomain = "http://localhost:8000/api/domain/add"
  modifyDomain = "http://localhost:8000/api/domain/modify"

  ApiDeleteDomain = "http://localhost:8000/api/domain/delete"

  ApiGetPassword = "http://localhost:8000/api/domain/get"

  constructor(private http: HttpClient, private router: Router) {
    this.navbar();
    this.loadDomains();
  }

  navbar() {
    if (localStorage.getItem('token')) {
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


  item: any = { domain: '', id: null, readonly: '', password: '' };
  domainUpdate(event, id, domain) {
    this.item.domain = domain;
    this.item.id = id;
    this.item.readonly = "readonly";
    let params = new HttpParams().set('token', localStorage.getItem('token')).set('domainID', id);
    this.http.get(this.ApiGetPassword, { params: params })
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        if (data['domains'] == false)
          this.hiddenTable = true
        else {
          this.hiddenTable = false
          this.item.password=(data[0]['PASSWORD'])
        }
      })
  }
  lengthPassword: number = 0;
  includeNumbers: boolean = false;
  includeSymbols: boolean = false;
  useUpperCase: boolean = false;
  excludeSimilarCharacters: boolean = false;
  excludeThisCharacters: string = "";
  mustInclude: boolean = false;
  generatePassword() {
    this.item.password = generate({
      length: this.lengthPassword,
      numbers: this.includeNumbers,
      symbols: this.includeSymbols,
      uppercase: this.useUpperCase,
      excludeSimilarCharacters: this.excludeSimilarCharacters,
      exclude: this.excludeThisCharacters,
      strict: this.mustInclude
    });
  }

  salvaPassword() {
    var params ;
    if (this.item.id != null) {
      params = { token: this.token, domain: this.item.domain, psw: this.item.password, domainID: this.item.id };
      this.item.id=null;
      this.savePassword(this.modifyDomain, params);
    }
    else
    {
      params = { token: this.token, domain: this.item.domain, psw: this.item.password };
      this.savePassword(this.addDomain, params);
    }

  }

  displayPassword(event, domainID) {
    let params = new HttpParams().set('token', localStorage.getItem('token')).set('domainID', domainID);
    this.http.get(this.ApiGetPassword, { params: params })
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        if (data['domains'] == false)
          this.hiddenTable = true
        else {
          this.hiddenTable = false
          alert(data[0]['PASSWORD'])
        }
      })
  }

  //API REQUESTS

  loadDomains() {
    let params = new HttpParams().set('token', localStorage.getItem('token'));
    this.http.get(this.getAll, { params: params })
      .subscribe(data => {
        if (data['authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        if (data['domains'] == false)
          this.hiddenTable = true
        else {
          this.hiddenTable = false
          this.domainsArray = data;

        }

      })
  }

  savePassword(url, params) {
    console.log("url",url)
    console.log("params",params)
    this.http.post(url, params)
      .subscribe(data => {
        if (data['Authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        if (data['domainAlreadyInserted'] == true)
          swal('Domain already exist')
        else if (data['DomainAdded'] == false)
          swal('Domain not added')
        else {
          swal('Domain added').then(val => location.reload());
        }

      })
  }

  domainDelete(event, domainID) {
    var params = { token: this.token, domainID };
    this.http.post(this.ApiDeleteDomain, params)
      .subscribe(data => {
        if (data['Authenticated'] == false) {
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        else {
          swal('Domain deleted').then(val => location.reload());
        }
      })
  }



}