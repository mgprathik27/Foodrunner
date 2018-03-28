const mongoose = require('mongoose'); // Node Tool for MongoDB
const Schema = mongoose.Schema; // Import Schema from Mongoose


// User Model Definition
const orderSchema = new Schema({
  	email: { type: String, required: true, lowercase: true },
  	totalAmt: { type: Number },
	foods : [ 	{
					food :
				      {
				         type: mongoose.Schema.Types.ObjectId,
				         ref: "Food"
				      },
				      quantity : { type : Number ,default : 0}
  				}
   			],
   	orderDate : {type : Date, required:true}
},{
  usePushEach: true
});

module.exports = mongoose.model('Order', orderSchema);