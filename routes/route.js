const express = require("express");
var app = express();
const router = express.Router();
var user = require("./user");
var food = require("./food");
var cart = require("./cart");
var order = require("./order");

//retrieve data
router.use("/user",user);
router.use("/food",food);
router.use("/cart",cart);
router.use("/order",order);

router.get("/",(req,res)=>{
	res.send("in Routes");
});

module.exports = router;