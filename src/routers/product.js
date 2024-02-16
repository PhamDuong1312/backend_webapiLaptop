const express=require('express')
const multer  = require('multer')
const productController = require('../apps/controllers/ProductController')
const config = require('config')
const PaginationMiddleware=require('../apps/middleware/PaginationMiddleware')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,config.app.static_folder+"/images")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage: storage })

const router = express.Router()

router.get('/',PaginationMiddleware,productController.index)
router.get('/hot',PaginationMiddleware,productController.productHot)

router.get('/category/:id',PaginationMiddleware,productController.getproductCategory)

router.get('/:id',productController.getDetail)
router.post('/create',upload.single('image'),productController.create)
router.put('/edit/:id',upload.single('image'),productController.edit)
router.delete('/delete/:id',productController.delete)
router.post('/deletemany',productController.deleteMany)




module.exports=router