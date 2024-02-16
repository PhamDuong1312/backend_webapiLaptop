const express=require('express')
const commentController = require('../apps/controllers/CommentController')
const PaginationMiddleware=require('../apps/middleware/PaginationMiddleware')

const router = express.Router()

router.get('/',PaginationMiddleware,commentController.index)
router.get('/product/:id',PaginationMiddleware,commentController.getCmtPro)

router.post('/create',commentController.create)
router.delete('/delete/:id',commentController.delete)
router.post('/deletemany',commentController.deleteMany)





module.exports=router

