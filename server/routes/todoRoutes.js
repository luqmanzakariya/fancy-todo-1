const router = require('express').Router()
const TodoController = require('../controllers/TodoController')
const {authentication} = require('../middlewares/authentication')
const {authorization} = require('../middlewares/authorization')
const {authorizationProjectMember} = require('../middlewares/authorization')


router.use(authentication)
router.get('/', TodoController.getAllTodo)
router.get('/:id', TodoController.findOneTodo)
router.post('/create', TodoController.create)
router.delete('/:id', authorization, TodoController.delete)
router.patch('/:id', authorization, TodoController.update)
router.patch('/status/:id', authorization, TodoController.updateStatus)

//Todos in Project
router.delete('/todoproject/:id', authorizationProjectMember, TodoController.deleteTodoProjet)
router.patch('/todoproject/status/:id', authorizationProjectMember, TodoController.updateStatusTodoProject)
router.get('/todoproject/:id', authorizationProjectMember, TodoController.findOneTodoProject)
router.patch('/todoproject/:id', authorizationProjectMember, TodoController.submitTodoProject)



module.exports = router