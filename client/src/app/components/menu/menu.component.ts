import { Component, OnInit } from '@angular/core';
import {FoodService} from '../../services/food.service';
import {AuthenticationService} from '../../services/authentication.service';
import {FlashMessagesService} from 'angular2-flash-messages'
import {Food} from '../../models/food';
import { Globals } from '../../global';
import * as $ from 'jquery';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  q    :string;
  type : string;
  foods : Food[];
  curPagefoods : Food[];
  curPage : number;
  pageLength :number;
  uid : string;
  imageToShow: any;
  isImageLoading : boolean;
  totalPages : number;



  constructor(private foodService: FoodService,
  				private authenticationService: AuthenticationService,
  				private flashMessages : FlashMessagesService, private globals : Globals
  				) { }

	ngOnInit() {
		this.type = null;
		this.q = "";
		this.pageLength =8;
		console.log("here");
	    this.fetchFoods();
	    console.log(this.foods);

	  }

	fetchFoods(){
		var q = this.q;
		if(this.q == ""){
			q = "all";
		}
		  var loopIdx = 0;
		  		console.log("q "+ this.q + " type "+ this.type);

		  this.foodService.getFoods(this.type,q).subscribe(foods =>{
		  	this.foods = [];
		  	console.log("before "+ foods);
		  	console.log("before " +this.foods);
		  	if(foods ==""){
			  	console.log("inside "+ foods);
			  	this.foods =null;
			  	$(".pagination").empty();


		  	}
		  	foods.forEach((food,idx) =>{

		  		var newFood = {
		  			_id		: food._id,
				  name		: food.name,
				  type		: food.type,
				  price		: food.price,
				  available	: food.available,
				  image : null
				}  
						  	console.log("after");

		      	//this.isImageLoading = true;
		      	this.foodService.fetchImage(food.image).subscribe(data => {
			       let reader = new FileReader();
			       reader.addEventListener("load", () => {
			          newFood.image = reader.result;
			       }, false);

			       if (data) {
			          reader.readAsDataURL(data);
			       }
		        	//this.isImageLoading = false;
		      }, error => {
		       // this.isImageLoading = false;
		        console.log(error);
		      });
		      this.foods.push(newFood);	
		      loopIdx = idx;
		      var parent = this;
			  if(loopIdx == foods.length-1){
				this.getFoodsPage(1); 	
 				this.buildPagination();
		  	}
		  	})
		  	
		})

	}

	getFoodsPage(pageNum){
		$(".page-item").removeClass("active");

		switch(pageNum){
			case 1 : {
				$("#1").parent().addClass("active");
				break;
			}
			case 2 : {
				$("#2").parent().addClass("active");
				break;
			}
			case 3 : {
				$("#3").parent().addClass("active");
				break;
			}
			case 4 : {
				$("#4").parent().addClass("active");
				break;
			}
			case 5 : {
				$("#5").parent().addClass("active");
				break;
			}												
		}

		this.curPage = pageNum;
		this.curPagefoods = [];
		for(var i = (pageNum-1)*this.pageLength; i<pageNum*this.pageLength && i<this.foods.length ;i++){
			console.log("in loop "+i);
			this.curPagefoods.push(this.foods[i]);
		}

	}

	buildPagination(){
		var parent = this;
		this.totalPages = Math.ceil(this.foods.length / this.pageLength);
		$(".pagination").empty();
		$(".pagination").append('<li _ngcontent-c2 class="page-item "><a _ngcontent-c2 class="page-link" id = "prevPage" (click) = "prevPage()">&laquo;</a></li>');
			$("#prevPage").click(function(event){
				parent.prevPage();
			});					
		for(var i=1;i<=this.totalPages;i++){
			if(i==1){
				$(".pagination").append('<li _ngcontent-c2 class="page-item active"><a _ngcontent-c2 class="page-link" id = "'+i+'" >'+i+'</a></li>'); 
			}else{
				$(".pagination").append('<li _ngcontent-c2 class="page-item "><a _ngcontent-c2 class="page-link" id = "'+i+'" >'+i+'</a></li>'); 
			}
			$("#"+i).click(function(event){
				parent.getFoodsPage(parseInt(event.currentTarget.id));
			});
		}	
		$(".pagination").append('<li _ngcontent-c2 class="page-item"><a _ngcontent-c2 class="page-link" id = "nextPage" (click) = "nextPage()">&raquo;</a></li>');
			$("#nextPage").click(function(event){
				parent.nextPage();
			});	
	}

	prevPage(){
		if(this.curPage == 1){
			return;
		}else{
			this.getFoodsPage(this.curPage-1);
		}
	}
	nextPage(){
		if(this.curPage == this.totalPages){
			return;
		}
		else{
			this.getFoodsPage(this.curPage+1);
		}
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

	deleteItem(fid){
		this.foodService.deleteItem(fid).subscribe(info=>{
			if (info.success){
				console.log(info.message);
				var foodIdx =null;
				this.foods.forEach((food,idx) =>{
					if(food._id == fid){
						foodIdx = idx;
					}
				})
				this.foods.splice(foodIdx,1);
				console.log(this.foods);
				this.totalPages = Math.ceil(this.foods.length / this.pageLength);
				if(this.totalPages==0){
					this.getFoodsPage(1);
				}else
				if ( this.curPage > this.totalPages){
					this.getFoodsPage(this.curPage-1);
				}else{
					this.getFoodsPage(this.curPage);
				}
				this.buildPagination();
				this.flashMessages.show("Successfully deleted Item",{cssClass : "alert-success", timeout: 1000});
			}else{
				this.flashMessages.show("Failed to delete Item",{cssClass : "alert-danger", timeout: 1000});

			}
		})
	}	



  }





