const mongoose = require('mongoose')
const { stringify } = require('querystring')
const bcrypt  = require('bcrypt')
const { Decimal128 } = require('mongodb')
const Scheme = mongoose.Schema



const UserSheme = new Scheme({
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    phone:{
        type:Number,
        require:true,
    },
    role:{
        type:String,
        require:true,
    }
})
UserSheme.pre('save',async function (next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }catch(err){
        next(err)
    }

})

UserSheme.methods.isValidPassword = async function (password){
    try{
        console.log('password',password)
        console.log('this password',this.password)
        return await bcrypt.compare(password,this.password)
    } catch(err){
        throw err
    }
}

const User = mongoose.model('users',UserSheme)

const FoodSheme = new Scheme({
    name:{
        type:String,
        require:true,
        unique:true
    },
    type:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    url:{
        type:String,
        require:true,
    },
    intro:{
        type:String,
        require:true,
    },
    components:{
        type:String,
        require:true,
    }
})

const Foods = mongoose.model('Foods',FoodSheme)



const OrderSchema = new Scheme({
    name:{
        type:Number,
        require:true,
    },
    date:{
        type:Number,
        require:true,
    },
    month:{
        type:Number,
        require:true,
    },
    time:{
        type:String,
        require:true,
    },
    year:{
        type:Number,
        require:true,
    },
    customername:{
        type:String,
        require:true,
    },
    customerid:{
        type:String,
        require:true,
    },
    order:{
        type:Array,
        require:true,
    },
    shipcost:{
        type:Number,
        require:true,
    },
    paymenttotal:{
        type:Number,
        require:true,
    },
    address:{
        type:String,
        require:true,
    },
    phone:{
        type:Number,
        require:true,
    },
    isactive:{
        type:Boolean,
        require:true,
    },
    isfinish:{
        type:Boolean,
        require:true,
    }
})

const Orders = mongoose.model('Orders',OrderSchema)


// const OtherInfoSchema = new Scheme({
//     shipcost:{
//         type:String,
//         require:true,
//     },
//     discount:{
//         type:Number,
//         require:true,
//     },
// })

// const OtherInfos = mongoose.model('OtherInfos',OtherInfoSchema)

const OtherSchema = new Scheme({
    name:{
        type:String,
        require:true,
    },
    discount:{
        type:Decimal128,
        require:true,
    },
    shipprice:{
        type:Number,
        require:true,
    },
    
})

const OtherInfos = mongoose.model('OtherInfos',OtherSchema)
module.exports = {
    User:User,
    Foods:Foods,
    Orders:Orders,
    OtherInfos:OtherInfos
}