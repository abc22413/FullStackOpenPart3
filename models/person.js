const mongoose = require("mongoose")
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)
const uniqueValidator = require("mongoose-unique-validator")

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  },
})
personSchema.plugin(uniqueValidator)
personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

console.log("Attempting to connect to DB")
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(response => {
  console.log("succesfully connected to mongoDB")
})
.catch(error => {
  console.log(`Error while connecting to mongoDB ${error}`)
})

module.exports = mongoose.model("Person", personSchema)