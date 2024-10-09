const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* GET users listing. */
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
      const { name, username, email, password, address, phone } = req.body;

      if (!name || !username || !email || !password || !address || !phone) {
          return res.status(400).json({ message: "All fields are required" });
      }

      const newUser = new User({
          name,
          username,
          email,
          password,
          address,
          phone,
      });

      await newUser.save();
      res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get user by ID
router.get("/:id", async (req, res) => {
   console.log("Fetching user with ID:", req.params.id); // Log the user ID
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).json({ message: `User ${req.params.id} deleted` });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id", async (req, res) => {
  try {
      const user = await User.findById(req.params.id); 
      if (user) {
          const { address, phone } = req.body;
          if (!address || !phone) {
              return res.status(400).json({ message: "Address and phone are required" });
          }

          user.address.street = address.street;
          user.address.suite = address.suite;
          user.address.city = address.city;
          user.address.zipcode = address.zipcode;
          user.phone = phone;

          await user.save();
          res.status(200).json({ message: "User updated successfully" });
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
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
