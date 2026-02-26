const Joi = require('joi');

const campGroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0).integer(),
        image: Joi.string().required().uri(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.campGroundSchema = campGroundSchema;