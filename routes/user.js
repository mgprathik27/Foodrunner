const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
var User = require("../models/user");
var config = require("../config/database");

router.get("/",(req,res)=>{
	res.send("user route works");
});

//retrieve data
router.post("/login",(req,res,next)=>{
	console.log("trying to login");
	User.findOne({email : req.body.email},(err,user)=>{
		console.log("user "+user);
		if(user == null){
			console.log("user "+user);
			console.log("user does not exist");
			res.json({ success: false, message: 'User does not exist. Please register' });

		}else{
		var password = req.body.password;
		console.log(password);
		//console.log(user.comparePassword(password));
		if(user.comparePassword(password)){
			var userinfo ={
				_id : user._id,
				email : user.email,
				password : user.password
			}
			const token = jwt.sign(userinfo, config.secret,{
				expiresIn: 604888
			});
			console.log("tokem created "+ token);
			res.json({ 
				success: true, 
				token : token,
				user : {
					id: user._id,
					email : user.email
				}
				});
		}else{
			res.json({ success: false, message: 'Password invalid' });
		}}
		//res.json(user);
	});
})

//add User
router.post("/register",(req,res,next)=>{
	console.log("hedfgrer name" + req.body.name);
	let newUser = new User({
		name : req.body.name,
		email: req.body.email,
		password: req.body.password,
		type : req.body.type
	});
	User.findOne({email : req.body.email},(err,user)=>{
		if(user == null){
			console.log("going to register " + newUser);
			newUser.save((err,user)=>{
				if(err){
					res.json({ success: false, message: 'Could not register '+ err });
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

router.get("/profile",passport.authenticate('jwt',{session:false}) ,(req,res,next) =>{
	res.json({user: req.user});
})
module.exports = router;