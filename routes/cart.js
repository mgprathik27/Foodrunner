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
		Cart.findById(user.cart).populate("foods.food").exec((err,carts)=>{
			console.log(carts+err);
			res.json(carts);
		});							
	})	
			
});
function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
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
					foods :[{food:fid, quantity: 1}]
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
				var flag = true;
				console.log(cartid);
				Cart.findById(cartid,(err,cart)=>{
					console.log(cart);
					cart.totalAmt = cart.totalAmt + food.price ;
					cart.totalAmt = precisionRound(cart.totalAmt,2);
					console.log(cart.totalAmt);
					cart.foods.forEach((food, idx,foods)=>{
						console.log(idx);
						if(food.food == fid){
							flag = false;
							console.log("incrementing");

							food.quantity = food.quantity +1;
							cart.save((err,resp)=>{
								if (err){
									console.log("something went wrong");
								res.json({ success: false, message: 'Could not add to cart'  + err});

								}else{
									res.json({ success: true, message: 'Added successfully to cart' });
								}						
							});							
						}else
						if(idx == foods.length-1 && flag == true){
							console.log("pushing");
							cart.foods.push({food: fid,quantity : 1});
							cart.save((err,resp)=>{
								if (err){
									console.log("something went wrong");
								res.json({ success: false, message: 'Could not add to cart'  + err});

								}else{
									res.json({ success: true, message: 'Added successfully to cart' });
								}						
							})							
						}
					})

				})

			}
		});
	});		
})

router.delete("/:uid",(req,res,next)=>{
	var uid = req.params.uid;
	User.findByIdAndUpdate(uid,{$set : {cart : null}},{new : true},(err,resp)=>{
		if (err){
				console.log("something went wrong "+err);
			res.json({ success: false, message: 'Could not delete'  + err});
		}else{
			res.json({ success: true, message: 'Successfully deleted cart' });

		}
	})
})


router.put("/:uid", (req,res,next)=>{
	console.log("In put for cart");
	console.log(req.body.foods);

	Cart.findByIdAndUpdate(req.body._id,{ $set: { totalAmt : req.body.totalAmt , foods : req.body.foods}}, { new: true },(err,resp)=>{
		if (err){
				console.log("something went wrong "+err);
			res.json({ success: false, message: 'Could not update'  + err});
		}else{
			res.json({ success: true, message: 'Successfully updated cart' });

		}
	})

})

module.exports = router;