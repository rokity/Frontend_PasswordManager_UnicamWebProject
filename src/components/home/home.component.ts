import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    title = 'DominKey';
    server  = "http://localhost:8000/api/logout"

    constructor(private http : HttpClient) { 
    
    }
    logout()
    {
      fetch(
        this.server, {
          method: "GET",
          credentials: 'include',
        }).then( val =>
        {
          console.log(val);
        })
    }
  }