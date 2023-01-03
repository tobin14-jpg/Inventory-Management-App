const express = require('express');
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/userController');
const router = express.Router();



router.post("/register", registerUser) 
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", getUser);

module.exports = router;