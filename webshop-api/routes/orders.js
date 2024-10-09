const express = require("express");
const Order = require("../models/Order");
const Book = require("../models/Book");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving orders", error });
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving order", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user, delivery_address, billing_address, items, total } =
      req.body.data;

    const userDetails = await User.findById(user);

    const products = await Book.find({
      name: { $in: items.map((item) => item.name) },
    });

    for (const item of items) {
      const book = products.find((product) => product.name === item.name);
      if (book) {
        if (book.quantity < item.quantity) {
          return res
            .status(400)
            .json({ message: `Not enough stock for ${item.name}` });
        }
        book.quantity -= item.quantity;
        await book.save();
      }
    }

    const newOrder = new Order({
      user_id: userDetails.id,
      name: userDetails.name,
      email: userDetails.email,
      delivery_address,
      billing_address,
      phone: userDetails.phone,
      order: items,
      payment: "card",
      date: Date.now(),
      total,
    });

    await newOrder.save();

    return res
      .status(200)
      .json({ message: "Order placed successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order: ", error);
    return res.status(500).json({ message: "Error placing order", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      res
        .status(200)
        .json({ message: `Order ${req.params.id} deleted successfully` });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user_id: userId }).sort({ date: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

module.exports = router;
