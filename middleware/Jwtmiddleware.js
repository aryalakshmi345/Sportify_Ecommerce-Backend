const jwt=require('jsonwebtoken')

    const jwtMiddleware=(req,res,next)=>{

        try{
            const token=req.headers['authorization'].split(' ')[1]
            const jwtResponse=jwt.verify(token,'supersecretkey')
            req.payload=jwtResponse.id
            next()
        }catch(err){
            res.status(401).send('Authorization failed....plese login')
        }
    }
    
    module.exports=jwtMiddleware