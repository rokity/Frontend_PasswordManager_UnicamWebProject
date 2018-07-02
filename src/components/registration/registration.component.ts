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
  
  server  = "http://localhost:3000/api/registration"

  constructor(private http : HttpClient,private router: Router) { 
    
  }
  registration()
  {
    // this.http.post(this.server,{email:this.email,masterkey:this.masterkey})
    // .subscribe( data =>
    //   {
    //    if(data.logged)
    //     this.router.navigate(['/']);
    //   else
    //     {
    //       alert("Parametri non validi");
    //       this.email = null;
    //       this.masterkey = null;
    //     }
    //   })
    
  }
 
 
 
}