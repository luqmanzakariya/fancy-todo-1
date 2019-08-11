if (process.env.NODE_ENV = "development"){
  require('dotenv').config()
}

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const route = require('./routes/index')
const errorHandling = require('./middlewares/errorhandler')

//mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/iTodo', {useNewUrlParser:true}, function(err){
  if (err) throw err
  else console.log('mongoose connected')
})

//body parser & cors
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

//routes & errorHandling
app.use('/', route)
app.use(errorHandling)

app.listen(port, ()=>{
  console.log('listening on port:'+port)
})