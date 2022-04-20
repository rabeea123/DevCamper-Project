
const User = require("../models/User");
const { authSchema } = require("../helpers/validationSchema");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');


//creating a new user
exports.registerUser = async(req, res, next) => {
    try
    {
        //validating the inputs
        const result = await authSchema.validateAsync(req.body);

        //checking if the email already exists
        const emailExist = await User.findOne({ email: result.email });
        if(emailExist)
        {
            throw new AppError('This email has already been registered', 409);      
        }

        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(result.password, salt);
        result.password = hashedPassword;
       
        //create new user
        const new_user = await new User(result);
    
        //save user and respond
        const user = await new_user.save();
        res.status(200).json(user);
    }
    catch(err)
    {
        next(err);
    }
};


//login user
exports.userLogin = async(req, res, next) => {
    try
    {
        const user = await User.findOne({ email: req.body.email });
        if(!user) 
        throw new AppError('Wrong Credentials', 400); 

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword)
        throw new AppError('Wrong Credentials', 400); 


        jwt.sign({user}, 'secretkey', (err, token) => {
         res.json({user,token});
        });
    
    }
    catch(err)
    {
        next(err);
    }
};

//updating password
exports.changePassword = async(req, res, next) => {
    var token = req.token;
     
    const decoded = jwt.verify(token, 'secretkey');
    var userId = decoded.user._id;
   
    const user = await User.findOne({ _id: userId });

    const validPassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if(!validPassword)
    return next(new AppError(`Invalid Input`, 400));

    try
    {
        const mypassword = req.body.newPassword;
        
        if(!mypassword)
        {
            return next(new AppError(`New Password is required!`, 400));
        }

        if(mypassword.length < 4)
        {
            return next(new AppError(`Password length must be atleast 4 characters long!`, 400));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
                
        user.password = hashedPassword;
        user.save();
            
        res.status(200).json(user);
    }
    catch(err)
    {
        next(err);
    }
};

//forgot password
exports.forgotPassword = async(req, res, next) => {

    //checking if the email exists in the database or not
    const user = await User.findOne({ email: req.body.email });

    if (!user) 
    {
        return next(new AppError(`User is not registered`, 404));
    }

    const secret = 'secretkey' + user.password;

    const payload = {
        email: user.email,
        id: user._id
    }

    const token = jwt.sign(payload, secret, {expiresIn: '60m'})

    //saving the token in the database
    user.token = token;
    user.save();

    //sending mail using nodemailer
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        pool: true,
        auth: 
        {
            user: 'sadh01256@gmail.com',
            pass: 'whysad5678'
        }
    });

    var mailOptions = {
        from: 'sadh01256@gmail.com',
        to: user.email,
        subject: 'Sending Email using Node.js',
        text: token        
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) 
    {
        next(error);
    } 
    else 
    {
        console.log('Email sent: ' + info.response);
        res.status(200).json("Email has been sent successfully");
    }
});   
};


//reset password
exports.resetPassword = async(req, res, next) => {

    //checking if the token exists in the database or not
    const user = await User.findOne({ token: req.body.token });

    if (!user) 
    {
        return next(new AppError(`Token does not exist`, 404));
    }

    const secret = 'secretkey' + user.password;

    try
    {
        const payload = jwt.verify(user.token, secret)

        const mypassword = req.body.newPassword;
        
        if(!mypassword)
        {
            return next(new AppError(`New Password is required!`, 400));
        }

        if(mypassword.length < 4)
        {
            return next(new AppError(`Password length must be atleast 4 characters long!`, 400));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedPassword;
        user.save();

        res.status(200).json(user);
    }
    catch(err)
    {
        next(err);
    }
};


