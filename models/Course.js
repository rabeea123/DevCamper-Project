const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    user: 
    {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    
    bootcamp_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },

    code:
    {
        type: String,
        require: true,
        min: 3,
        max: 4,
        unique: true,
    },

    title:
    {
        type: String,
        require: true,
        min: 2,
        max: 20,
        unique: true,
    },

    duration:
    {
        type: String,
    },

    courseFee:
    {
        type: Number,
    },

    registeredStudents:
    {
        type: Number,
    }
},

{ timestamps: true }

);

module.exports = mongoose.model("Course", CourseSchema);

