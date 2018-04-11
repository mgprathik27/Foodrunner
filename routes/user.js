const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
var User = require("../models/user");
var config = require("../config/database");
var nodemailer = require("nodemailer");

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
			if(user.active==false){
				res.json({ success: false, message: 'Email not verified' });
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
				expiresIn: 60488
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
	}
		//res.json(user);
	});
})

//add User
router.post("/register",(req,res,next)=>{
	console.log("hedfgrer name" + req.body.name);
	var rand=Math.floor((Math.random() * 100) + 54);
	let newUser = new User({
		name : req.body.name,
		email: req.body.email,
		password: req.body.password,
		type : req.body.type,
		active : false,
		rand : rand
	});
	User.findOne({email : req.body.email},(err,user)=>{
		if(user == null){
			console.log("going to register " + newUser);
			newUser.save((err,user)=>{
				if(err){
					res.json({ success: false, message: ""+err });
				}
				else{
					res.json({ success: true, message: 'registered successfully' });
				}
			});			
		}
		else{
			res.json({ success: false, message: 'Provided email has already been registered. Please try the login screen instead' });
		}

	});	
})


//email verification
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "mgprathik27@gmail.com",
        pass: "12369_pmg"
    },
    tls: { rejectUnauthorized: false }
});

router.post("/sendmail",(req,res,next)=>{
	User.findOne({email : req.body.email},(err,user)=>{	
		var userInfo = {};
		userInfo.email = req.body.email;
		userInfo.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		var token = jwt.sign(userInfo, config.secret,{
				expiresIn: 604888
			});
		console.log(token);
	    host=req.get('host');
	    link="http://"+host+"/api/user/verify?id="+token;
	    mailOptions={
	        to : req.body.email,
	        subject : "Please confirm your Email account",
	        html : "Hello,<br> Please Click on the link to verify your foodrunner account.<br><a href="+link+">Click here to verify</a>" 
	    }
	    console.log(mailOptions);
	    smtpTransport.sendMail(mailOptions, function(error, response){
	     if(error){
	        console.log(error);
			res.json({ success: false, message: 'email not sent' });
	     }else{
	        console.log("Message sent: " + response.message);
			res.json({ success: true, message: 'email sent successful' });
	         }
		});
	});
});

router.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
//if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if( req.query.id != null)
    {
		jwt.verify(req.query.id, config.secret, function(err,decoded){
			console.log(decoded);
			console.log(new Date().getTime() );
			User.findOneAndUpdate({email : decoded.email} ,{ $set: { active : true }}, { new: true },(err,resp)=>{
				if(!err)
					res.send("<h2 style = 'color : green'>"+decoded.email + " has been verified</h2>");
			})


		})
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
}
// else
// {
//     res.end("<h1>Request is from unknown source");
// }
});

router.get("/profile",passport.authenticate('jwt',{session:false}) ,(req,res,next) =>{
	res.json({user: req.user});
})
module.exports = router;