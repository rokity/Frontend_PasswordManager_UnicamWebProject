import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2'

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

  constructor(private http: HttpClient, private router: Router) {
    this.navbar();
    this.loadDomains();
  }

  domainAdd(event, item) {
    var url = this.addDomain;
    if (item == null)
      item = { DOMAIN: '', PASSWORD: '', READONLY: '' }
    else { url = this.modifyDomain; item.READONLY = "readonly"; }

    swal({
      title: 'Multiple inputs',
      html:
        `<input id="dominio" class="swal2-input"  placeholder="Domain" ${item.READONLY} value="${item.DOMAIN}">
         <input id="pw" class="swal2-input" type="password" placeholder="Passowrd" value="${item.PASSWORD}">`,
      focusConfirm: false,
      preConfirm: () => {
        var dominio = (<HTMLInputElement>document.getElementById('dominio')).value;
        var pw = (<HTMLInputElement>document.getElementById('pw')).value;
        var params = { token: this.token, domain: dominio, psw: pw, domainID: item.ID };
        console.info("params", params)
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
    })
  }

  domainDelete(event, domain) {
    var params = { token: this.token, domainID: domain.ID };
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

  loadDomains() {
    let params = new HttpParams().set('token', localStorage.getItem('token'));
    this.http.get(this.getAll, { params: params })
      .subscribe(data => {
        if (data['Authenticated'] == false) {
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
}