// const express = require('express')
const PORT = process.env.PORT || 3000
// const app = express()
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var fileupload = require('express-fileupload')
//morgan
const morgan = require('morgan')
app.use(morgan('dev'))
//file upload 
app.use(fileupload(
    {useTempFiles:true}
))

// cloudiary
var cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name:"toankk2255",
    api_key:"231676516792854",
    api_secret:"KvGF4TwhxYzbnSmYczj0pPQ1VoA"
})


// Err status 
const createError = require('http-errors')

require('dotenv').config()

const {verifyAccessToken} = require('./helpers/jwt_helper')




// body parser 
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(bodyParser.json());

// connect to mongoDb
require('./helpers/init_mongodb')



// connect redis

require('./helpers/init_redis')

// routes import
const AuthRoute = require('./routes/Auth.route')
const FoodRoute = require("./routes/Food.route")
const OrderRoute = require("./routes/Order.route")
const OtherInfoRoute = require("./routes/OtherInfor.route")


// socket.io 

io.on('connection', function (socket) {
    console.log('có ngưoi ket noi', socket.id)
    // // socket.on("chat message", msg => {
    // //     console.log(msg);
    // //     socket.emit("chat message", "leuleuuuuu");
    // //   });
    // socket.emit("chat message", "leuleuuuuu");


    socket.on("user send admin", msg => {
        console.log("user send admin",msg);
        socket.emit("server send admin", msg);
      });



    socket.on("admin send user", msg => {
        console.log("admin send user",msg);
        socket.emit("server send user",msg);
      });  

})

app.get('/',verifyAccessToken, (req,res)=>{
    console.log('payloads',req.payload)
        res.send({xxx:123})
})


app.post ('/uploaddemo',async (req,res)=>{
    const file = req.files.photo
    console.log(file)
   const value =   await cloudinary.uploader.upload(file.tempFilePath)
   res.json({url:value.url})

})

app.get('/test',(req,res)=>{
    res.json({name:'toan'})
})

app.post('/testPost',(req,res)=>{
    const data = req.body
    res.json({data})
})

//app
app.use('/authen',AuthRoute)
app.use('/foods',verifyAccessToken,FoodRoute)
app.use('/orders',verifyAccessToken,OrderRoute)
app.use('/otherinfor',verifyAccessToken,OtherInfoRoute)

//response err
app.use(async (req,res,next)=>{
    next(createError.NotFound()) // err 404 - not found

})

app.use(async (err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        'error':{
            status: err.status || 500,
            message:err.message
        }
    })
})








server.listen(PORT,()=>console.log('server đang chạy port 3000'))