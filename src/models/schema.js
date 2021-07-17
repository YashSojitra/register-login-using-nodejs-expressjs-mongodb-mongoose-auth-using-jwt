const mongoose = require('mongoose');

//creating Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    repassword: {
        type: String,
        required: true
    }

})

//creating model using schema
const userCollection = new mongoose.model('user',userSchema);
module.exports = userCollection;
