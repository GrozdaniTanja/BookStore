const express = require("express");
const fs = require("fs");
const path = require("path"); // Add the path module
const router = express.Router();
const cors = require("cors");

// Construct absolute path for the users JSON file
const usersFilePath = path.join(__dirname, "../data/users.json");

router.post("/login", cors(), function (req, res, next) {
  let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
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
  let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
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
    
    if (validateUser(user)) {
      let verifyUser = users.find(
        (item) => item.username == user.username || item.email == user.email,
      );
      if (verifyUser) {
        res.status(403).send({ message: "User already exist." });
      } else {
        users.push(user);
        fs.writeFile(
          usersFilePath,
          JSON.stringify(users),
          function (err) {
            if (err) {
              throw err;
            } else {
              res.send({ message: "Successfully registered" });
            }
          },
        );
      }
    } else {
      res.status(400).send({ message: "Bad request" });
    }
  } else {
    res.status(400).send({ message: "Please complete all fields" });
  }
});

function validateUser(user) {
  const regexLetters = /(^[A-Za-z]{2,30})([ ]{0,1})([A-Za-z]{2,30})/;
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const regexPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const regexUsername = /^[a-z0-9_-]{3,16}$/gim;

  return (
    user.name.match(regexLetters) &&
    user.username.match(regexUsername) &&
    user.email.match(regexEmail) &&
    user.password.match(regexPassword)
  );
}

module.exports = router;
