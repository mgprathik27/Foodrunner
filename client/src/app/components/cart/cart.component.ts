import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {FoodService} from '../../services/food.service';
import {Cart} from '../../models/cart';
import {Router} from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
 uid : string;
 cart : Cart;
 todayDate : Date;
 modalRef: BsModalRef;

  constructor(private foodService: FoodService,
  				private authenticationService: AuthenticationService,
  				private flashMessages : FlashMessagesService,
  				private modalService : BsModalService,
  				private router : Router) { }

  ngOnInit() {
  		  	this.authenticationService.getProfile().subscribe(user =>{
		      	console.log(user.user.email);
		  		this.uid = user.user._id;
		  		this.foodService.getCart(this.uid).subscribe(cart=>{
		  			this.cart = cart;
		  			console.log(this.cart);
		  		})

	  	},
	  	err =>{
	  		console.log("Error in cart "+err);
	  		this.flashMessages.show("Failed to retreive cart",{cssClass : "alert-danger", timeout: 1000});
	  	})
  }


  deleteCart(fid){
		var newAmount =0;
		var cartFoods = [];
		var deleteIdx;
		console.log(this.cart.foods.length);
		this.cart.foods.forEach((food, idx)=>{
			console.log(food._id);
			console.log(fid);

			if(food._id == fid){
				deleteIdx = idx;
			}else{
				newAmount = this.precisionRound(newAmount + this.precisionRound(food.quantity*food.food.price,2),2);
				var foods  = {quantity : food.quantity, _id : food._id, food : food.food._id};
				cartFoods.push(foods);				
			}
		});
		this.cart.foods.splice(deleteIdx,1);

		console.log(cartFoods);
		this.cart.totalAmt = newAmount;
		var cart = {_id : this.cart._id, email : this.cart.email, foods : cartFoods, totalAmt : newAmount};
		if(cartFoods.length == 0){
			this.foodService.deleteCart(this.uid).subscribe(info=>{
		  			if (info.success){
		  				console.log(info.message);

		  				this.flashMessages.show("Successfully deleted from cart",{cssClass : "alert-success", timeout: 1000});

		  			}else{
		  				this.flashMessages.show("Failed to delete from cart",{cssClass : "alert-danger", timeout: 2500});
		  			}  		
	  		},
		  	err =>{
		  		console.log("Failed to delete from cart "+err);
		  		this.flashMessages.show("Failed to delete cart",{cssClass : "alert-danger", timeout: 2500});
		  	})
		}else{
			this.foodService.updateCart(cart,this.uid).subscribe(info=>{
		  			if (info.success){
		  				console.log(info.message);

		  				this.flashMessages.show("Successfully deleted from cart",{cssClass : "alert-success", timeout: 1000});
		  			}else{
		  				this.flashMessages.show("Failed to delete from cart",{cssClass : "alert-danger", timeout: 2500});
		  			}  		
	  		},
		  	err =>{
		  		console.log("Failed to delete from cart "+err);
		  		this.flashMessages.show("Failed to delete cart",{cssClass : "alert-danger", timeout: 2500});
		  	})
	  	}	
	}

	precisionRound(number, precision) {
	  var factor = Math.pow(10, precision);
	  return Math.round(number * factor) / factor;
	}


	onChange(fid){
		var newAmount =0;
		var cartFoods = [];
		console.log("here1");
		this.cart.foods.forEach((food)=>{
			if(food.quantity == null)
				food.quantity = 1;
			console.log("food.quantity "+this.precisionRound(food.quantity*food.food.price,2));
			console.log("food.food.price "+food.food.price);
			newAmount = this.precisionRound(newAmount + (this.precisionRound(food.quantity*food.food.price,2)),2);
			console.log("newAmount "+newAmount);
			var foods  = {quantity : food.quantity, _id : food._id, food : food.food._id};
			cartFoods.push(foods);
		});
		console.log(cartFoods);
		this.cart.totalAmt = newAmount;
		var cart = {_id : this.cart._id, email : this.cart.email, foods : cartFoods, totalAmt : newAmount};

		this.foodService.updateCart(cart,this.uid).subscribe(info=>{
	  			if (info.success){
	  				console.log(info.message);
	  				this.flashMessages.show("Successfully updated cart",{cssClass : "alert-success", timeout: 500});
	  			}else{
	  				this.flashMessages.show("Failed to update cart",{cssClass : "alert-danger", timeout: 500});
	  			}  		
  	},
	  	err =>{
	  		console.log("Failed to update cart "+err);
	  		this.flashMessages.show("Failed to update cart",{cssClass : "alert-danger", timeout: 1000});
	  	})
	}

	confirmOrder(){

		var count=0;
		this.cart.foods.forEach((foods)=>{
			this.foodService.getAvailableFood(foods.food._id).subscribe(info=>{
				if(info.success == false){
		  			this.flashMessages.show(foods.food.name + " is not available anymore. Please delete it from cart",{cssClass : "alert-danger", timeout: 3000});
		  			return false;
				}else {
					count++;
					if(count == this.cart.foods.length){
						console.log("adasd");
						this.foodService.confirmOrder(this.uid).subscribe(info=>{
					  			if (info.success){
					  				console.log(info.message);
					  				this.cart = null;
					  				this.modalRef.hide();
					  				this.flashMessages.show("Ordered Successfully",{cssClass : "alert-success", timeout: 2500});
					  				this.router.navigate(['/menu']);
					  			}else{
					  				this.flashMessages.show("Failed to order",{cssClass : "alert-danger", timeout: 2500});
					  			}  		
				  		},
					  	err =>{
					  		console.log("Failed to order "+err);
					  		this.flashMessages.show("Failed to order",{cssClass : "alert-danger", timeout: 2500});
					  	})						
					}
				}
			})			
		})
	}

	incQuantity(fid){
		console.log(fid);
		var idx = this.cart.foods.findIndex(x => x._id == fid);
		console.log(idx);
		this.cart.foods[idx].quantity++;
		console.log(idx+this.cart.foods[idx].quantity);
		this.onChange(fid)
	}
	decQuantity(fid){
		var idx = this.cart.foods.findIndex(x => x._id == fid);
		if(this.cart.foods[idx].quantity!=1){
			this.cart.foods[idx].quantity--;
		}else{
			return;
		}
		console.log(idx+this.cart.foods[idx].quantity);
		this.onChange(fid)
	}

	showConfirmOrder(template){
		this.todayDate = new Date();
		this.modalRef = this.modalService.show(template);
	}

}
