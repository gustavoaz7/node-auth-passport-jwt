const passportJwt = require('passport-jwt')
const jwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

const configDB = require('./db')
const User = require('../models/user')

module.exports = function(passport) {  
  passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: configDB.secret
  }, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.id }, (err, user) => {
      if (err) return done(err, false)
      if (!user) return done(null, false)
      return done(null, user)
    })
  }))
}