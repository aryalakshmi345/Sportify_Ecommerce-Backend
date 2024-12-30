const mongoose=require('mongoose')
const { review } = require('../Controllers/productControler')

const productSchema=new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    category:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    
    description:{
        required:true,
        type:String
    },
    image:{
        required:true,
        type:String
    },
    brand:{
        required:true,
        type:String
    },
    material:{
        required:true,
        type:String
    },
    reviews:[
        {
            review:{
                type:String
            },
            username:{
                type:String
            },
            rating:{
                type:String
            }
        }
    ]
})


const productModel=mongoose.model('productModel',productSchema)
module.exports=productModel