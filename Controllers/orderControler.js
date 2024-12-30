const Razorpay = require("razorpay")
const paymentModel = require("../models/payModel")
const PDFDocument = require('pdfkit');

exports.payementController=async(req,res)=>{
    const {amount}=req.body

    try {
        const razorpay=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const Option={
            amount,
            currency:'INR'
        }
        const response= await razorpay.orders.create(Option)
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send("internal server Error...")
        console.log(error);
    }
}
// order

exports.OrderPayment=async(req,res)=>{
    const userID=req.payload
    const{
        productID,
        ShippingAddress,
        City,
        State,
        Pincod,
        phoneNumber,
        PaymentID,
        amount
    }=req.body
    if(!userID || !productID || !ShippingAddress || !City || !State || !Pincod || !phoneNumber || !PaymentID){
        res.status(400).send({message:'fill out all feilds...'})
    }
    try {
        const newpayment=new paymentModel({
            userID,
            productID,
            ShippingAddress,
            City,
            State,
            Pincod,
            phoneNumber,
            PaymentID,
            Amount:amount
        })
        const savedPayment=await newpayment.save()
        res.status(200).send(savedPayment)
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to place order"});
    }
}
// get order
exports.getOrders=async(req,res)=>{
    const userID=req.payload
    

    try{
        const orders=await paymentModel.find({userID}).populate('productID','name image')
        if(!orders||orders.length===0){
            return res.status(404).send({ message: "orders not found" });
        }
        res.status(200).send(orders)
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

exports.pdfGenarition=async(req,res)=>{
    const{id} =req.body

    const orderDetails=await paymentModel.findById(id).populate('userID','email')

      try {
        // Generate PDF in memory using PDFKit
        const doc = new PDFDocument();
          
        // Set response headers to indicate file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=receipt-${id}.pdf`);
    
        // Pipe the PDF directly to the response
        doc.pipe(res);
    
        // Add content to the PDF
        doc.fontSize(20).text('Payment Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Payment ID: ${orderDetails.PaymentID}`);
        doc.text(`Order ID: ${orderDetails._id}`);
        doc.text(`Amount: ₹${orderDetails.Amount / 100}`); // Razorpay stores amount in paise
        doc.text(`Status: ${orderDetails.Status}`);
        doc.text(`Email: ${orderDetails.userID.email}`);
        doc.text(`ShippingAddress: ${orderDetails.ShippingAddress}`);
        doc.text(`phoneNumber: ${orderDetails.phoneNumber}`);
        doc.text(`Date: ${orderDetails.Date}`);
  
    
        // Finalize the PDF and end the stream
        doc.end();
      } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).send('Error fetching payment details');

      }

}
// get allorders by admin
// Get all orders (Admin Access)
exports.getAllOrders = async (req, res) => {
    try {
        // Fetch all orders and populate related fields
        const orders = await paymentModel.find().populate('productID', 'name image').populate('userID', 'firstname lastname email');
        
        if (!orders || orders.length === 0) {
            return res.status(404).send({ message: "No orders found" });
        }

        res.status(200).send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
