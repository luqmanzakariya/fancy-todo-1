const router = require('express').Router()
const ProjectController = require('../controllers/ProjectController')
const {authentication} = require('../middlewares/authentication')
const {authorizationProject} = require('../middlewares/authorization')

router.use(authentication)
router.get('/', ProjectController.findAll)
router.post('/', ProjectController.create)
router.get('/:id', ProjectController.findAllTodo)
router.post('/:id', ProjectController.createTodo)
router.delete('/:id', authorizationProject, ProjectController.deleteProject)
router.patch('/:id', ProjectController.addUser)

module.exports = router