const mongoose = require('mongoose'); // Node Tool for MongoDB
const Schema = mongoose.Schema; // Import Schema from Mongoose


// User Model Definition
const foodSchema = new Schema({
  name: { type: String, required: true, unique: true, lowercase: true },
  type: { type: String, required: true  },
  price: { type: Number, required: true },
  image : {type: String},
  available: { type: String, required: true  }
});

module.exports = mongoose.model('Food', foodSchema);