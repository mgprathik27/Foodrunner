import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Info} from '../../models/info';
import {FlashMessagesService} from 'angular2-flash-messages'
import {Router} from '@angular/router';
import * as $ from 'jquery';

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
    if(this.email == undefined || this.email == null||this.email == "" 
        || this.password == undefined || this.password == null||this.password == "" 
        || this.name == undefined || this.name == null||this.name == "" ){
      if (this.name == undefined || this.name == null||this.name == "") {
        $("#nameDisp").append("<span class = 'text-primary '>User name field is mandaory</span>");
      }
      if (this.email == undefined || this.email == null||this.email == "") {
        $("#emailDisp").append("<span class = 'text-primary'>Email field is mandaory</span>");
      }
      if (this.password == undefined || this.password == null||this.password == "") {
        $("#passwordDisp").append("<span class = 'text-primary'>Password field is mandaory</span>");
      }            
    }else{

      const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
      if(this.password.length<8 || this.password.length >35)
        this.flashMessage.show("Password must be at least 8 characters but no more than 35", {cssClass : 'alert-danger', timeout : 3000})
      else
      if(regExp.test(this.password)) {
          console.log(this.email);
          const userInfo = {
            email : this.email,
            password : this.password,
            name : this.name,
            type : "N"
          }    
          console.log(userInfo.name);
          this.authenticationService.register(userInfo)
            .subscribe(info => {
              console.log("Hello there");
          if(info.success == true){
             this.authenticationService.sendmail(userInfo).subscribe(info => {
               if(info.success == true){
                  this.flashMessage.show("You are now registered. Verification mail has been sent to the email given. Please Verify.", {cssClass : 'alert-success', timeout : 3000})

               }
             })
             this.router.navigate(['/login']);
          }else{
             this.flashMessage.show(info.message, {cssClass : 'alert-danger', timeout : 3000})
              this.router.navigate(['/register']);
          }

        })
      }else{
        this.flashMessage.show("Valid password must have at least one uppercase, lowercase, special character, and number", {cssClass : 'alert-danger', timeout : 3000})
      }
    }

  }

  dispClear(){
    $("#nameDisp").empty();
    $("#emailDisp").empty();
    $("#passwordDisp").empty();
  }	


}
