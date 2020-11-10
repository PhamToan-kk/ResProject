const express = require('express')
const router = express.Router()
const FoodsController = require('../controllers/Foods.controller')

router.post('/addFood',FoodsController.addFood)
router.post('/deleteFood',FoodsController.deleteFood)
router.post('/updateFood',FoodsController.updateFood)
router.get('/getFoods',FoodsController.getFoods)



module.exports = router