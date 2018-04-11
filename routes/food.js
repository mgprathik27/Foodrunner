const express = require("express");
const router = express.Router();
var Food = require("../models/food");

router.get("/",(req,res)=>{
	res.send("food route works");
});

router.get("/:fid",(req,res)=>{
	Food.findById(req.params.fid,(err,food)=>{
		if(food == null){
			res.json({ success: false, food : req.params.fid, message: 'Food not available' });
		}else
		if(food.available == "N"){
			res.json({ success: false, food : req.params.fid, message: 'Food not available' });
		}else {
			res.json({ success: true, food : food, message: 'Food available' });
		}
	});				
	
});

router.put("/:fid",(req,res)=>{
	console.log("adsdaaqweqwe");
	var fid = req.params.fid;
	Food.findByIdAndUpdate(fid,{ $set: {name : req.body.name, type : req.body.type,
		price : req.body.price, image : req.body.image }}, { new: true },(err,resp)=>{
		if (err){
				console.log("something went wrong "+err);
			res.json({ success: false, message: 'Could not update food'  + err});
		}else{
			console.log("Successfully Updated food");
			res.json({ success: true, message: 'Successfully update food' });

		}
	})			
	
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
	var imagename = null;
	if(req.body.image == null)
		imagename = "7645c6effb10cb82cd152ee3c06b543d";
	else
		imagename = req.body.image;

	let newFood = new Food({
		name: req.body.name.toLowerCase(),
		type: req.body.type.toLowerCase(),
		price: req.body.price,
		available: "Y"	,
		image : imagename	
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