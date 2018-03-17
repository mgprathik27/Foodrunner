import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FoodService {

  constructor(private http : Http) { }

  getFoods(type, q){
  	if(q == null){
  		q = 'all';
  	}
  	if (type == null) {
  		type = 'all';
  	}
  	var url = 'http://localhost:3000/api/food/'+type+'/'+q;
  	console.log(url);
  	return this.http.get(url)
  		.map(res =>res.json());  	  	
  }

  addFood(food){

  }

  addToCart(fid,uid){
  	var headers = new Headers();
  	headers.append('Content-Type', 'application/json');
  	return this.http.post('http://localhost:3000/api/cart/'+ uid +'/'+ fid,{headers:headers})
  		.map(res =>res.json());  	
  }

  getCart(uid){
  	return this.http.get('http://localhost:3000/api/cart/'+ uid)
  		.map(res =>res.json());
  }

  deleteCart(uid){
  	var headers = new Headers();
  	headers.append('Content-Type', 'application/json');
  	return this.http.delete('http://localhost:3000/api/cart/'+ uid,{headers:headers})
  		.map(res =>res.json());  	
  }

  updateCart(cart,uid){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("sending updatecart request ");
    console.log(cart);

    return this.http.put('http://localhost:3000/api/cart/'+ uid , JSON.stringify(cart),{headers:headers})
      .map(res =>res.json());    
  }

  confirmOrder(uid){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/order/'+ uid,{headers:headers})
      .map(res =>res.json());    
  }  

  getHistory(uid){
    return this.http.get('http://localhost:3000/api/order/'+ uid)
      .map(res =>res.json());    
  }

}
