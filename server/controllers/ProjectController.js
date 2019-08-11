const Project = require('../models/Project')
const Todo = require('../models/Todo')

class ProjectController {
  static findAll(req, res, next){
    console.log('masuk controller findAll project')
    Project.find({members: {
      $in: req.decode._id
      }
    }).populate('members')
      .then((projects)=>{
        res.status(200).json(projects)
      })
      .catch(next)
  }

  static create(req, res, next){
    console.log('masuk controller create project')
    let {title, description, members,  UserId} = req.body
    Project.create({title, description, members,  UserId})
      .then((project)=>{

        return Project.updateOne({_id: project._id},{members: [members, UserId], UserId:[UserId]})
      })
      .then((update)=>{
        res.status(201).json(update)
      })
      .catch(next)
  }

  static findAllTodo (req,res, next){
    console.log('masuk find all todo in project')
    Project.findOne({_id: req.params.id}).populate('todos')
      .then((project)=>{
        res.status(200).json(project)
      })
      .catch(next)
  }

  static createTodo (req, res,next){
    console.log('masuk create todo in project')
    let { name, description, dueDate} = req.body
    let input = {name, description, dueDate}
    Todo.create(input)
      .then((todo)=>{
        // res.status(201).json(todo)
        return Promise.all ([todo, Project.findOneAndUpdate({_id: req.params.id}, {$push: {todos: todo.id}})])
      })
      .then(([todo, success])=>{
        res.status(201).json(todo)
      })
      .catch(next)
  }

  static deleteProject(req,res,next){
    Project.deleteOne({
      _id: req.params.id
    })
      .then((project)=>{
        res.status(200).json(project)
      })
      .catch(next)
  }
  
  static addUser(req, res,next){
    console.log('masuk controller add user', req.params.id)
    Project.update(
      { _id: req.params.id }, 
      { $push: { members: req.query.id } }
    )
      .then((data)=>{
        res.status(200).json(data)
      })
      .catch(next)
  }
}

module.exports = ProjectController