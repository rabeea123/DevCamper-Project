
const Bootcamp = require("../models/Bootcamp");
const { bootcampSchema } = require("../helpers/validationSchema");
const AppError = require("../utils/appError");
const jwt = require('jsonwebtoken');

//get all bootcamps list
exports.bootcampsList = async (req, res, next) => {
    try
    {
        res.send(res.advanceFunctionality);
    }
    catch(e)
    {
        next(e);
    }
};


//get details of a single bootcamp
exports.bootcampDetail = async (req, res, next) => {
    try
    {
        const mybootcamp = await Bootcamp.findById(req.params.id);
        if(!mybootcamp)
        {
            throw new AppError('Record not found!', 403);
        }
        else
        {
            res.status(200).json(mybootcamp);
        }
    }
    catch(e)
    {
        next(e);
    }
};


//creating a new bootcamp
exports.createBootcamp = async(req, res, next) => {   
    var token = req.token;

    const decoded = jwt.verify(token, 'secretkey');
    var userId = decoded.user._id
    req.body.user = userId;

    const BootcampExist = await Bootcamp.findOne({ user: userId });
    if (BootcampExist) 
    {
        return next(new AppError(`This user has already published a Bootcamp`, 400));
    }

    try
    {
        //validating the inputs
        const result = await bootcampSchema.validateAsync(req.body);

        const mybootcamp = await Bootcamp.create(result);
        
        const bootcamp = await mybootcamp.save();
        res.status(200).json(bootcamp);
    }
    catch(err)
    {
        next(err);
    }
};


//updating a bootcamp
exports.updateBootcamp = async(req, res, next) => {
    var token = req.token;

    const decoded = jwt.verify(token, 'secretkey');
    var userId = decoded.user._id
    
    try
    {
        const mybootcamp = await Bootcamp.findById(req.params.id);
        if(mybootcamp)
        {
            try
            {
                if (mybootcamp.user.toString() !== userId) 
                {
                    return next(new AppError(`You are not authorized to update this Bootcamp`, 401));
                }
                
                //validating the inputs
                req.body.user = userId;
                if(!req.body.name)
                {
                    req.body.name = mybootcamp.name;
                }
                const result = await bootcampSchema.validateAsync(req.body);

                const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, {$set: result,}, { new: true });
                res.status(200).json(updatedBootcamp);
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


//deleting a bootcamp
exports.deleteBootcamp = async(req, res, next) => {
    var token = req.token;
    
    const decoded = jwt.verify(token, 'secretkey');
    var userId = decoded.user._id;

    try
    {
        const mybootcamp = await Bootcamp.findById(req.params.id);
        if(mybootcamp)
        {
            try
            {
                if (mybootcamp.user.toString() !== userId) 
                {
                    return next(new AppError(`You are not authorized to delete this Bootcamp`, 401));
                }
                await mybootcamp.delete();
                res.status(200).json("Bootcamp has been deleted");
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

