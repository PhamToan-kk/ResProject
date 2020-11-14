const createError = require('http-errors')
const model = require('../models/Model')
const Orders = model.Orders
const moment = require('moment')
module.exports={
    addOrder: async(req,res,next)=>{
        const {
            // name,
            date,
            month,
            year,
            customername,
            customerid,
            order,
            shipcost,
            paymenttotal,
            address,
            phone,
            isactive,
            isfinish
        } = req.body
        try{
        if(!date || !month || !year || !customername || !customerid || !order || !shipcost || !paymenttotal || !address ||!phone || !isactive || !isfinish) throw  createError.BadRequest()
        
        const newOrder = new Orders({
            name :Date.now(),
            date,
            month,
            year,
            time:moment().format('MMM DD h:mm A'),
            customername,
            customerid,
            order,
            shipcost,
            paymenttotal,
            address,
            phone,
            isactive,
            isfinish
        })

        const saveOrder = await newOrder.save()
        res.send(saveOrder)
        // res.send("ok")

        
        }catch(err){
            // if(err.isJoi === true) // not invalid with Validation use Joi module
            // err.status = 422 
            next(err)
        }
    },
    activeOrder:async(req,res)=>{
        const {orderName} = req.body
        const orderUpdated = await Orders.updateOne({
            name:orderName,
        },{
            isactive:true,
        })
        res.send(orderUpdated)
    },
    finishOrder:async (req,res)=>{
        const {orderName} = req.body
        const orderUpdated = await Orders.updateOne({
            name:orderName,
        },{
            isfinish:true,
        })
        res.send(orderUpdated)
    },
    getListOrders:async(req,res)=>{
        // const listOrders = await 
        const page = req.query.page
        const limit = req.query.limit

        // console.log(req.query)
        const xorders = await Orders.find({})
        const orders = xorders.reverse()

        const startIndex = (page-1)*limit
        const endIndex = page*limit
        const result = {
            orderCount : orders.length
        }
        
        if(endIndex<orders.length ){
            result.next={
                page:page+1,
                limit:limit
            }
        }
        if(startIndex>0)
        {
            result.previous={
                page:page-1,
                limit:limit
            }
        }
        result.resultOrders =  orders.slice(startIndex,endIndex)
        res.send(result)
    },
    getOrderInfo:async(req,res)=>{
        const orders = await Orders.find({})
        const listFinishedOrder = orders.filter((i)=>i.isfinish === true)
        const orderCount= listFinishedOrder.length

        const totalOrderMoney = listFinishedOrder.map(i=>i.paymenttotal).reduce((a,b)=>a+b)
        console.log('dddd',totalOrderMoney)
        res.send({
            orderCount:orderCount,
            totalOrderMoney:totalOrderMoney
        })

    }
}