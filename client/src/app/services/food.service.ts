import { Injectable } from '@angular/core';
import {Http, Headers, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FoodService {
food : String;

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

  getAvailableFood(fid){
    var url = 'http://localhost:3000/api/food/'+fid;
    console.log(url);
    return this.http.get(url)
      .map(res =>res.json());        
  }  

  addNewItem(newItem){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/food',newItem,{headers:headers})
      .map(res =>res.json());  
  }

  addToCart(fid,uid){
  	var headers = new Headers();
  	headers.append('Content-Type', 'application/json');
  	return this.http.post('http://localhost:3000/api/cart/'+ uid +'/'+ fid,{headers:headers})
  		.map(res =>res.json());  	
  }

  deleteItem(fid){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete('http://localhost:3000/api/food/'+ fid,{headers:headers})
      .map(res =>res.json());    
  }

  editItem(editedItem){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/api/food/'+ editedItem._id,editedItem,{headers:headers})
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
    console.log(uid);
    return this.http.get('http://localhost:3000/api/order/'+ uid)
      .map(res =>res.json());    
  }

  fetchImage(name){
    console.log(name);
    return this.http.get('http://localhost:3000/uploads/'+ name,{ responseType: ResponseContentType.Blob })
      .map((res) => res.blob())  
  }
}
