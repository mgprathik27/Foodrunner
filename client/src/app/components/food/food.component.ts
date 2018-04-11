import { Component, OnInit } from '@angular/core';
import {FoodService} from '../../services/food.service'
import {Food} from '../../models/food'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router'


@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css'],
  providers : [FoodService]
})
export class FoodComponent implements OnInit {
  image : string;
  food : Food;
  name : string;
  type : string;
  price : number;

  constructor(private foodService : FoodService ,
               private flashMessages : FlashMessagesService,
               private router : Router) { }

  ngOnInit() {
  
  }
  addNewItem(){
  	  	  console.log("Here");
    console.log(this.image) ;
    if (this.image == undefined)      
      this.image = null;
  	var newItem = {
  		name : this.name,
  		type : this.type,
  		price : this.price,
  		image : this.image
  	};
  	 console.log(newItem);
  	  this.foodService.addNewItem(newItem).subscribe(info=>{
  			if (info.success){
	  				console.log(info.message);
	  				this.flashMessages.show("Successfully added to cart",{cssClass : "alert-success", timeout: 500});
            this.router.navigate(['/menu']);
	  			}else{
	  				this.flashMessages.show("Failed to add item "+ info.message ,{cssClass : "alert-danger", timeout: 500});

	  			}
  	   })


  }

	onUploadFinished(event)  {
		this.image = JSON.parse(event.serverResponse._body).filename;
	}
}
