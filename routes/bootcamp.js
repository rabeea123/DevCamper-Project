var express = require('express');
var router = express.Router();
const {verifyToken}= require('../middleware/auth')
var BOOTCAMPcontroller = require('../controllers/bootcampController');
const advanceFunctionality = require('../middleware/advanceFunctionality');
const Bootcamp = require('../models/Bootcamp');

/// BOOTCAMP ROUTES ///

//creating a new bootcamp
router.post('/createbootcamp', verifyToken, BOOTCAMPcontroller.createBootcamp);

//displaying list of all the bootcamps
router.get('/bootcampslist', verifyToken, advanceFunctionality(Bootcamp), BOOTCAMPcontroller.bootcampsList);

//displaying the detail of a single bootcamp
router.get('/bootcampDetail/:id', verifyToken, BOOTCAMPcontroller.bootcampDetail);

//updating a bootcamp
router.put('/updatebootcamp/:id', verifyToken, BOOTCAMPcontroller.updateBootcamp);

//deleting a bootcamp
router.delete('/deletebootcamp/:id', verifyToken, BOOTCAMPcontroller.deleteBootcamp);


module.exports = router;
