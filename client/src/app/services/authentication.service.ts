import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
//import {Contact} from './contact';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { Globals } from '../global';


@Injectable()
export class AuthenticationService {

  authToken : any;
  user : any;
  constructor(private http: Http, private globals : Globals) { }

  login(userInfo){
  	var headers = new Headers();
  	headers.append('Content-Type', 'application/json');
  	return this.http.post('http://localhost:3000/api/user/login',userInfo,{headers:headers})
  		.map(res =>res.json());
  }

  sendmail(userInfo){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/user/sendmail',userInfo,{headers:headers})
      .map(res =>res.json());
  }  

  register(userInfo){
  	var headers = new Headers();
    console.log(userInfo.name);
  	headers.append('Content-Type', 'application/json');
  	return this.http.post('http://localhost:3000/api/user/register',userInfo,{headers:headers})
  		.map(res =>res.json());
  }  

  storeUserData(user, token){
   localStorage.setItem('id_token',token);
   localStorage.setItem('user',JSON.stringify(user));
  	this.authToken = token;
  	this.user = user;
    if(user.type == "A"){
      this.globals.admin = true;
    }
    else{
      this.globals.admin = false;
    }    
  }

  logout(){
  	this.authToken = null;
  	this.user = null;
  	localStorage.clear();
    this.globals.admin = null;
  }

  getProfile(){
  	var headers = new Headers();
  	this.loadToken();
    this.authToken = "Bearer "+ this.authToken;
  	headers.append("Authorization", this.authToken);
  	headers.append('Content-Type', 'application/json');
  	return this.http.get('http://localhost:3000/api/user/profile',{headers:headers})
  		.map(res =>res.json());  	
  }

  loadToken(){
  	this.authToken = localStorage.getItem("id_token");
  }

  loggedIn(){
    return tokenNotExpired("id_token");
  }

}
