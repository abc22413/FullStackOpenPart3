const mongoose = require("mongoose")

//no pwd specified
if (process.argv.length < 3) {
  console.log("Supply pwd please.")
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://user-agent-0:${password}@notes-db-vwtik.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model("Person", personSchema)

//no creation object specified
if (process.argv.length === 3) {
  mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  Person
  .find({})
  .then(response => {
    console.log("phonebook:")
    response.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  .catch(error => {
    console.log(`Listing failed with error ${error}`)
    mongoose.connection.close()
  })
}

//creation object specified
else if (process.argv.length === 5) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  newPerson
  .save()
  .then(result => {
    console.log("Record saved successfully")
    mongoose.connection.close()
  })
  .catch(error => {
    console.log(`Save operation failed with error ${error}`)
    mongoose.connection.close()
  })
}

else {
  console.log("Invalid arguments passed.")
  process.exit(1)
}