const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
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