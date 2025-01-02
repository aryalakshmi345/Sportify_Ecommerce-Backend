const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { default: axios } = require('axios');
const forgotpassword = require('../helpers/forgotpassword');
const userModel = require('../models/userModel');

//signup register

exports.register = async(req,res)=>{
    const{fname,sname,email,password}=req.body

    if(!fname || !sname || !email || !password){
        res.status(400).send("plese fill the form")
    }else{
        try{
            const existingUser = await userModel.findOne({email})
            if(existingUser){
                res.status(409).send({message:'Already registered..please login'})
            }else{
                const saltRounds=10
                const hashpassword=await bcrypt.hash(password,saltRounds)
                const otp=otpGenerator.generate(6, {digits:true,lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
                const otpexpires=new Date(Date.now()+2*60*1000)

                const newUser =  new userModel({
                    firstname:fname,secondname:sname,email,password:hashpassword,phonenumber:'',profilepicture:'',otpexpires,otp
                })
                await newUser.save()

                await otpSending(email,otp)
                res.status(200).send({message:'new user added',newUser})
            }
        }catch(err){
            res.status(500).send("Internal Server Error")
            console.log(err);
        }
    }
}

// otp verification

exports.otpverification=async(req,res)=>{
    const{email,otp}=req.body
    
    try{
        if(!email || !otp){
            return res.status(400).send({message:'invalid email and otp'})
        }
        const existingUser=await userModel.findOne({email})

        if(!existingUser){
            return res.status(404).send({message:'user not found'})
        }
        if(existingUser.otp!=otp){
            return res.status(400).send({message:'otp is invalid'})
        }
        const date = new Date(Date.now())
        if(existingUser.otpexpires<date){
            return res.status(410).send({message:'time expired'})
        }
        existingUser.isverifed = true
        existingUser.otp = null
        existingUser.otpexpires = null
         await existingUser.save()
         res.status(200).send({message:'Account verified..'})
    }
    catch(err){
        res.status(500).send("Internal Server Error")
        console.log(err);
    }
}

//login register

exports.login=async(req,res)=>{
    const{email,password}=req.body
    
    try{
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            const result=await bcrypt.compare(password,existingUser.password)
            if(result){
                const token=jwt.sign({id:existingUser._id},'supersecretkey')
                res.status(200).send({token,existingUser})
            }else{
                res.status(404).send({message:'incorrect email or password'})
            }
        }else{
            res.status(404).send('Account not found')
        }
    }catch(err){
        res.status(500).send('internal server error')
        log(err)
    }
}
// otp resend
exports.otpresend=async(req,res)=>{
    const {email}=req.body

    try{
        const existingUser=await usermodel.findOne({email})
        if(!existingUser){
            return res.status(404).send({message:'user not found'})
        }
        const date = new Date(Date.now())
        if(existingUser.otpexpires>date){
            return res.status(400).send({message:'otp is still valid'})
        }
        const newotp=otpGenerator.generate(6, {digits:true,lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
                const otpexpires=new Date(Date.now()+2*60*1000)
                existingUser.otp = newotp
                existingUser.otpexpires = otpexpires
                await existingUser.save()
                await otpSending(email,newotp)
                res.status(200).send("New otp generated...")
    }catch(err){
        res.status(500).send("internal server error....")
        console.log(err);
    }
}
// google sign in
exports.googleSignIn=async(req,res)=>{
    const {googleToken}=req.body
    try{
        if(!googleToken){
            return res.status(400).send({message:"Token is required"})
        }
        const response=await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`)
        if(response.data.aud !=process.env.CLIENT_ID){
            return res.status(402).send("invalid Token....")
        }
        const fname=response.data.given_name
        const sname=response.data.family_name
        const email=response.data.email
        const profilepicture=response.data.picture

        const existingUser = await userModel.findOne({email})

        if(!existingUser){
            const newUser =  new userModel({
                firstname:fname,secondname:sname,email,password:"",phonenumber:'',profilepicture:profilepicture,otpexpires:'',otp:'',isverifed:true
            })
            await newUser.save()
            const token=jwt.sign({id:newUser._id},'supersecretkey')
            return res.status(200).send({token,user:newUser})
        }
        const token =jwt.sign({id:existingUser._id},'supersecretkey')
        res.status(200).send({token,user:existingUser})
    }catch(error){
        res.status(500).send("internal server Error...")
        console.log(error);
    }
}
// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(req.body);

    try {

        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).send({ message: 'Account not found' });
        }

        const token = jwt.sign({ id: existingUser._id }, 'supersecretkey', { expiresIn: '30m' });
        const baseURL = process.env.BASE_URL;
        const resetLink = `${baseURL}/resetpassword/${token}`;

        await forgotpassword(email, resetLink, existingUser.firstname, existingUser.secondname);

        res.status(200).send({ message: 'Reset link sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
// update passwordsss
exports.updatePassword = async (req, res) => {
    const { token, Password } = req.body;
  
    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, 'supersecretkey');
  
      // Find the user by ID
      const existingUser = await userModel.findById(decodedToken.id);
  
      if (!existingUser) {
        return res.status(404).send('User not found');
      } else {
        // Hash the new password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(Password, saltRounds);
        existingUser.password = hashPassword;
  
        // Save the updated user
        await existingUser.save();
  
        res.status(200).send('Password changed, now you can login...');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  };
//   get all users for admin
  exports.getAllusers=async(req,res)=>{
    try{
        const response=await userModel.find({role:{$ne:1}})
        res.status(200).send(response)

    }catch(error){
        res.status(500).send("Internal Server Error")
		console.log(error)
    }
  }