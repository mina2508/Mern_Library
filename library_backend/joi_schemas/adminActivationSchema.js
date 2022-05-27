const Joi = require('joi');
const { joiPassword } = require('joi-password');

const adminActivationSchema = Joi.object({
    password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .min(8)
        .max(20)
        .required()

});

module.exports = {adminActivationSchema}