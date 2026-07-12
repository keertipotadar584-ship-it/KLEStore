const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Database is connected");
    }catch(err){
        console.log("Database is not connected",err)
    }
}
module.exports=connectDB;