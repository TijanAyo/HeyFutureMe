const Joi = require('joi')

const mailSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    message: Joi.string().required(),
    date: Joi.date().required()
})

module.exports = {
    mailSchema
}