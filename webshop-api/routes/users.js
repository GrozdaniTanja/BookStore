const { response } = require("express");
let express = require("express");
const fs = require("fs");
const path = require("path");
let router = express.Router();

// Construct absolute path for the users JSON file
const usersFilePath = path.join(__dirname, "../data/users.json");

/* GET users listing. */
router.get("/", function (req, res, next) {
  let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).send({ message: "404 Not Found" });
  }
});

router.get("/:id", function (req, res, next) {
  let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
  let user = users.find((user) => user.id == req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send({ message: "404 Not Found" });
  }
});

router.delete("/:id", function (req, res) {
  let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
  let user = users.find((user) => user.id == req.params.id);
  if (user) {
    let updatedUsers = users.filter((user) => user.id != req.params.id);
    fs.writeFile(usersFilePath, JSON.stringify(updatedUsers), function (err) {
      if (err) {
        throw err;
      } else {
        res.status(200).send({ message: `Deleting user ${req.params.id}` });
      }
    });
  }
});

router.put("/:id", function (req, res, next) {
  let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

  // Find the user by ID
  let user = users.find((user) => user.id == req.params.id);

  if (user) {
    // Update user data
    user.address.street = req.body.address.street;
    user.address.suite = req.body.address.suite;
    user.address.city = req.body.address.city;
    user.address.zipcode = req.body.address.zipcode;
    user.phone = req.body.phone;

    if (validateUser(user)) {
      // Save updated data to file
      fs.writeFile(usersFilePath, JSON.stringify(users), function (err) {
        if (err) {
          throw err;
        } else {
          res.status(201).send({ message: "Successfully updated" });
        }
      });
    } else {
      res.status(400).send({ message: "Bad request" });
    }
  } else {
    res.status(400).send({ message: "Please complete all fields" });
  }
});

function validateUser(user) {
  let regexLetters = /(^[A-Za-z]{2,30})([ ]{0,1})([A-Za-z]{2,30})/;
  let regexPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
  let regexZipCode = /^[0-9]{6}$/;
  let regexAddressSuite = /^[.0-9a-zA-Z\s,-]+$/;

  return (
    user.address.street &&
    user.address.suite &&
    user.address.city &&
    user.address.zipcode &&
    user.phone &&
    user.address.street.match(regexLetters) &&
    user.address.city.match(regexLetters) &&
    user.address.suite.match(regexAddressSuite) &&
    user.address.zipcode.match(regexZipCode) &&
    user.phone.match(regexPhone)
  );
}

module.exports = router;
