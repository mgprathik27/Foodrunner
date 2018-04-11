import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import { Globals } from '../../global';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers : [AuthenticationService]
})
export class NavbarComponent implements OnInit {
  constructor(private authenticationService : AuthenticationService,
  				private flashMessages : FlashMessagesService,
  				private router : Router, private globals : Globals
  				) { }

  ngOnInit() {
    this.setGlobals();
  }

  setGlobals(){
    console.log("comes here");
    if(this.authenticationService.loggedIn()){
      if(this.globals.admin == undefined || this.globals.admin == null){
        this.authenticationService.getProfile().subscribe(user =>{
          this.authenticationService.user = user.user;
          console.log(user.user.type);
          if(user.user.type == "A"){
            this.globals.admin = true;
            this.onLogin();
          }
          else{
            this.globals.admin = false;
          }      
        },
        err =>{
          console.log("not logged in "+err);
          this.flashMessages.show("User not logged in",{cssClass : "alert-danger", timeout: 1000});
          this.router.navigate(['']);
        })        
      }
      console.log("its coming here with" + this.globals.admin);
    }    
  }

  onLogoutClick(){
    this.globals.admin = null;
  	this.authenticationService.logout();
  	this.flashMessages.show("Successfully Logged Out ",{cssClass : "alert-success", timeout : 3000});
    $(".navbar").removeClass("bg-primary");
    $(".navbar").addClass("bg-success");
  	this.router.navigate(['/']);
  }

  onLogin(){
       $(".navbar").removeClass("bg-success");
       $(".navbar").addClass("bg-primary");
  }

}