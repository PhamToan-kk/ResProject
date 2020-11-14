const createError = require('http-errors')
const model = require('../models/Model')
const OtherInfos = model.OtherInfos

module.exports={
    addOtherInfor:async(req,res)=>{
        const {
            discount,
            shipprice,
            name
        } = req.body

        const newinfo = new OtherInfos({
            name,
            discount,
            shipprice
        })
        const saveInfo = newinfo.save()
        res.send(saveInfo)
    },
    updateOtherInfo:async(req,res)=>{
        const {
            newDiscount,
            newShipPrice
        } = req.body

        const info = await OtherInfos.updateOne({
            name:"FoodBet",
        },{
            discount:newDiscount,
            shipprice:newShipPrice,
        })

        res.send(info)
    }
}