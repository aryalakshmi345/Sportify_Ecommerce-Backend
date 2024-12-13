const express = require('express')


const router = new express.Router()

const userControler=require('../Controllers/userControler')
const jwtMiddleware = require('../middleware/Jwtmiddleware')
const AdminMiddleware = require('../middleware/Adminmiddleware')
const multerconfig = require('../middleware/Multermiddleware')
const productControler = require('../Controllers/productControler')


router.post('/register',userControler.register)
//login
router.post('/login',userControler.login)

router.post('/addproduct',jwtMiddleware,AdminMiddleware,multerconfig.single('productImage'),productControler.addproduct)

//get products
router.get('/getproduct',jwtMiddleware,AdminMiddleware,productControler.getproduct)

router.delete('/deleteproduct/:id',jwtMiddleware,AdminMiddleware,productControler.deleteProduct)

// edit product
router.put('/editproduct/:id',jwtMiddleware, AdminMiddleware,multerconfig.single('productImage'), productControler.editProduct);

//get product by catagory
router.get('/get-products/:category',productControler.getCategory)

module.exports=router