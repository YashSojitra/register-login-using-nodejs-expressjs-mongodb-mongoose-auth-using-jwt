const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 8000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'../templates/views'));
hbs.registerPartials(path.join(__dirname,'../templates/partials'));

//routing
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

app.listen(port, () => {
    console.log(`------Listening to the port ${port}`);
})