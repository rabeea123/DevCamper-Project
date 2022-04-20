var express = require('express');
var router = express.Router();
const Course = require('../models/Course');
var COURSEcontroller = require('../controllers/courseController');
const { verifyToken } = require('../middleware/auth');
const advanceFunctionality = require('../middleware/advanceFunctionality');

/// COURSE ROUTES ///

//Create a new course with Bootcamp id ":id"
router.post('/bootcamps/:id/courses', verifyToken, COURSEcontroller.createCourse);

//Gets all courses where Bootcamp id is ":id'
router.get('/bootcamps/:id/courses', verifyToken, advanceFunctionality(Course), COURSEcontroller.courseList);

//Get a single course with id "courseId" where Bootcamp id is "id"
router.get('/bootcamps/:id/courses/:courseId', verifyToken, COURSEcontroller.courseDetail);

//Edit course with id "courseId" where Bootcamp id is "id"
router.put('/bootcamps/:id/courses/:courseId', verifyToken, COURSEcontroller.updateCourse);

//Delete course with id "courseId" where Bootcamp id is "id"
router.delete('/bootcamps/:id/courses/:courseId', verifyToken, COURSEcontroller.deleteCourse);


module.exports = router;
