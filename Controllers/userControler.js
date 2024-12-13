const bcrypt = require('bcrypt')
const userModel = require('../models/usermodel')
const jwt = require('jsonwebtoken');

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
                const newUser =  await new userModel({
                    firstname:fname,secondname:sname,email,password:hashpassword,phonenumber:'',profilepicture:''
                })
                newUser.save()
                res.status(200).send({message:'new user added',newUser})
            }
        }catch(err){
            res.status(500).send("Internal Server Error")
            console.log(err);
        }
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