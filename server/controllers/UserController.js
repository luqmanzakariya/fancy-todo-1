const User = require('../models/User')
const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  static register(req, res, next) {
    let { name, email, password } = req.body
    User.create({ name, email, password })
      .then((user) => {
        res.status(201).json(user)
      })
      .catch(next)
  }

  static login(req, res, next) {
    User.findOne({
      email: req.body.email
    })
      .then((user) => {
        if (user) {
          if (comparePassword(req.body.password, user.password)) {
            let payload = {
              _id: user._id,
              name: user.name,
              email: user.email
            }
            let token = generateToken(payload)

            res.status(200).json({
              token,
              _id: user._id,
              name: user.name,
              email: user.email
            })
          }
          else {
            throw { code: 404, message: "wrong email/password" }
          }
        }
        else {
          throw { code: 404, message: "wrong email/password" }
        }
      })
      .catch(next)
  }

  static loginGoogle(req, res, next) {
    client.verifyIdToken({
      idToken: req.body.idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })
      .then((ticket) => {
        let { name, email } = ticket.getPayload()
        let password = process.env.PASSWORD_DEFAULT
        let input = { name, email, password }
        return Promise.all([User.findOne({ email: email }), input])
      })
      .then(([foundUser, input]) => {
        if (foundUser) {
          return foundUser
        }
        else {
          return User.create(input)
        }
      })
      .then((user) => {
        let payload = {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
        let token = generateToken(payload)

        res.status(201).json({
          token,
          _id: user._id,
          name: user.name,
          email: user.email
        })
      })
      .catch(next)
  }

  static findAll(req, res, next) {
    console.log('masuk controller user find all')
    User.find({ _id: { $nin: [req.params.id] } })
      .then((users)=>{
        res.status(200).json(users)
      })
      .catch(next)
  }
}

module.exports = UserController