const req = require("express/lib/request");
const AdminMiddleware = require("../middleware/Adminmiddleware");
const jwtMiddleware = require("../middleware/Jwtmiddleware");
const productModel = require("../models/productModel");
const router = require("../Routes/router");

exports.addproduct=async(req,res)=>{
    // console.log(req.fileValidationError);
    if(req.fileValidationError){
        return res.status(406).send('Only png or jpg......')
    }
    
            
    const {name,category,price,description,brand,material}=req.body
    const image=req.file.filename

   try {
     if(!name || !category || !price || !description || !brand || !material || !image){
         res.status(400).send({message:"please fill all the details..."})
     }else{
         const newProduct=new productModel({
             name,
             category,
             price,
             description,  
             image,
             brand,
             material
         })
         await newProduct.save()
         res.status(200).send({message:"Product added succesfully.."})
     }
   } catch (err) {
    res.status(500).send({message:"internalserver error"})
    console.log(err);
   }
}

// get product
exports.getproduct=async(req,res)=>{

    try{
        const products=await productModel.find()
        res.status(200).send({message:"product geted",products})
    }catch(err){
        res.status(500).send({message:"Internal server error"})
        console.log(err);
        
    }
}
// delete product
exports.deleteProduct=async(req,res)=>{
    const {id}=req.params

    try{
        const product=await productModel.findByIdAndDelete(id)
        res.status(200).send({message:"Producte Deleted succesfully"})
    }catch(error){
        res.status(500).send('internal Server Error')
        console.log(error);
        
    }
}
//edit product
exports.editProduct=async(req,res)=>{
    const{id}=req.params
    const {name,category,price,description,brand,material,image}=req.body
    const updatedimage=req.file?req.file.filename:image
    
    try{
        const updatedProduct=await productModel.findByIdAndUpdate(
            id,
            {
                name,
                category,
                price,
                description,  
                image:updatedimage,
                brand,
                material
            },
            {new:true}
        )
        res.status(200).send({message:"product Updated Succesfully ",updatedProduct})
    } catch (err) {
        res.status(500).send({ message: "Internal server error" });
    }
}

//get product by catagory
exports.getCategory=async(req,res)=>{
    const {category}=req.params

    try{
        const products=await productModel.find({category})
        res.status(200).send(products)

    }catch(err){
        res.status(500).send('Internal server error....')
        console.log(err);
        
    }
}