const nodemailer = require('nodemailer')

//forgot password
const forgotpassword = async(email,link,firstname,secondname)=>{
    try {
        const transporter = nodemailer.createTransport({
                 service:'Gmail',
                 auth:{
                     user: process.env.EMAIL,
                     pass: process.env.PASSWORD
                 }
             })
         
             const mailoptions = {
                 from: process.env.EMAIL,
                 to:email,
                 subject:'Reset Your Password ',
                 html:`<p>Hi ${firstname} ${secondname}
                 Reset Your Account Password ${link}</p>`
             }
         transporter.sendMail(mailoptions,(err,info)=>{
           if(err)
            return err 
         })
    } catch (error) {
        console.log(error);
        throw err
    }
}
 module.exports = forgotpassword