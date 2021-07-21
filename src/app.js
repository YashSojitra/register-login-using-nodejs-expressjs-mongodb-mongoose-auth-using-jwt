const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 8000;
const validator = require('validator');
const userCollection = require("./models/schema");
require("./db/dbConnection");
const bcrypt = require('bcryptjs');
const auth = require("./middleware/auth");
const cookieParser = require('cookie-parser');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

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

app.get('/secret', auth, (req, res) => {
    res.render('secret.hbs',{
        user: true,
        register: "/register",
        login: "/login"
    });
})

//logout request
app.get('/logout',auth,async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token !== req.token;      //filtering tokens which are not equal to cookie token
        })
        res.clearCookie("tkn");
        await req.user.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
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

            //generating token
            const token = await registerUser.generateToken();

            //generating cookie
            res.cookie("tkn", token, { 
                expires: new Date(Date.now() + 1000000),
                httpOnly: true});

            await registerUser.save();
            // console.log(`the page part: ${userRegistered}`);
            res.status(201).redirect('/secret');
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
            const isPassMatching = await bcrypt.compare(password, dbUserData.password);

            if(isPassMatching){
                //creating jwt 
                const token = await dbUserData.generateToken();

                //generating cookie
                res.cookie("tkn", token, { 
                    expires: new Date(Date.now() + 1000000),
                    httpOnly: true});

                res.status(200).redirect('/secret');
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