require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

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
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]

})

//hashing password
userSchema.pre("save", async function(){
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);   
    }
});

//generating token
userSchema.methods.generateToken = async function(){
    try {
        //here this represents instance of collection
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY ); //creating token
        this.tokens = this.tokens.concat({token: token}); //tokens is array of objects, so concatinating token object into array
        await this.save(); //saving into db
        return token;
    } catch (error) {
        console.log(`error in generating token : ${error}`);
    }
}

//creating model(collection) using schema
const userCollection = new mongoose.model('users',userSchema);
module.exports = userCollection;
