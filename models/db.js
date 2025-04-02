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

 const complaintSchema = new mongoose.Schema({
    whichComplaint: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    anonymous: {
        type: Boolean, //Quando o conteudo for checkbox, o tipo é boolean
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
 });
 //collection part ↓
 const collection = mongoose.model('users', loginSchema);
 const collection2 = mongoose.model('complaint', complaintSchema);
 module.exports = { collection, collection2};