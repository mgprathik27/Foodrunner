import { Injectable } from '@angular/core';
import {Router, CanActivate} from "@angular/router"
import {AuthenticationService} from '../services/authentication.service';
import {Globals} from '../global';


@Injectable()
export class AdminGuard implements CanActivate{

  constructor(private authenticationService : AuthenticationService,
              private router : Router, private globals : Globals
              ) { }

  canActivate(){
    console.log(this.globals.admin);
    if(this.authenticationService.loggedIn() && this.globals.admin){
      return true;
    }else{
      this.router.navigate(['/']);
      return false;
    }
  }

}
