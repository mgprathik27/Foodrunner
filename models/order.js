const mongoose = require('mongoose'); // Node Tool for MongoDB
const Schema = mongoose.Schema; // Import Schema from Mongoose


// User Model Definition
const orderSchema = new Schema({
  	email: { type: String, required: true, lowercase: true },
  	totalAmt: { type: Number },
	foods : [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Food"
      }
   ]
},{
  usePushEach: true
});

module.exports = mongoose.model('Order', orderSchema);