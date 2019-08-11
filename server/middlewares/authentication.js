const {verifyToken} = require('../helpers/jwt')

module.exports = {
  authentication(req, res, next){
    if (req.headers.token){
      try{
        let decode = verifyToken(req.headers.token)
        req.decode = decode
        next()
      }
      catch (err) {
        next({status:401, message: "invalid token", err:err})
      }
    }
    else{
      next({status:401, message: "please login first"})
    }
  }
}