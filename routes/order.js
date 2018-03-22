const express = require("express");
const router = express.Router();
var Cart = require("../models/cart");
var User = require("../models/user");
var Food = require("../models/food");
var Order = require("../models/order");

router.get("/",(req,res)=>{
	res.send("order route works");
});

router.get("/:uid",(req,res)=>{
	console.log("trying to get cart data");
	var prevOrders = [];
	User.findById(req.params.uid,(err,user)=>{
		user.order.forEach((order,idx)=>{
			Order.findById(order).populate("foods").exec((err,orders)=>{
				if (prevOrders.push(orders)){
				console.log(idx);
				if(prevOrders.length === user.order.length){
					res.json(prevOrders);
				}
			}
				
			});	
		});
	})	
});


router.post("/:uid",(req,res,next)=>{

	User.findById(req.params.uid,(err,user)=>{
		var cid = user.cart;	
		Cart.findById(cid,(err,cart)=>{
			let newOrder = new Order({
				email: cart.email,
				totalAmt: cart.totalAmt,
				foods : cart.foods
			});

			newOrder.save((err,resp)=>{
				if(err){
					console.log("something went wrong");
					res.json({ success: false, message: 'Could not add to cart'  + err });					
				}else{
					User.findByIdAndUpdate(req.params.uid,{ $push: { order : resp._id },$set: { cart : null }}, { new: true },(err,resp)=>{
						if(err){
							console.log("something went wrongs");
							res.json({ success: false, message: 'Could not add to cart'  + err });					
						}else{
							Cart.findByIdAndRemove(cid,(err,resp)=>{
								res.json({ success: true, message: 'Added successfully to Order' });
							})
						}						
					})
				}
			})

		})
	})
})

module.exports = router;