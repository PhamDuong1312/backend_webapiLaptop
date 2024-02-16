const express=require('express')
const categoryController = require('../apps/controllers/CategoryController')
const PaginationMiddleware=require('../apps/middleware/PaginationMiddleware')

const router = express.Router()

router.get('/',PaginationMiddleware,categoryController.index)
router.get('/:id',categoryController.getDetail)

router.post('/create',categoryController.create)
router.put('/edit/:id',categoryController.edit)
router.delete('/delete/:id',categoryController.delete)
router.post('/deletemany',categoryController.deleteMany)


module.exports=router

