const createError = require('http-errors')
const model = require('../models/Model')
const PriceInfos = model.PriceInfos

module.exports={
    addOtherInfor:async(req,res)=>{
        const {
            discountpercent,
            shipprice,
            name
        } = req.body

        const newinfo = new PriceInfos({
            name,
            discountpercent,
            shipprice
        })
        const saveInfo = newinfo.save()
        res.send(saveInfo)
    },
    updateOtherInfo:async(req,res)=>{
        const {
            newDiscountPercent,
            newShipPrice
        } = req.body

        const info = await PriceInfos.updateOne({
            name:"FoodBet",
        },{
            discountpercent:newDiscountPercent,
            shipprice:newShipPrice,
        })

        res.send(info)
    },
    getOtherInfo:async(req,res)=>{
        const dataOtherInfos = await PriceInfos.find({})
        // const OtherInfos = dataOtherInfos[0] 
        res.send(dataOtherInfos[0])
    }
}