const router = require('express').Router()
const WeatherController = require('../controllers/WeatherController')

router.get('/', WeatherController.getWeather)

module.exports = router