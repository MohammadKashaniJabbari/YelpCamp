const Joi = require('joi');

module.exports.campGroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0).integer(),
        image: Joi.string().required().uri(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5).integer(),
        body: Joi.string().required()
    }).required()
});