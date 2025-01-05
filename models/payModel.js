const mongoose=require("mongoose")

const paymentSchema=new mongoose.Schema({
    userID:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'usermodel'
    },
    productID:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'productModel'
    },
    ShippingAddress:{
        required:true,
        type:String
    },
    City:{
        required:true,
        type:String
    },
    State:{
        required:true,
        type:String
    },
    Pincod:{
        requried:true,
        type:String
    },
    phoneNumber:{
        required:true,
        type:Number
    },
    PaymentID:{
        requried:true,
        type:String
    },
    Date:{
        required:true,
        type:Date,
        default:Date.now()
    },
    Status:{
        required:true,
        type:String,
        default:'pending'
    },
    Amount:{
        required:true,
        type:Number
    }
})

const paymentModel=mongoose.model('paymentModel',paymentSchema)
module.exports=paymentModel