const mongoose = require('mongoose')
const mongoURI = 'mongodb://127.0.0.1:27017/inotebook'

const connectToMongo = async() =>{
    await mongoose.connect(mongoURI)
    console.log("connected to mongo successfully")

} 
// ()=>{
//     console.log("connected to mongo successfully")    MONGOOSE.CONNECT  NO LONGER ACCEPTS A CALLBACK FUNCTION
//  } 
module.exports = connectToMongo 