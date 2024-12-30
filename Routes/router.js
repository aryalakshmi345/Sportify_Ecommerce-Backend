const express = require('express')


const router = new express.Router()

const userControler=require('../Controllers/userControler')
const jwtMiddleware = require('../middleware/Jwtmiddleware')
const AdminMiddleware = require('../middleware/Adminmiddleware')
const multerconfig = require('../middleware/Multermiddleware')
const productControler = require('../Controllers/productControler')
const cartControler=require('../Controllers/cartControler')
const { payementController } = require('../Controllers/orderControler')
const orderControler=require('../Controllers/orderControler')
router.post('/register',userControler.register)

// verify otp
router.post('/verify-otp',userControler.otpverification)
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

//get product by id
router.get('/getproductdetails/:id',productControler.getProductDetails)

// add to cart
router.post('/addtocart/:userId',jwtMiddleware,cartControler.addToCart)

// get products from cart
router.get('/get-product-from-cart/:userId',jwtMiddleware,cartControler.getCartProducts)

// get all products
router.get('/getallproducts', productControler.getAllProducts);

// delete from cart
router.delete('/deletefromcart/:productId',jwtMiddleware,cartControler.deleteCartProducts)

// resend otp from cart
router.post('/resend-otp',userControler.otpresend)

// google sign in
router.post('/googlesignin',userControler.googleSignIn)

// order pay
router.post('/orderpay',jwtMiddleware,orderControler.payementController)

// place order
router.post('/placeorder',jwtMiddleware,orderControler.OrderPayment)

// get orders
router.get('/get-orders',jwtMiddleware,orderControler.getOrders)

// invoice genaration
router.post('/invoicegenarated',jwtMiddleware,orderControler.pdfGenarition)

// Forgot Password
router.post('/forgotpassword', userControler.forgotPassword);

// Update Password
router.put('/updatepassword', userControler.updatePassword);

// review
router.put('/review',jwtMiddleware,productControler.review);

// send feedback
router.post('/feedback',jwtMiddleware,productControler.sendFeedbackEmail);

// get all users for admin
router.get('/admin-users',jwtMiddleware,AdminMiddleware,userControler.getAllusers)

// get all orders by admin
router.get('/admin-orders',jwtMiddleware,AdminMiddleware,orderControler.getAllOrders)

module.exports=router