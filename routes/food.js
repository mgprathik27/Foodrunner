const express = require("express");
const router = express.Router();
var Food = require("../models/food");

router.get("/",(req,res)=>{
	res.send("food route works");
});

router.get("/:type/:q",(req,res)=>{
	console.log("trying to get foods data");
	var q;
	if(req.params.q=="all"){
		q="";
	}else{
		q=req.params.q.toLowerCase();
	}

	if(req.params.type == "all"){
		Food.find({name: new RegExp(q, "i")},(err,foods)=>{
			console.log(foods+err);
			res.json(foods);
		});				
	}else{
		Food.find({type  : req.params.type.toLowerCase(), name: new RegExp(q, "i"), available : "Y"},(err,foods)=>{
			console.log(foods + err);
			res.json(foods);
		});				
	}
});

router.post("/",(req,res,next)=>{
	let newFood = new Food({
		name: req.body.name.toLowerCase(),
		type: req.body.type.toLowerCase(),
		price: req.body.price,
		available: "Y"	,
		image : req.body.image	
	});
	console.log("going to add "+newFood);
	Food.findOne({name : req.body.name},(err,food)=>{
		if(food == null){
			newFood.save((err,food)=>{
				if(err){
					res.json({ success: false, message: 'Could not add' });
				}
				else{
					res.json({ success: true, message: 'Added successfully' });
				}
			});			
		}
		else{
			if(food.available == "N"){
				Food.findByIdAndUpdate(food._id,{ $set: { available : "Y" , price : req.body.price, type : req.body.type.toLowerCase()}}, { new: true },(err,resp)=>{
					if (err){
							console.log("something went wrong "+err);
							res.json({ success: false, message: 'Could not delete from cart'  + err});
					}else{
							res.json({ success: true, message: 'Successfully added food' });

					}
				})				
			}else{
				res.json({ success: false, message: 'Food already available' });
			}
		}

	});
})

router.delete("/:fid",(req,res,next)=>{
	var fid = req.params.fid;
	Food.findByIdAndUpdate(fid,{ $set: { available : "N" }}, { new: true },(err,resp)=>{
		if (err){
				console.log("something went wrong "+err);
			res.json({ success: false, message: 'Could not delete food'  + err});
		}else{
			res.json({ success: true, message: 'Successfully Deleted food' });

		}
	})	
})

module.exports = router;