const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const cors = require("cors");
const router = express.Router();

// Construct absolute paths for the JSON files
const ordersFilePath = path.join(__dirname, "../data/orders.json");
const usersFilePath = path.join(__dirname, "../data/users.json");
const productsFilePath = path.join(__dirname, "../data/books.json");

router.get("/", cors(), function (req, res, next) {
  let orders = JSON.parse(fs.readFileSync(ordersFilePath, "utf8"));
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404).send({ message: "404 Not Found" });
  }
});

router.get("/:id", cors(), function (req, res, next) {
  let orders = JSON.parse(fs.readFileSync(ordersFilePath, "utf8"));
  let order = orders.find((order) => order.id == req.params.id);
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).send("404 Not Found");
  }
});

router.get("/user/:id", cors(), function (req, res, next) {
  let orders = JSON.parse(fs.readFileSync(ordersFilePath, "utf8"));
  let userOrders = orders.filter((order) => order["user_id"] == req.params.id);
  res.status(200).json(userOrders);
});

router.post("/", cors(), function (req, res, next) {
  let orders = JSON.parse(fs.readFileSync(ordersFilePath, "utf8"));
  let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
  let products = JSON.parse(fs.readFileSync(productsFilePath, "utf8"));
  let user = users.find((user) => user.id == req.body.data.user);

  if (
    req.body.data.delivery_address.street &&
    req.body.data.delivery_address.suite &&
    req.body.data.delivery_address.city &&
    req.body.data.delivery_address.zipcode &&
    req.body.data.billing_address.street &&
    req.body.data.billing_address.suite &&
    req.body.data.billing_address.city &&
    req.body.data.billing_address.zipcode &&
    req.body.data.items &&
    req.body.data.total
  ) {
    let order = {
      id: uuid.v1(),
      user_id: user.id,
      name: user.name,
      email: user.email,
      delivery_address: {
        street: req.body.data.delivery_address.street,
        suite: req.body.data.delivery_address.suite,
        city: req.body.data.delivery_address.city,
        zipcode: req.body.data.delivery_address.zipcode,
      },
      billing_address: {
        street: req.body.data.billing_address.street,
        suite: req.body.data.billing_address.suite,
        city: req.body.data.billing_address.city,
        zipcode: req.body.data.billing_address.zipcode,
      },
      phone: user.phone,
      order: req.body.data.items,
      payment: "card",
      date: Date.now(),
      total: req.body.data.total,
    };

    orders.push(order);
    for (let i = 0; i < req.body.data.items.length; i++) {
      let book = products.find(
        (item) => `${item.name}` == req.body.data.items[i].name
      );

      if (book) {
        if (book.quantity > 1) {
          book.quantity = book.quantity - req.body.data.items[i].quantity;
        } else {
          book.quantity = 0;
        }
      }
    }
    fs.writeFile(ordersFilePath, JSON.stringify(orders), function (err) {
      if (err) {
        throw err;
      } else {
        fs.writeFile(
          productsFilePath,
          JSON.stringify(products),
          function (err) {
            if (err) {
              throw err;
            } else {
              res.status(200).send({
                message: "Successfully registered",
              });
            }
          }
        );
      }
    });
  } else {
    res.status(400).send({ message: "Please complete all fields" });
  }
});

router.delete("/:id", cors(), function (req, res) {
  let orders = JSON.parse(fs.readFileSync(ordersFilePath, "utf8"));
  let order = orders.find((order) => order.id == req.params.id);
  if (order) {
    let updatedOrders = orders.filter((order) => order.id != req.params.id);
    fs.writeFile(ordersFilePath, JSON.stringify(updatedOrders), function (err) {
      if (err) {
        throw err;
      } else {
        res.status(200).send({
          message: `Deleting order ${req.params.id}`,
        });
      }
    });
  } else {
    res.status(404).send({ message: "Order not found" });
  }
});

module.exports = router;
