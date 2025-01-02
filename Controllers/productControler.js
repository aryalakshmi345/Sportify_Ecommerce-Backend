const req = require("express/lib/request");
const AdminMiddleware = require("../middleware/Adminmiddleware");
const jwtMiddleware = require("../middleware/Jwtmiddleware");
const productModel = require("../models/productModel");
const router = require("../Routes/router");
const nodemailer = require('nodemailer');
const userModel = require("../models/userModel");

// const userModel = require('../models/usermodel')

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

// get all products
exports.getAllProducts = async (req, res) => {
    const searchkey=req.query.search
    console.log(searchkey);
    

    const query={
        $or:[
            {name:{$regex:searchkey,$options:"i"}},
            {category:{$regex:searchkey,$options:"i"}},
            {brand:{$regex:searchkey,$options:"i"}},
            {material:{$regex:searchkey,$options:"i"}}

        ]
    }
    try {
        const products = await productModel.find(query); 
        res.status(200).json(products); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error....');
    }
};


// get product 
exports.getProductDetails=async(req,res)=>{
    const {id}=req.params

    try{
        const productDetails=await productModel.findById(id)
        res.status(200).send(productDetails)
    }catch(err){
        res.status(500).send('internal server Error.....')
        console.log(err);
        
    }

}
// exports.review = async (req, res) => {
//     const { review, productid } = req.body;
//     const id = req.payload; // Assuming payload is set by middleware and contains user ID

//     try {
//         // Fetch user details from the database
//         const userDetails = await userModel.findById(id);

//         // Fetch product details from the database
//         const product = await productModel.findById(productid);

//         // Add the review to the product's reviews array
//         product.reviews.push({ review, username: userDetails.firstname });

//         // Save the updated product with the new review
//         await product.save();

//         // Return the updated product in the response
//         res.status(200).send(product);

//     } catch (error) {
//         res.status(500).send({ message: "Internal server error" });
//         console.log(error);
//     }
// };
exports.review = async (req, res) => {
    const { review, rating, productid } = req.body; // Get review, rating, and productid from the body
    const id = req.payload; // User ID from the payload

    try {
        // Fetch user details
        const userDetails = await userModel.findById(id);

        // Fetch product details
        const product = await productModel.findById(productid);

        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Validate rating (should be between 1 and 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ message: 'Rating must be between 1 and 5' });
        }

        // Add the review with the rating to the product
        product.reviews.push({
            review,
            rating, // Store rating alongside the review
            username: userDetails.firstname,
        });

        // Save the updated product
        await product.save();

        res.status(200).send(product); // Return the updated product
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
        console.error(error);
    }
};
// Send Feedback

exports.sendFeedbackEmail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: email,
        to: 'sportifyhub403@gmail.com',
        subject: `Feedback from ${name}`,
        html: `
            <h3>New Feedback Received</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Feedback sent successfully' });
    } catch (error) {
        console.error('Error sending feedback:', error);
        res.status(500).send({ message: 'Failed to send feedback' });
    }
};
