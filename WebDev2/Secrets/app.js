require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const  encrypt = require('mongoose-encryption');

const app = express();

const port = (process.env.PORT || 3000);

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

/************************************* GET METHODS *************************** */
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/login", function(req, res) {
    res.render("login");
});


/*************************************** POST METHODS ****************************/

app.post("/register", function(req, res) {
    const userMail = req.body.email;
    const userPass = req.body.password;

    const newUser = new User( {
        email: userMail,
        password: userPass
    });

    newUser.save(function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Registration successful");
            res.render("secrets");
        }
    });
});

app.post("/login", function (req, res) {
    const userMail = req.body.email;
    const userPass = req.body.password;

    User.findOne({email: userMail}, function(err, foundUser){
        if(err) {
            console.log(err);
        } else{
            if(foundUser) {
                if(foundUser.password === userPass) {
                    res.render("secrets");
                }
                else{
                    console.log("Incorrect password");
                }
            }
            else {
                console.log("Email does not exists. Register");
            }
        }
    })
})


app.listen(port, function(req, res) {
    console.log("Server is listening to port " + port);
});