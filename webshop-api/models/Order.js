const mongoose = require("mongoose");

// Define the schema for order items
const orderItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
  },

  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Define the schema for delivery and billing addresses
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  suite: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
});

// Define the main order schema
const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: addressSchema,
    required: true,
  },
  billing_address: {
    type: addressSchema,
    required: true,
  },
  phone: {
    type: String,
    default: "", // Assuming phone can be empty
  },
  order: [orderItemSchema],
  payment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
