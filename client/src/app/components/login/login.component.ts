import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Info} from '../../models/info';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthenticationService,NavbarComponent]
})
export class LoginComponent implements OnInit {
  email : string;
  password : string;
  info : Info;

  constructor(private authenticationService : AuthenticationService,
              private flashMessages : FlashMessagesService,
              private router : Router,
              private navbarComponent : NavbarComponent
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
    if(info.success == true){
      //get full user info
      this.authenticationService.storeUserData(info.user,info.token);
      this.authenticationService.getProfile().subscribe(user =>{
        this.authenticationService.storeUserData(user.user,info.token);
        if(user.user.type == "A"){
          this.navbarComponent.onLogin();
        }
        this.flashMessages.show("You are now logged in. Enjoy ordering", {cssClass : 'alert-success', timeout : 3000})
        this.router.navigate(['menu']);      
      },
      err =>{
        console.log("not looged in "+err);
        this.flashMessages.show("User not logged in",{cssClass : "alert-danger", timeout: 1000});
        this.router.navigate(['']);
      })
    }else{
      this.flashMessages.show("Log in Falied "+ info.message, {cssClass : 'alert-danger', timeout : 3000})
      this.router.navigate(['login']);
    }
  })
  }	


}
