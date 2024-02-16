const express=require('express')
const cartController = require('../apps/controllers/CartController')

const router = express.Router()

router.get('/:id',cartController.index)
router.post('/create',cartController.create)
router.delete('/delete/:id',cartController.deleteProtoCart)
router.delete('/deleteAll/:uid',cartController.deleteCart)
router.put('/update',cartController.updateCart)









module.exports=router

