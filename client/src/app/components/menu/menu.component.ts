import { Component, OnInit } from '@angular/core';
import {FoodService} from '../../services/food.service';
import {AuthenticationService} from '../../services/authentication.service';
import {FlashMessagesService} from 'angular2-flash-messages'
import {Food} from '../../models/food';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  q    :string;
  type : string;
  foods : Food[];
  uid : string;

  constructor(private foodService: FoodService,
  				private authenticationService: AuthenticationService,
  				private flashMessages : FlashMessagesService
  				) { }

	ngOnInit() {

	  this.foodService.getFoods("all","all").subscribe(foods =>{
	  	this.foods = foods;
	  	console.log(this.foods);
	  })

	  }

	fetchFoods(){
		console.log(this.type + " "+this.q);
		var q = this.q;
		if(this.q == ""){
			q = "all";
		}
		  this.foodService.getFoods(this.type,q).subscribe(foods =>{
		  	this.foods = foods;
		})  	
	}

	addToCart(fid){
		console.log("clicked cart" + fid);
	  	this.authenticationService.getProfile().subscribe(user =>{
	      console.log(user.user.email);
	  		this.uid = user.user._id;
	  		console.log("clicked cart " +fid +"for user "+this.uid);
	  		this.foodService.addToCart(fid,this.uid).subscribe(info=>{
	  			if (info.success){
	  				console.log(info.message);
	  				this.flashMessages.show("Successfully added to cart",{cssClass : "alert-success", timeout: 500});
	  			}else{
	  				this.flashMessages.show("Failed to insert to cart",{cssClass : "alert-danger", timeout: 500});

	  			}
	  		})

	  	},
	  	err =>{
	  		console.log("not looged in "+err);
	  		this.flashMessages.show("Failed to insert to cart",{cssClass : "alert-danger", timeout: 1000});
	  	})		
	}
  }




