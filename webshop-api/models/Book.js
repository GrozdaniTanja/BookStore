// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 50 },
  author: { type: String, required: true, minlength: 2, maxlength: 30 },
  category: { type: String, required: true, minlength: 2, maxlength: 30 },
  publishing_house: { type: String, required: true, minlength: 2, maxlength: 30 },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  availability_date: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5 },
  image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
