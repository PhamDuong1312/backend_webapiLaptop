const express=require('express')
const orderController = require('../apps/controllers/OrderController')
const PaginationMiddleware=require('../apps/middleware/PaginationMiddleware')


const router = express.Router()

router.get('/',PaginationMiddleware,orderController.index)
router.get('/user/:id',PaginationMiddleware,orderController.getOrderUser)
router.get('/:id',orderController.getOrder)


router.post('/create',orderController.create)
router.put('/edit/:id',orderController.putStatusOrder)
router.delete('/delete/:id',orderController.deleteOrder)











module.exports=router

