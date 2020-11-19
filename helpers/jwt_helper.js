const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./init_redis')

module.exports  = {
    signAccessToken:(userId)=>{
        // console.log('userId',userId)
        return new Promise((resolve,reject)=>{
            const payload = {
            }
            const secret = process.env.ACCESS_TOKEN_SECRET

            const options = {
                expiresIn:'1000h',
                audience: userId,
                issuer:'package.com'
            }

            jwt.sign(payload,secret,options,(err,token)=>{
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())// status 500
                    return
                  }
                  resolve(token)
                
            })
        })
    },
    verifyAccessToken:(req,res,next)=>{
        if(!req.headers['authorization']) return next(createError.Unauthorized()) //status 401
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
            if(err) {
                // if(err.name === 'JsonWebTokenError'){
                //     return next(createError.Unauthorized())
                // }else {
                //     return next(createError.Unauthorized(err.message))

                // }
                const message = err.name ==="JsonWebTokenError" ? 'Unauthorized': err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })


    },
    signRefreshToken :(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload = {
                audience: userId,
            }
            const secret = process.env.REFRESH_TOKEN_SECRET

            const options = {
                expiresIn:'100h', //1y
                // audience: userId,
                issuer:'package.com',
                // algorithm:'HS256'
            }

            jwt.sign(payload,secret,options,(err,token)=>{
                if (err) {
                    console.log('err signRefreshToken',err.message)
                    // reject(err)
                    reject(createError.InternalServerError())
                  }
          
                  client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                    if (err) {
                      console.log('redis signRFToken',err.message)
                      reject(createError.InternalServerError())
                      return
                    }
                    resolve(token)
                  })
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, payload) => {
              if (err) return reject(createError.Unauthorized()) //status 401
              // console.log('payload :',payload)
              const userId = payload.audience
              client.GET(userId, (err, result) => {
                if (err) {
                  console.log('redis verify refreshToken',err.message)
                  reject(createError.InternalServerError()) //status 500
                  return
                }
                if (refreshToken === result) return resolve(userId)
                reject(createError.Unauthorized())//status 401
              })
            }
          )
        })
      },
}