const express=require('express')
const contactController = require('../apps/controllers/ContactController')
const PaginationMiddleware=require('../apps/middleware/PaginationMiddleware')


const router = express.Router()

router.get('/',PaginationMiddleware,contactController.index)
router.get('/:id',contactController.getDetail)
router.post('/create',contactController.create)
router.put('/reply/:id',contactController.reply)

router.delete('/delete/:id',contactController.delete)
router.post('/deletemany',contactController.deleteMany)





module.exports=router

