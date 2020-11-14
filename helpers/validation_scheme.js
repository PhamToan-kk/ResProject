const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  username: Joi.string().lowercase().required(),
  password: Joi.string().min(5).required(),
  phone: Joi.number().min(5).required(),
  role: Joi.string()

})

const loginSchema = Joi.object({
  username: Joi.string().lowercase().required(),
  password: Joi.string().min(6).required(),
})

const orderSchema = Joi.object({
  date : Joi.number().max(2).required(),
  month :Joi.number().max(2).required(),
  year :Joi.number().max(4).required(),
  customername :Joi.string().required(),
  order:Joi.array().required(),
  shipcost:Joi.number().required(),
  paymenttotal :Joi.number().required(),
  address :Joi.string().required(),
  phone: Joi.number().required(),
  active:Joi.boolean().required(),
  finish:Joi.boolean().required()
})

module.exports = {
  authSchema,
  loginSchema,
  orderSchema
}