var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");

var app = express();

const route = require("./routes/route");

//connnect to mongoDb
mongoose.connect("mongodb://localhost:27017/foodrunnerDB");

//on connection
mongoose.connection.on("connected",()=>{
	console.log("connected to db @ 27017");
})
//err connection
mongoose.connection.on("error",(err)=>{
	if(err)
		console.log("connection to db @ 27017 failed : "+err);
})

const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
	res.send("hey there");
});

app.use("/api",route);


app.listen(port,()=>{
	console.log("Server started at port "+port);
} );
