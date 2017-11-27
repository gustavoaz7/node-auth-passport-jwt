const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')
require('../config/passport')(passport)
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const configDB = require('../config/db')

router.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password) return res.json({
    success: false,
    message: 'Please fill in all fields.'
  })
  const newUser = new User({
    username: req.body.username
  })
  newUser.password = newUser.generateHash(req.body.password)
  newUser.save((err) => {
    if (err) return res.json({
      success: false,
      message: 'Username already taken.'
    })
    res.json({
      success: true,
      message: 'User successfully created.'
    })
  })
})

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({
      success: false,
      message: 'User not found.'
    })
    if (!user.validPassword(req.body.password)) return res.json({
      success: false,
      message: 'Wrong password.'
    })
    //
    const payload = {
      id: user._id
    }
    const token = jwt.sign(payload, configDB.secret, {
      expiresIn: '1d'
    })
    return res.json({
      success: true,
      message: 'Here is your token',
      token: token
    })
  })
})

router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    return User.find({}, (err, allUsers) => {
      if (err) throw err;
      return res.json(allUsers)
    })
  }
  return res.json({
    success: false,
    message: 'No token provided.'
  })
})

function getToken(headers) {
  // Token from headers = 'JWT xxxxxxxxx.xxxxxxxxxxxxxxx.xxxxxxxxxxxxxx'
  return headers.authorization
}
module.exports = router