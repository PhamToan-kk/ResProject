const model = require('../models/Model')
const Users = model.User
const createError = require('http-errors')
const {
    authSchema,loginSchema
} = require('../helpers/validation_scheme')
const { signAccessToken ,signRefreshToken,verifyRefreshToken} = require('../helpers/jwt_helper')
module.exports = {
    register: async (req, res, next) => {
        try {
            // const {username,password} = req.body
            // if(!username || !password ) throw createError.BadRequest() // status 400
            const data = await authSchema.validateAsync(req.body)
            const doesExist = await Users.findOne({
                username: data.username
            })
            if (doesExist) throw createError.Conflict('username have existed ') // status 409 duplicate
            const user = new Users(data)

            const saveUser = await user.save()
            console.log('new users',saveUser)
            const accessToken = await signAccessToken(saveUser.id)
            const refreshToken = await signRefreshToken(saveUser.id)

            res.send({saveUser,accessToken,refreshToken})

        } catch (err) {
            if(err.isJoi === true) // not invalid with Validation use Joi module
                err.status = 422 
            next(err)
        }
    },
    login: async (req,res,next) => {

        try{
            const data = await loginSchema.validateAsync(req.body)
            const user = await Users.findOne({
                username: data.username
            })
            //check username isExsisted
            if (!user) throw createError.NotFound('user not register')  //status 404
            // check password
            const isMatch = await user.isValidPassword(data.password)
            if(!isMatch) throw createError.Unauthorized('username or pass is not true')  //status 401
            // create token 
            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)

            res.send(
                {
                    "accessToken":accessToken,
                    "refreshToken":refreshToken,
                    "username":user.username,
                    "phone":user.phone,
                    "role":user.role,
                    "id":user.id
                }
                )

        } catch(error){
            if(error.isJoi === true) 
               return next(createError.BadRequest('invalid username or password'))

            next(error)
        }

    },
    refreshToken: async (req, res,next) => {
        const {refreshToken} = req.body
        // console.log('req.body.refreskToknnn',refreshToken)
        try{
            if(!refreshToken){ throw createError.BadRequest()} // status 400
            const userId =  await verifyRefreshToken(refreshToken)

            const accessToken = await signAccessToken(userId)
            const refToken = await signRefreshToken(userId)
            res.send({accessToken:accessToken,refreshToken:refToken})

        } catch(err){
            next(err)
        }

    },
    logout: (req, res) => {
        res.send('ok')

    },
}