const Todo = require('../models/Todo')

class todoController {
  static getAllTodo(req, res, next) {
    console.log('masuk controller getAllTodo')
    Todo.find({
      UserId: req.headers.userid
    })
      .then((allData) => {
        res.status(200).json(allData)
      })
      .catch(next)

  }

  static findOneTodo(req, res, next) {
    console.log('masuk find one todo', req.params.id)
    Todo.findOne({
      _id: req.params.id
    })
      .then((todo) => {
        res.status(200).json(todo)
      })
      .catch(next)
  }

  static create(req, res, next) {
    console.log('masuk controller create todo')
    let { name, description, dueDate, UserId } = req.body
    let input = { name, description, dueDate, UserId }
    Todo.create(req.body)
      .then((todo) => {
        res.send(todo)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    console.log('masuk controller delete todo')
    Todo.deleteOne({
      _id: req.params.id
    })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch(next)
  }

  static update(req, res, next) {
    console.log('masuk controller update')
    let { name, description, dueDate } = req.body
    let input = { name, description, dueDate }
    Todo.updateOne({ _id: req.params.id }, input)
      .then((data) => {
        res.status(201).json(data)
      })
      .catch(next)
  }

  static updateStatus(req, res, next) {
    console.log('masuk controller update status')
    Todo.findOne({
      _id: req.params.id
    })
      .then((todo) => {
        if (todo.status === false){
          return Todo.updateOne({ _id: req.params.id }, {status:true})
        }
        else {
          return Todo.updateOne({ _id: req.params.id }, {status:false})
        }
      })
      .then((success)=>{
        res.status(200).json(success)
      })
      .catch(next)
  }

  static deleteTodoProjet(req, res, next){
    console.log('masuk controller delete todo in project')
    Todo.deleteOne({
      _id: req.body.idTodo
    })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch(next)
  }

  static updateStatusTodoProject(req, res, next) {
    console.log('masuk controller update status todo project', req.body.idTodo)
    Todo.findOne({
      _id: req.body.idTodo
    })
      .then((todo) => {
        if (todo.status === false){
          return Todo.updateOne({ _id: req.body.idTodo }, {status:true})
        }
        else {
          return Todo.updateOne({ _id: req.body.idTodo }, {status:false})
        }
      })
      .then((success)=>{
        res.status(200).json(success)
      })
      .catch(next)
  }

  static findOneTodoProject(req, res, next){
    console.log('masuk findOne todo project', req.query)
    Todo.findOne({
      _id: req.query.idTodo
    })
    .then((todo)=>{
      res.status(200).json(todo)
    })
    .catch(next)
  }

  static submitTodoProject(req, res, next){
    console.log('masuk submit todo project', req.query)
    let { name, description, dueDate } = req.body
    let input = { name, description, dueDate }
    Todo.updateOne({ _id: req.query.idTodo }, input)
      .then((data) => {
        res.status(201).json(data)
      })
      .catch(next)
  }
}

module.exports = todoController