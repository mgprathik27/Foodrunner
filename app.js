var express = require("express");
var database = require("./config/database");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
var passport = require("passport");
var multer = require("multer");
var nodemailer = require("nodemailer");

var app = express();
var router = express.Router();

mongoose.connect(database.database);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var upload = multer({ dest: 'public/uploads/' })

app.post('/upload', upload.single('image'), function (req, res, next) {
    console.log(req.file);
    var resp = {filename: req.file.filename, message : "File uploaded successfully"};
           return res.send(resp);
})

app.get ('/upload/:name',(req,res)=>{
    var dir = path.join(__dirname, 'public/uploads/'+req.params.name)
    console.log("here for image " + dir);
    res.sendFile(dir);
})

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
