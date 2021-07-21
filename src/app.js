const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 8000;
const validator = require('validator');
const userCollection = require("./models/schema");
require("./db/dbConnection");
const bcrypt = require('bcryptjs');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'../templates/views'));
hbs.registerPartials(path.join(__dirname,'../templates/partials'));

//routing

// dealing with get requests
app.get('/', (req, res) => {
    res.render('index.hbs',{
        user: false,
        register: "/register",
        login: "/login"
    });
})

app.get('/register', (req, res) => {
    res.render('register.hbs',{
        user: false,
        register: "/register",
        login: "/login"
    });
})

app.get('/login', (req, res) => {
    res.render('login.hbs',{
        user: false,
        register: "/register",
        login: "/login"
    });
})

app.get('/secret', (req, res) => {
    res.render('secret.hbs',{
        user: true,
        register: "/register",
        login: "/login"
    });
})

app.get('/logout', (req, res) => {
    res.redirect('/');
})

//dealing with post requests

//registeration of the user
app.post('/register', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const repassword = req.body.repassword;

        // console.log(`email: ${email}  password: ${password}`);
        if(!(validator.isEmail(email))){
            res.status(400).send("Enter Valid Email");
        }
        if(password !== repassword){
            res.status(400).send("Passwords must be same!!");
        }
        else{
            const registerUser = new userCollection({
                email, password
            }) ;
            
            const userRegistered = await registerUser.save();
            // console.log(`the page part: ${userRegistered}`);
            res.status(201).render('secret.hbs');
        }
        
    } catch (err) {
        console.log(err);
    }
})

//login activity of the user
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const dbUserData = await userCollection.findOne({email});

        if(dbUserData === null) {
            res.status(400).send("User not found");
        }
        else{
            if(dbUserData.password === password){
                res.status(200).render('secret.hbs');
            }
            else{
                res.status(400).send("Invalid Login Details");
            }
        }

    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`------Listening to the port ${port}------`);
})