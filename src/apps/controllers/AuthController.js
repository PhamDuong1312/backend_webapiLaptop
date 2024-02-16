const User = require('../models/user')
const sendMail = require('../../ultils/index')

const AuthController = {
    // [POST] api/login
    login:(req, res, next) => {
        User.findOne({
            email: req.body.email,
            password: req.body.password
        }).then((user) => {
            res.status(200).json({
                status:"success",
                user: user
            })
        })
        .catch(()=>{
            res.status(200).json({
                status:"failed",
                user: {}
            })
        })
    },
    //[POST] api/getcode
    getcode:(req, res, next) => {
        let code =Math.round(Math.random()*1000000)
        console.log(code);
        if(code<100000){
            code=code+100000
        }
        const title = "MÃ LẤY LẠI MẬT KHẨU SHOP PHẠM DƯƠNG"
        const html=`<p>Xin chào.<p>
                    <p>Đây là mã để lấy lại mật khẩu của bạn vui lòng không chia sẻ mã.Mã xác nhận là : <span style="color:red">${code}<span></p>
                    <p>Trân trọng!</p>
                    `

        sendMail(req.body.email,title,html)
        res.json({code,email:req.body.email})
        
    },
    //[PUT] api/changepassword
    changePassword:async(req,res,next) => {
        const user=await User.findOne({email:req.body.email})
        if(user) {
            User.updateOne({email:req.body.email},{password:req.body.password})
                .then(()=>{
                    res.json({success:true})
                })
        }else{
            res.json({success:false})

        }

    },
    //[PUT] api/changepasswordnext
    changePasswordNext:async(req,res,next) => {
        const user=await User.findOne({email:req.body.email,password:req.body.password})
        if(user) {
            User.updateOne({email:req.body.email,password:req.body.password},{password:req.body.newPassword})
                .then(()=>{
                    res.json({success:true})
                })
        }else{
            res.json({success:false})

        }

    }
}

module.exports = AuthController