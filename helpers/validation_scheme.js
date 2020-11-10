const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  username: Joi.string().lowercase().required(),
  password: Joi.string().min(5).required(),
  phone: Joi.number().min(5).required(),
  role:Joi.string()

})

module.exports = {
  authSchema,
}
