import { Component, OnInit,TemplateRef  } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {FoodService} from '../../services/food.service';
import {FlashMessagesService} from 'angular2-flash-messages'
import {Router} from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {Order} from '../../models/order';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers : [AuthenticationService, FoodService,DatePipe]
})

export class ProfileComponent implements OnInit {
	user : Object;
  uid : string;
  history : [Order];
  modalError: string;
  modalRef: BsModalRef;
  selectedOrder: Order;


  constructor(private authenticationService : AuthenticationService,
          private foodservice : FoodService,
  				private flashMessages : FlashMessagesService,
  				private router : Router,
          private modalService: BsModalService
  				) { }

  ngOnInit() {
  	this.authenticationService.getProfile().subscribe(user =>{
      this.uid = user.user._id;
  		this.user = user.user;
      this.foodservice.getHistory(this.uid).subscribe(history =>{
        console.log(history);
        var temp = history;
        temp.sort(function(a,b){
          if(a.orderDate > b.orderDate)
            return -1;
          else if(a.orderDate < b.orderDate)
                  return 1;
          else
            return 0;
          
        })
        this.history = temp;
        console.log(history);
    })      
  	},
  	err =>{
  		console.log("not looged in "+err);
  		this.flashMessages.show("User not logged in",{cssClass : "alert-danger", timeout: 1000});
      this.router.navigate(['']);
  	})
  }

  showOrders(template, orderId) {
    this.history.forEach((order)=>{
      if(order._id == orderId){
        this.selectedOrder = order;
      }
    });
    this.modalRef = this.modalService.show(template);
  }    


  }


