const mongoose = require("mongoose")
require("dotenv").config()

const connectToDB = async ()=>{
    try{
        console.log("Mongoose connecting to MongoDB....");
        const connection = await mongoose.connect(process.env.MONGO_URI);
    }
    catch(error){
        console.log(`Error encountered : ${error.message}`);
        process.exit();
    }
}

// Event listeners for connection status
mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected to the database 🚀');
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error 😢: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose is disconnected 😴');
});

module.exports = connectToDB;