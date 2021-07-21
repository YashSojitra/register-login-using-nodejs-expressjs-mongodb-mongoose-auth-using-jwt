require('dotenv').config();
const jwt = require('jsonwebtoken');
const userCollection = require('../models/schema');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.tkn;

        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await userCollection.findOne({_id: verifyUser._id});
    
        req.token = token;//to use this value while doing logout
        req.user = user;//to use this value while doing logout
        next();
    } catch (error) {
        res.status(401).redirect('/login');
        console.log(error);
    }
}

module.exports = auth;