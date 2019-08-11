const Todo = require('../models/Todo')
const Project = require('../models/Project')

module.exports = {
  authorization(req, res, next) {
    Todo.findById(req.params.id)
      .then((todo) => {
        if (todo.UserId == req.decode._id) {
          next()
        }
        else {
          throw { status: 400, message: "Unauthorized" }
        }
      })
      .catch(next)
  },

  authorizationProject(req, res, next){
    Project.findById(req.params.id)
      .then((project)=>{
        if (project.UserId == req.decode._id){
          next()
        }
        else {
          throw { status: 400, message: "Unauthorized" }
        }
      })
      .catch(next)
  },

  authorizationProjectMember (req, res, next){
    console.log('masuk authorization project member', req.params.id)
    console.log('ini req body', req.body)
    Project.findById(req.params.id)
      .then((project)=>{
        let listmember = project.members.find(member => member == req.decode._id)
        if (listmember){
          next()
        }
        else {
          throw {status: 400, message: 'unauthorized'}
        }
      })
      .catch(next)
  }
}