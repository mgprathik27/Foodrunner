import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service'
import {FlashMessagesService} from 'angular2-flash-messages'
import {Router} from '@angular/router'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers : [AuthenticationService]
})
export class NavbarComponent implements OnInit {

  constructor(private authenticationService : AuthenticationService,
  				private flashMessages : FlashMessagesService,
  				private router : Router
  				) { }

  ngOnInit() {
  }

  onLogoutClick(){
  	this.authenticationService.logout();
  	this.flashMessages.show("Successfully Logged Out ",{cssClass : "alert-success", timeout : 3000});
  	this.router.navigate(['/']);
  }

}
