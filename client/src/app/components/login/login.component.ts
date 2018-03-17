import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Info} from '../../models/info';
import {FlashMessagesService} from 'angular2-flash-messages'
import {Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthenticationService]
})
export class LoginComponent implements OnInit {
  email : string;
  password : string;
  info : Info;

  constructor(private authenticationService : AuthenticationService,
              private flashMessages : FlashMessagesService,
              private router : Router
              ) { }

  ngOnInit() {
  }

  login(){
  	const userInfo = {
  		email : this.email,
  		password : this.password
  	}  	
  	this.authenticationService.login(userInfo)
  		.subscribe(info => {
  			console.log("Hello there");
    if(info.success == true){
      this.authenticationService.storeUserData(info.user,info.token);

      this.flashMessages.show("You are now logged in. Enjoy ordering", {cssClass : 'alert-success', timeout : 3000})
      this.router.navigate(['menu']);
    }else{
      this.flashMessages.show("Log in Falied "+ info.message, {cssClass : 'alert-danger', timeout : 3000})
      this.router.navigate(['login']);
    }
  })
  }	


}
