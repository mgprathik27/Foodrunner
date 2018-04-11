import { Component, OnInit } from '@angular/core';
import {FoodService} from '../../services/food.service'
import {Food} from '../../models/food'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router,ActivatedRoute} from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.css']
})
export class EditFoodComponent implements OnInit {

 image : any;
  food : Food;
  name : string;
  type : string;
  price : number;
  fid : string;
  modalRef: BsModalRef;


  constructor(private foodService : FoodService ,
               private flashMessages : FlashMessagesService,
               private router : Router, 
               private route : ActivatedRoute,
               private modalService : BsModalService) { }

	ngOnInit() {
		this.route.params.subscribe(params =>{
			console.log(params['id']);
			this.fid = params['id'];
			this.foodService.getAvailableFood(this.fid).subscribe(info=>{
				this.food = info.food;
		      	this.foodService.fetchImage(info.food.image).subscribe(data => {
			       let reader = new FileReader();
			       reader.addEventListener("load", () => {
			          this.image = reader.result;
			       }, false);

			       if (data) {
			          reader.readAsDataURL(data);
			       }
		      }, error => {
		        console.log(error);
		      });				
			})
		});

	}

	onUploadFinished(event)  {
		this.food.image = JSON.parse(event.serverResponse._body).filename;
	}

	showDelete(template) {
		this.modalRef = this.modalService.show(template);
	} 

	deleteItem(){
			this.foodService.deleteItem(this.food._id).subscribe(info=>{
				if(info.success == true){
					this.modalRef.hide();	
					this.flashMessages.show("Successfully deleted Item ",{cssClass : "alert-success", timeout: 2000});
					this.router.navigate(['/menu']);		
				}else{
					this.flashMessages.show("Something went wrong",{cssClass : "alert-danger", timeout: 2000});
				}
			})
	}

	editItem(){
			this.foodService.editItem(this.food).subscribe(info=>{
				if(info.success == true){
					this.flashMessages.show("Successfully Updated Item ",{cssClass : "alert-success", timeout: 2000});
					this.router.navigate(['/menu']);		
				}else{
					this.flashMessages.show("Something went wrong",{cssClass : "alert-danger", timeout: 2000});
				}
			})		
	}

}
