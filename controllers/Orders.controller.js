const createError = require('http-errors')
const model = require('../models/Model')
const Orders = model.Orders
const moment = require('moment')
module.exports = {
    addOrder: async (req, res, next) => {
        const {
            customername,
            customerid,
            order,
            shipcost,
            paymenttotal,
            address,
            phone,
            note
        } = req.body
        try {
            if (!customername || !customerid || !order || !shipcost || !paymenttotal || !address || !phone) throw createError.BadRequest()

            const newOrder = new Orders({
                name: Date.now(),
                date: moment().date(),
                month: moment().month(),
                year: moment().year(),
                time: moment().format('MMM DD h:mm A'),
                customername,
                customerid,
                order,
                shipcost,
                paymenttotal,
                address,
                phone,
                isactive: false,
                isfinish: false,
                note,
                feedback:''
            })

            const saveOrder = await newOrder.save()
            res.send(saveOrder)
            // res.send("ok")
        } catch (err) {
            // if(err.isJoi === true) // not invalid with Validation use Joi module
            // err.status = 422 
            next(err)
        }
    },
    activeOrder: async (req, res) => {
        const {
            orderName
        } = req.body
        const orderUpdated = await Orders.updateOne({
            name: orderName,
        }, {
            isactive: true,
        })
        res.send(orderUpdated)
    },
    finishOrder: async (req, res) => {
        const {
            orderName,
            feedback
        } = req.body
        const orderUpdated = await Orders.updateOne({
            name: orderName,
        }, {
            isfinish: true,
            feedback:feedback
        })
        res.send(orderUpdated)
    },
    getListOrders: async (req, res) => {
        // const listOrders = await 
        const page = req.query.page
        const limit = req.query.limit

        // console.log(req.query)
        const xorders = await Orders.find({})
        const orders = xorders.reverse()

        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = {
            orderCount: orders.length
        }

        if (endIndex < orders.length) {
            result.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            }
        }
        result.resultOrders = orders.slice(startIndex, endIndex)
        res.send(result)
    },
    getOrderInfo: async (req, res) => {
        const orders = await Orders.find({})
        const listFinishedOrder = orders.filter((i) => i.isfinish === true)
        const orderCount = listFinishedOrder.length

        const totalOrderMoney = listFinishedOrder.map(i => i.paymenttotal).reduce((a, b) => a + b)
        console.log('dddd', totalOrderMoney)
        res.send({
            orderCount: orderCount,
            totalOrderMoney: totalOrderMoney
        })

    },
    getOrderNotActive: async (req, res) => {
        const {
            customerId
        } = req.query
        const orders = await Orders.find({
            isactive: false,
            customerid: customerId
        })

        res.send(orders)

    },
    getOrderActivedNotFinish: async (req, res) => {
        const {
            customerId
        } = req.query
        const orders = await Orders.find({
            isfinish: false,
            isactive: true,
            customerid: customerId
        })

        res.send(orders)
    },
    adminGetOrderNotActive:async (req, res) => {
       
        const orders = await Orders.find({
            isactive: false,
        })

        res.send(orders)

    }
}