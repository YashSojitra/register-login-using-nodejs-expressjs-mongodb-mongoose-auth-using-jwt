require('dotenv').config;
const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/register-login-local";

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("------connected to db------");
}).catch((err) => {
    console.log(`db error: ${err}`);
})