const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    firstname:{
        required:true,
        type:String
    },
    secondname:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        type:String
    },
    phonenumber:{
        type:Number
    },
    profilepicture:{
        type:String
    },
    role:{
        type:String,
        default:0
    },
    otpexpires:{
        type:Date
    },
    isverifed:{
        required:true,
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    }
})

const usermodel=mongoose.model('usermodel',userSchema)

module.exports=usermodel
