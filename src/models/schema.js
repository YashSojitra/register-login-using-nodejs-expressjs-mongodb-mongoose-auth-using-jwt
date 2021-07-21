const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

//hashing password
userSchema.pre("save", async function(){

    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);   
    }
});

//creating model(collection) using schema
const userCollection = new mongoose.model('users',userSchema);
module.exports = userCollection;
