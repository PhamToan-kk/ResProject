const express = require('express')
const router = express.Router()
const FoodsController = require('../controllers/Foods.controller')
const {verifyAccessToken} = require('../helpers/jwt_helper')



router.post('/addFood',FoodsController.addFood)
router.post('/deleteFood',FoodsController.deleteFood)
router.post('/updateFood',FoodsController.updateFood)
router.get('/getFoods',FoodsController.getFoods)
router.get('/getPageFoods',FoodsController.getPageFood)



module.exports = router