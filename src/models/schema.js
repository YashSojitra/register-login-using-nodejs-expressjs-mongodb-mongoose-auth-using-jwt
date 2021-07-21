const mongoose = require('mongoose');

//creating Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

})

//creating model(collection) using schema
const userCollection = new mongoose.model('users',userSchema);
module.exports = userCollection;
