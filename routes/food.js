const express = require("express");
const router = express.Router();
var Food = require("../models/food");

router.get("/",(req,res)=>{
	res.send("food route works");
});

router.get("/:fid",(req,res)=>{
	console.log("asdasd");
	Food.findById(req.params.fid,(err,food)=>{
		if(food == null){
			res.json({ success: false, food : req.params.fid, message: 'Food not available' });
		}else
		if(food.available == "N"){
			res.json({ success: false, food : req.params.fid, message: 'Food not available' });
		}else {
			res.json({ success: true, food : req.params.fid, message: 'Food available' });
		}
	});				
	
});

router.get("/:type/:q",(req,res)=>{
	console.log("trying to get foods data for type "+ req.params.type+ " q " + req.params.q);
	var q;
	if(req.params.q=="all"){
		q="";
	}else{
		q=req.params.q.toLowerCase();
	}

	if(req.params.type == "all"){
		Food.find({name: new RegExp(q, "i"), available : "Y"},(err,foods)=>{
			console.log(foods+err);
			res.json(foods);
		});				
	}else{
		Food.find({type  : req.params.type.toLowerCase(), name: new RegExp(q, "i"), available : "Y"},(err,foods)=>{
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
				Food.findByIdAndUpdate(food._id,{ $set: { available : "Y" , price : req.body.price, type : req.body.type.toLowerCase(),image : req.body.image}}, { new: true },(err,resp)=>{
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
			console.log("Successfully Deleted food");
			res.json({ success: true, message: 'Successfully Deleted food' });

		}
	})	
})

module.exports = router;