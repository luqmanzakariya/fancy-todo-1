const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ProjectSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  todos: [{
    type: Schema.Types.ObjectId,
    ref: "Todo"
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  UserId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true })

let Project = mongoose.model('Project', ProjectSchema)

module.exports = Project