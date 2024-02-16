const express=require('express')
const commentController = require('../apps/controllers/CommentBlogController')
const PaginationMiddleware=require('../apps/middleware/PaginationMiddleware')

const router = express.Router()

router.get('/',PaginationMiddleware,commentController.index)
router.get('/blog/:id',PaginationMiddleware,commentController.getCmtBlog)

router.post('/create',commentController.create)
router.delete('/delete/:id',commentController.delete)
router.post('/deletemany',commentController.deleteMany)





module.exports=router

