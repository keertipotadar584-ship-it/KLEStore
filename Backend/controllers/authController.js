const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {User}=require('../Model/User')

//register user controller

const register=async(req,res)=>{
    try{
        let {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({
        message:"All fields are Required"
    })
}
// check if user is already register
const existingUser=await User.findOne({email})

if(existingUser){
    return res.status(400).json({
        message:"User already Registered"
    })
}
// hash password
const hashedPassword=bcrypt.hashSync(password,10);

//generate jwt token
const token=jwt.sign({email},process.env.SECRET_KEY,{expiresIn:'365d'})

//save user data
await User.create({
    name,
    email,
    password:hashedPassword,
    token,
    role:'user'
})
return res.status(200).json({
    message:"Register successfully"
})
    }catch(error){
        return res.status(500).json({
            message:"Server error",
            error:error.message
        })
    }
}
//login controller
const login=async(req,res)=>{
    try{
        let {email,password}=req.body;
        
        if(!email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        //check user exist or not 

        const user=await User.findOne({email});
        if(!user){           
             return res.status(400).json({
                message:"User not found,please register first"
             })
            }
            //compare password
            const isMatch=bcrypt.compareSync(password,user.password)
            if(!isMatch){
                return res.status(400).json({
                    message:"Invalid Password"
                })
            }
            //return user info and token in frontend
            return res.status(200).json({
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:user.token
            })

    }catch(error){
        return res.status(500).json({
         message:"Server error",
         error:error.message
            })
    }
}
module.exports={register,login}