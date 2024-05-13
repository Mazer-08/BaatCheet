const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async ()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected....");
    }
    catch(error){
        console.log(`Error encountered : ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;