var express = require("express");
var database = require("./config/database");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
var passport = require("passport");

var app = express();

mongoose.connect(database.database);

//on connection
mongoose.connection.on("connected",()=>{
	console.log("connected to db @ 27017");
})
//err connection
mongoose.connection.on("error",(err)=>{
	if(err)
		console.log("connection to db @ 27017 failed : "+err);
})

const route = require("./routes/route");
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.get('/',(req,res)=>{
	res.send("hey there");
});

app.use("/api",route);


app.listen(port,()=>{
	console.log("Server started at port "+port);
} );
