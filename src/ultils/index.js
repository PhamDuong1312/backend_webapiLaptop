const nodemailer = require('nodemailer');
const config = require('config')

const sendMail= async (email,title,html)=>{
    const transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:config.app.email_user,
            pass:config.app.email_password
        }
    })

    const data={
        from:"Website LAPTOP",
        to:email,
        subject:title,
        html:html
    }

    const result =await transport.sendMail(data)
    return result
}

module.exports =sendMail

