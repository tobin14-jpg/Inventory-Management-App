const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require("express"); 

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

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

        // Generating token for user
        const token = generateToken(user._id)

        // Send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: "none",
            secure: true
        });

    // 201 represents new user created
    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});

const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    // Validate request 
    if (!email || password) {
        res.status(400)
        throw new Error("Invalid user data")
    }

    // Check if user exists
    const user = await User.findOne({ email})

    if (!user) {
        res.status(400);
        throw new Error("User not found, please signup")
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    const token = generateToken(user._id)

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    });
    
    // if user exists, check if the password is correct
    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token
        });
    }
    res.send("Login user");
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // 1 day
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({message: "Succesfully logged out"})
})

// Get user data
const getUser = asyncHandler(async (req, res) => {
const user = await User.findById(req.user._id);
    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio
        });
    } else {
        res.status(400);
        throw new Error("User not found, please login")
    }

})

const loggedInStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    }

    const verfiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if(verfiedToken) {
        return res.json(true)
    } 
    return res.json(false)
});

// Update user info with data sent through the request body
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { name, email, photo, phone, bio } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save();
        res.status(200);
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        })
    } else {
        res.status(404);
        throw new Error("Update unsuccessful")
    }
});

const changedPassword = asyncHandler (async (req, res) => {

})


module.exports = {
    registerUser,
    loginUser,
    logoutUser, 
    getUser,
    loggedInStatus,
    updateUser, 
    changedPassword
}