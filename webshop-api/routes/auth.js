const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); 

// Registration route
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).send({ message: "Please complete all fields" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(403).send({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            role: "user",
            address: {
                street: "",
                suite: "",
                city: "",
                zipcode: "",
            },
            phone: "",
        });

        await newUser.save(); 
        res.status(201).send({ message: "Successfully registered" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) { 
            res.status(200).json(user);
        } else {
            res.status(404).send({ message: "User not found or incorrect password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
