import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
})
export class LoginComponent  {
  title : String = "CIAONE";

  constructor(private http : HttpClient) { 
    this.http.get("https://swapi.co/api/people/1/")
    .subscribe( data =>
    {
      this.title = data['name'];
    })
  }
 
 
 
}