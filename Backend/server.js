const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);



require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const morgan=require('morgan');
PORT =process.env.PORT || 5000;
const connectDB=require('./config/db');

//import routes file
 const authRoutes=require('./routes/authRoutes');
 const productRoutes = require('./routes/productRoutes');
 const cartRoutes=require('./routes/cartRoutes');
 const orderRoutes=require('./routes/orderRoutes');
//connect db
connectDB();


//global middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


//routes
app.use('/',authRoutes);
app.use('/products',productRoutes);
app.use('/cart',cartRoutes);
app.use('/order',orderRoutes);

app.get('/',(req,res)=>{
    res.send('KLE Ecommerce Backend is Running');
});
app.listen(PORT,()=>{
    console.log(`Server is connected to port ${PORT}`)
})
