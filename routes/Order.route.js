const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/Orders.controller')

router.post('/addOrder',OrderController.addOrder)

router.post('/activeOrder',OrderController.activeOrder)

router.post('/finishOrder',OrderController.finishOrder)

router.get('/getListOrders',OrderController.getListOrders)

router.get('/getOrderInfo',OrderController.getOrderInfo)



module.exports = router