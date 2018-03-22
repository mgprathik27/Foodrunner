import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {FoodService} from '../../services/food.service';
import {FlashMessagesService} from 'angular2-flash-messages'
import {Router} from '@angular/router'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers : [AuthenticationService, FoodService]
})

export class ProfileComponent implements OnInit {
	user : Object;
  uid : string;
  history : Object;
  constructor(private authenticationService : AuthenticationService,
          private foodservice : FoodService,
  				private flashMessages : FlashMessagesService,
  				private router : Router
  				) { }

  ngOnInit() {
  	this.authenticationService.getProfile().subscribe(user =>{
      this.uid = user.user._id;
  		this.user = user.user;
      this.foodservice.getHistory(this.uid).subscribe(history =>{
        this.history = history;
        console.log(history);
    })      
  	},
  	err =>{
  		console.log("not looged in "+err);
  		this.flashMessages.show("User not logged in",{cssClass : "alert-danger", timeout: 1000});
      this.router.navigate(['']);
  	})


  }



}
