const jwt = require('jsonwebtoken');

const protectAuth=async(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                message:"No token.Please login first"
            });
        }
        const token = authHeader.split(" ")[1];

        // verify token using  secret key
        const decoded=jwt.verify(token,process.env.SECRET_KEY)

        //attach decoded data to req  to controller can use it 
        req.user=decoded;
        next();
    }catch(error){
        return res.status(500).json({
            message:"Server error",
            error:error.message
        })
    }
}
module.exports = {protectAuth};