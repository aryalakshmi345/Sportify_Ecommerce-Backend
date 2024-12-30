const cartModel = require("../models/cartModel")

exports.addToCart=async(req,res)=>{
    const{id,count}=req.body
    const {userId}=req.params
 

    try{
        const existingUser=await cartModel.findOne({userId})
        if(existingUser){
            const product = existingUser.products.find(p=>p.productId == id)
            // console.log(product);
            
            if(product){
                product.count +=1
            }else{
                existingUser.products.push({productId:id,count})
            }
            await existingUser.save()
            res.status(200).send({message:"Product added to cart...",existingUser})
        }else{
            const cartData=  new cartModel({
                userId,
                products:{productId:id,count}
            })
            await cartData.save()
            res.status(200).send("Product added to cart")
        }  
    }catch(err){
        res.status(500).send("Internal server error...")
        console.log(err);
        
    }
}


exports.getCartProducts=async(req,res)=>{
    const {userId}=req.params

    try{
        const products=await cartModel.findOne({userId}).populate('products.productId','name image price')
        console.log(products);
        if(!products){
           return res.status(404).send("Cart not found....")
        
        }
        res.status(200).send(products)
        
    }catch(error){
        res.status(500).send("Internal Server Error....")
        console.log(error);
    }
}
// delete cart
exports.deleteCartProducts=async(req,res)=>{
    const userid = req.payload
    
    const {productId}=req.params

    try{
        const cartData = await cartModel.findOne({userId:userid})
        
        if (!cartData) {
            return res.status(404).send({ message: "Cart not found for this user." });
        }
        cartData.products = cartData.products.filter((p)=>p.productId!=productId)
        await cartData.save()
        res.status(200).send({message:"Item removed from cart",cartData})
    }catch(error){
        res.status(500).send("Internal server error....")
        console.log(error);
        
    }
}