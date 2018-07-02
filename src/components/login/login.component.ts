import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',

})
export class LoginComponent  {
  email : String ;
  masterkey : String ;
  
  server  = "http://localhost:3000/api/login"

  constructor(private http : HttpClient,private router: Router) { 
    
  }
  login()
  {
    this.http.post(this.server,{email:this.email,masterkey:this.masterkey})
    .subscribe( data =>
      {
       if(data['logged'])
        this.router.navigate(['/']);
      else
        {
          alert("Parametri non validi");
          this.email = null;
          this.masterkey = null;
        }
      })
    
  }
 
 
 
}