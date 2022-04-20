var express = require('express');
var router = express.Router();
const { verifyToken } = require('../middleware/auth');

var USERcontroller = require('../controllers/userController');

/// USER ROUTES ///

//creating a new user
router.post('/signup', USERcontroller.registerUser);

//login user
router.post('/login', USERcontroller.userLogin);

//updating password
router.post('/change-password', verifyToken, USERcontroller.changePassword);

//forgot password
router.post('/forgot-password', USERcontroller.forgotPassword)

//reset password
router.post('/reset-password', USERcontroller.resetPassword)


module.exports = router;

