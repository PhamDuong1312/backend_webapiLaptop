const express=require('express')
const userController = require('../apps/controllers/UserController')
const PaginationMiddleware=require('../apps/middleware/PaginationMiddleware')

const router = express.Router()

router.get('/',PaginationMiddleware,userController.index)
router.get('/:id',userController.getDetail)
router.post('/create',userController.create)
router.put('/edit/:id',userController.edit)
router.delete('/delete/:id',userController.delete)
router.post('/deletemany',userController.deleteMany)




module.exports=router