const express=require('express')
const authController = require('../apps/controllers/AuthController')

const router = express.Router()

router.post('/login',authController.login)
router.post('/getcode',authController.getcode)
router.put('/changepassword',authController.changePassword)
router.put('/changepasswordnext',authController.changePasswordNext)





module.exports=router

