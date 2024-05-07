const express = require('express')
const authController = require('../apps/controllers/AuthController')
const passport = require('passport')

const router = express.Router()

router.post('/login', authController.login)
router.post('/getcode', authController.getcode)
router.put('/changepassword', authController.changePassword)
router.put('/changepasswordnext', authController.changePasswordNext)

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {
        // Successful authentication, redirect home.
        return res.redirect(`http://localhost:3000/login?id=${req.user.id}`)
    });
router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/redirect',
    passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
    function (req, res) {
        // Successful authentication, redirect home.
        return res.redirect(`http://localhost:3000/login?id=${req.user.id}`)


    });




module.exports = router

