// jshint esversion:6
// jscs:disable maximumLineLength

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encryption = require('mongoose-encryption');
const port = 3000;
const app = express();

// telling our application to use body-parser for getting the inputs from post request in our HTML form
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing application/json
app.use(bodyParser.json());

// giving the public folder a global access which contains css, favicons, images, and js files
app.use(express.static('public'));

// telling application to use ejs as our view engine
app.set('view engine', 'ejs');

app.listen(port, () => console.log('SecretsApp listening at http://localhost:' + port));

// connect to mongoDB Database
mongoose.connect('mongodb://localhost:27017/userAuthDB', { useUnifiedTopology: true, useNewUrlParser: true });

// creating schema or blueprint of the Database
const userAuthSchema = new mongoose.Schema({
  userEmail:  {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
});

// defining encryption
userAuthSchema.plugin(encryption, { secret: process.env.SECRET, encryptedFields: ['userPassword'] });

// creating Model (or collection (Act as a table)) for the Database
const UserAuth = mongoose.model('UserAuth', userAuthSchema);

// home route
app.get('/', (req, res) => {
  res.render('home');
});

// login route
app.get('/login', (req, res) => {
  res.render('login');
});

// register route
app.get('/register', (req, res) => {
  res.render('register');
});

// create userAuthDB when user click on register button
app.post('/register', (req, res) => {
  const newUser = new UserAuth({
    userEmail: req.body.username,
    userPassword: req.body.password,
  });

  newUser.save((err) => {
    if (!err) {
      res.render('secrets');
    } else {
      console.log('post(/resgister): err -> ', err);
    }
  });
});

// login post request
app.post('/login', (req, res) => {
  UserAuth.findOne({ userEmail: req.body.username }, (err, userFound) => {
    if (userFound) {
      if (!err) {
        if (userFound.userPassword === req.body.password) {
          console.log('Login successful...');
          res.render('secrets');
        } else {
          console.log('Incorrect Password...');
        }

      } else {
        console.log('post(/login): err -> ', err);
      }
    } else {
      console.log('User does not exists...');
    }
  });
});

// submit a secret
app.get('/submit', (req, res) => {
  res.render('submit');
});

// submit secret post request
app.post('/submit', (req, res) => {

});
