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
        required:true,
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
    }
})

const userModel=mongoose.model('userModel',userSchema)

module.exports=userModel
