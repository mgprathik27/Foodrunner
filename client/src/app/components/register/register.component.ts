import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Info} from '../../models/info';
import {FlashMessagesService} from 'angular2-flash-messages'
import {Router} from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers : [AuthenticationService ]
})
export class RegisterComponent implements OnInit {
  email : string;
  password : string;
  name : string;
  info : Info;

  constructor(
  	private authenticationService : AuthenticationService, 
  	private flashMessage : FlashMessagesService,
  	private router : Router
  	) { }

  ngOnInit() {
    
  }

  register(){
  	const userInfo = {
  		email : this.email,
  		password : this.password,
      name : this.name
  	}  	
    console.log(userInfo.name);
  	this.authenticationService.register(userInfo)
  		.subscribe(info => {
  			console.log("Hello there");
  	if(info.success == true){
  		 this.flashMessage.show("You are now registered. Please log in", {cssClass : 'alert-success', timeout : 3000})
  		 this.router.navigate(['/login']);
  	}else{
  		 this.flashMessage.show(info.message, {cssClass : 'alert-danger', timeout : 3000})
  		  this.router.navigate(['/register']);
  	}

  })
  }	


}
