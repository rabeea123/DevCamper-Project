
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const { courseSchema } = require("../helpers/validationSchema");
const AppError = require("../utils/appError");
const jwt = require('jsonwebtoken');

//Gets all courses where Bootcamp id is ":id'
exports.courseList = async (req, res, next) => {
   try
   {
        res.send(res.advanceFunctionality);
   }
   catch(e)
   {
       next(e);
   }
};


//Get a single course with id "courseId" where Bootcamp id is "id"
exports.courseDetail = async (req, res, next) => {
    try
    {
        const mycourse = await Course.find({ bootcamp_id: req.params.id, _id: req.params.courseId }).populate('bootcamp_id', 'name');
        if(!mycourse)
        {
            throw new AppError('Record not found!', 403);
        }
        else
        {
            res.status(200).json(mycourse);
        }
    }
    catch(e)
    {
        next(e);
    }
};


//Create a new course with Bootcamp id ":id"
exports.createCourse = async(req, res, next) => {
    var token = req.token;

    const decoded = jwt.verify(token, 'secretkey');
    var userId = decoded.user._id;
    req.body.user = userId;

    req.body.bootcamp_id = req.params.id;

    try
    {
        const BootcampExist = await Bootcamp.findById(req.params.id);
        if (!BootcampExist) 
        {
            return next(new AppError(`Bootcamp not found`, 404));
        }

        //validating the inputs
        const result = await courseSchema.validateAsync(req.body);

        const mycourse = await Course.create(result);
        try
        {
            const course = await mycourse.save();
            res.status(200).json(course);
        }
        catch(err)
        {
            next(err);
        }
    }
    catch(err)
    {
        next(err);
    }
};


//Edit course with id "courseId" where Bootcamp id is "id"
exports.updateCourse = async(req, res, next) => {
    var token = req.token;
    
    const decoded = jwt.verify(token, 'secretkey');
    var userId = decoded.user._id;
   
    try
    {
        const mycourse = await Course.findById(req.params.courseId);
        const mybootcamp = await Bootcamp.findById(req.params.id);
        if(mycourse && mybootcamp)
        {
            try
            {
                if (mycourse.user.toString() !== userId) 
                {
                    return next(new AppError(`You are not authorized to update this Course`, 401));
                }

                req.body.user = userId;
                req.body.bootcamp_id = req.params.id;

                if(!req.body.title)
                {
                    req.body.title = mycourse.title;
                }
                
                if(!req.body.code)
                {
                    req.body.code = mycourse.code;
                }

                //validating the inputs
                const result = await courseSchema.validateAsync(req.body);
               
                const updatedCourse = await Course.findByIdAndUpdate({ bootcamp_id: req.params.id, _id: req.params.courseId}, {$set: result,}, { new: true });
                res.status(200).json(updatedCourse);
            }
            catch(err)
            {
                next(err);
            }
        }
        else
        {
            throw new AppError('Record not found!', 403);
        }
    }
    catch(err)
    {
        next(err);
    }
};


//Delete course with id "courseId" where Bootcamp id is "id"
exports.deleteCourse = async(req, res, next) => {
    try
    {
        var token = req.token;
     
        const decoded = jwt.verify(token, 'secretkey');
        var userId = decoded.user._id;

        const mycourse = await Course.findById(req.params.courseId);
        const mybootcamp = await Bootcamp.findById(req.params.id);
        if(mycourse && mybootcamp)
        {
            try
            {
                if (mycourse.user.toString() !== userId) 
                {
                    return next(new AppError(`You are not authorized to delete this Course`, 401));
                }
                await Course.findByIdAndDelete({ bootcamp_id: req.params.id, _id: req.params.courseId });
                res.status(200).json("Course has been deleted");
            }
            catch(err)
            {
                next(err);
            }
        }
        else
        {
            throw new AppError('Record not found!', 403);
        }
    }
    catch(err)
    {
        next(err);
    }
};

