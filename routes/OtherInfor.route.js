const express = require('express')
const router = express.Router()
const OtherInfoController = require('../controllers/OtherInfo.controller')

router.post('/addInfo',OtherInfoController.addOtherInfor)
router.post('/updateInfo',OtherInfoController.updateOtherInfo)




module.exports = router