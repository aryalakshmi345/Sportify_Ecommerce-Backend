const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'userModel'
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'productModel'
            },
            count:{
               type:Number,
               required:true 
            }
        }
    ]
})

const cartModel=mongoose.model('cartModel',cartSchema)
module.exports=cartModel

