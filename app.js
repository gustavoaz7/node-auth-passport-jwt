const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const passportJwt = require('passport-jwt')
// ===
const jwtStrategy = passportJwt.Strategy
const jwtExtract = passportJwt.ExtractJwt
const configDB = require('./config/db')
const User = require('./models/user')

// Database 
mongoose.connect(configDB.url, { useMongoClient: true })
  .then(() => console.log('Database connected successfully.'))
  .catch(err => console.log('Error connecting to database: ' + err.message))
  // tell Mongoose to use Node global es6 Promises
mongoose.Promise = global.Promise;

// Config
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
  // Passport
app.use(passport.initialize())
  // CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

// Routes
app.get('/', (req, res) => {
  res.send('Home page')
})

const api = require('./routes/api')
app.use('/api', api)



app.listen(2323, () => {
  console.log('Server is up and running...');
})