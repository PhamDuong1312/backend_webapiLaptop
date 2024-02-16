const express=require('express')
const multer  = require('multer')
const blogController = require('../apps/controllers/BlogController')
const config = require('config')
const PaginationMiddleware=require('../apps/middleware/PaginationMiddleware')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,config.app.static_folder+"/images/blogs")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage: storage })

const router = express.Router()

router.get('/',PaginationMiddleware,blogController.index)
router.get('/:id',blogController.getDetail)
router.post('/create',upload.single('image'),blogController.create)
router.put('/edit/:id',upload.single('image'),blogController.edit)
router.delete('/delete/:id',blogController.delete)
router.post('/deletemany',blogController.deleteMany)




module.exports=router