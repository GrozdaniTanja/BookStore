const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, // Ensure usernames are unique
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
        trim: true,
        lowercase: true, // Convert email to lowercase
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Enforce minimum password length
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Allow roles for authorization purposes
        default: "user", // Default to 'user'
    },
    address: {
        street: {
            type: String,
            default: "",
        },
        suite: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        zipcode: {
            type: String,
            default: "",
        },
    },
    phone: {
        type: String,
        default: "",
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
