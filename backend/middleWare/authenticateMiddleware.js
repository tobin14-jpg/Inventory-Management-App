const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const protectRoute = asyncHandler (async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if( !token ) {
            res.status(401);
            throw new Error("Not authorized to access, please login")
        }

        const verfiedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        //send user data back minus the password
        user = await User.findById(verfiedToken.id).select("-password");

        if (!user) {
            res.status(401);
            throw new Error("User not found, please signup or login")
        }

        req.user = user

        next();

    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, please login")
    }
})

module.exports = protectRoute;