const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if(!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all required fields")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be at least 6 characters")
    }

    // Check to see if the users email already exists
    const ifuserExists = await User.findOne({email})

    if (ifuserExists) {
    res.status(400)
    throw new Error("Email is already registered")
    }

    // Create a new user
    const user = await User.create({
        name,
        email, 
        password
    })

    // 201 represents new user created
    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});

module.exports = {
    registerUser
}