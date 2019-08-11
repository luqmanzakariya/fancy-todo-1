const router = require('express').Router()
const userRoutes = require('./userRoutes')
const todoRoutes = require('./todoRoutes')
const projectRoutes = require('./projectRoutes')
const weatherRoutes = require('./weatherRoutes')

router.use('/users', userRoutes)
router.use('/todos', todoRoutes)
router.use('/projects', projectRoutes)
router.use('/weathers', weatherRoutes)


module.exports = router