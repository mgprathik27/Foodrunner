const express = require("express");
const router = express.Router();
var Cart = require("../models/cart");
var User = require("../models/user");
var Food = require("../models/food");

router.get("/",(req,res)=>{
	res.send("cart route works");
});

router.get("/:uid",(req,res)=>{
	console.log("trying to get cart data");
	User.findById(req.params.uid,(err,user)=>{
		Cart.findById(user.cart).populate("foods").exec((err,carts)=>{
			console.log(carts+err);
			res.json(carts);
		});							
	})	
			
});

router.post("/:uid/:fid",(req,res,next)=>{

	User.findById(req.params.uid,(err,user)=>{
		console.log(user+err);
		var fid = req.params.fid;
				console.log(fid);

		Food.findById(req.params.fid,(err,food)=>{
			console.log("user.cart " + user.cart);
			if (user.cart == undefined || user.cart == null){
				let newCart = new Cart({
					email: user.email.toLowerCase(),
					totalAmt: food.price,
					foods :[fid]
				});

				newCart.save((err,resp)=>{
					if (err){
						console.log("something went wrong" + err);
						res.json({ success: false, message: 'Could not add to cart ' + err });
					}
					var cid = resp._id;	
					User.findByIdAndUpdate(req.params.uid,{ $set: { cart : cid }}, { new: true },(err,resp)=>{
						if (err){
							console.log("something went wrong");
							res.json({ success: false, message: 'Could not add to cart'  + err });

						}else{
							res.json({ success: true, message: 'Added successfully to cart' });
						}
					});									
				});
			}else{
				var cartid = user.cart;
				console.log(cartid);
				Cart.findById(cartid,(err,cart)=>{
					console.log(cart);
					cart.totalAmt = cart.totalAmt + food.price ;
					cart.foods.push(food._id);
					cart.save((err,resp)=>{
						if (err){
							console.log("something went wrong");
						res.json({ success: false, message: 'Could not add to cart'  + err});

						}else{
							res.json({ success: true, message: 'Added successfully to cart' });
						}						
					})
				})

			}
		});
	});		
})

router.delete("/:uid/:fid",(req,res,next)=>{
	var uid = req.params.uid;
	var fid = req.params.fid;

	User.findById(uid,(err,user)=>{
		var cid = user.cart;
			Food.findById(fid,(err,food)=>{
				Cart.findById(cid,(err,cart)=>{
					var cartAmt = cart.totalAmt - food.price;
					if (cartAmt ==0){
						Cart.findByIdAndRemove(cid,(err,resp)=>{
							if (err){
								console.log("something went wrong "+err);
								res.json({ success: false, message: 'Could not delete from cart'  + err});
							}else{
								User.findByIdAndUpdate(uid,{ $set: { cart : null }}, { new: true },(err,resp)=>{
									if (err){
											console.log("something went wrong "+err);
										res.json({ success: false, message: 'Could not delete from cart'  + err});
									}else{
										res.json({ success: true, message: 'Successfully Deleted from cart' });

									}
								})								
							}							
						})
					}else{
						Cart.findByIdAndUpdate(cid,{ $set: { totalAmt : cartAmt },$pull: { foods : fid }}, { new: true },(err,resp)=>{
							if (err){
									console.log("something went wrong "+err);
								res.json({ success: false, message: 'Could not delete from cart'  + err});
							}else{
								res.json({ success: true, message: 'Successfully Deleted from cart' });

							}
						})	
					}				
				})
							
	})

})
})


module.exports = router;