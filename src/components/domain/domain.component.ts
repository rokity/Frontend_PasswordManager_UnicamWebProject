import { Component } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

@Component({
  selector: 'domain-component',
  templateUrl: './domain.component.html',
})
export class DomainComponent {
  title = 'DominKey';
  testo = ''
  link = ''
  constructor(private http: HttpClient) {
  }
}