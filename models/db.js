const mongoose = require("mongoose");
const connect = mongoose.connect('mongodb://localhost:27017/patasseguras_db');

connect.then(() => {
    console.log("Connected successfully to server");
}).catch(() =>{
    console.log("Error connecting to server");
})
 //Schema ↓
 const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
 });

 //collection part ↓
 const collection = mongoose.model('users', loginSchema);

 module.exports = collection;