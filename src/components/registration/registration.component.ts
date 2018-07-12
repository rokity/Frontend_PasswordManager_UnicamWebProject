import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'registration-component',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent  {
  email : String ;
  name : String;
  surname : String;
  masterkey : String ;
  
  server  = "http://localhost:8000/api/registation"

  constructor(private http : HttpClient,private router: Router) { 
    if(localStorage.getItem('token')!=null)
      this.router.navigate(['/']);
  }
  registration()
  {
     this.http.post(this.server,{name: this.name, surname: this.surname, email:this.email, masterkey:this.masterkey})
     .subscribe( data =>
       {
        if(data['logged'])
        {
          localStorage.setItem('token',data['token'])
          this.router.navigate(['/']);
        }         
       else
         {
           alert("Parametri non validi");
           this.name=null;
           this.surname=null;
           this.email = null;
           this.masterkey = null;
         }
       })
    
  }
 
 
 
}