const express = require("express");
const router = express.Router();
var User = require("../models/user");

router.get("/",(req,res)=>{
	res.send("user route works");
});

//retrieve data
router.post("/login",(req,res,next)=>{
	console.log("trying to login");
	User.findOne({email : req.body.email},(err,user)=>{
		console.log(user);
		var password = req.body.password;
		console.log(password);
		//console.log(user.comparePassword(password));
		if(user.comparePassword(password)){
			res.json({ success: true, message: 'Password valid' });
		}else{
			res.json({ success: false, message: 'Password invalid' });
		}
		//res.json(user);
	});
})

//add User
router.post("/register",(req,res,next)=>{
	console.log("hedfgrer");
	let newUser = new User({
		email: req.body.email,
		password: req.body.password
	});
	User.findOne({email : req.body.email},(err,user)=>{
		if(user == null){
			console.log("going to register");
			newUser.save((err,user)=>{
				if(err){
					res.json({ success: false, message: 'Could not register' });
				}
				else{
					res.json({ success: true, message: 'registered successfully' });
				}
			});			
		}
		else{
			res.json({ success: false, message: 'email already registered' });
		}

	});	
})

module.exports = router;