const express = require("express");
const fs = require("fs");
const router = express.Router();
const cors = require("cors");

router.post("/login", cors(), function (req, res, next) {
  let users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
  let user = users.find(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );
  if (user) {
    res.status(200).json(user);
  } else {
    console.log(users);
    res.status(404).send({ message: "404 Not Found" });
  }
});

router.post("/register", cors(), function (req, res, next) {
  let users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
  if (
    req.body.name &&
    req.body.username &&
    req.body.email &&
    req.body.password
  ) {
    let user = {
      id: users[users.length - 1].id + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: "user",
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
      },
      phone: "",
    };

    let verifyUser = users.find(
      (item) => item.username == user.username || item.email == user.email
    );
    if (verifyUser) {
      res.status(403).send({ message: "User already exist." });
    } else {
      users.push(user);
      fs.writeFile("./data/users.json", JSON.stringify(users), function (err) {
        if (err) {
          throw err;
        } else {
          res.send({ message: "Successfully registered" });
        }
      });
    }
  } else {
    res.status(400).send({ message: "Please complete all fields" });
  }
});

module.exports = router;
