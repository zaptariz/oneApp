const Joi = require('joi')

exports.signupSchema = (req) => {
    let schema = Joi.object({
        firstName: Joi.string().alphanum().min(3).max(30).required(),
        lastName: Joi.string().alphanum().min(3).max(30).required(),
        emailId: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required(),
        password: Joi.string().alphanum().min(8).max(15).required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required()
    })
    return schema.validate(req, { abortEarly: false });
}

exports.signupSchema = (req) => {
    let schema = Joi.object({
        emailId: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required(),
        password: Joi.string().alphanum().min(8).max(15).required()
    })
    return schema.validate(req, { abortEarly: false });
}