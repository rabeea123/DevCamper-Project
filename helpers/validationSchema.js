const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required()
});

const bootcampSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    user: Joi.string().required()
});

const courseSchema = Joi.object({
    user: Joi.string().required(),
    bootcamp_id: Joi.string().required(),
    code: Joi.string().alphanum().min(3).max(4).required(),
    title: Joi.string().min(2).max(20).required(),
    duration: Joi.string(),
    courseFee: Joi.number(),
    registeredStudents: Joi.number(),
});

module.exports = {
    authSchema, bootcampSchema, courseSchema
}

