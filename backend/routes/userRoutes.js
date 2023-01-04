const express = require('express');
const { registerUser, loginUser, logoutUser, getUser, loggedInStatus, updateUser, changedPassword } = require('../controllers/userController');
const protectRoute  = require('../middleWare/authenticateMiddleware');
const router = express.Router();



router.post("/register", registerUser) 
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", protectRoute, getUser);
router.get("/loggedin", loggedInStatus);
router.patch("/updateuser", protectRoute, updateUser);
router.patch("/changepassword", protectRoute, changedPassword);

module.exports = router;