const express = require("express")
const app = express()

app.use(express.json())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

//collectionView of all persons
app.get("/api/persons", (request, response) => {
  response.json(persons)
})

//InfoView
app.get("/info", (request, response) => {
  const time = new Date()
  response.send(`
  <p>Phonebook has info for ${persons.length} ${persons.length !== 1 ? "people" : "person"}</p>
  <p>${time}</p>
  `)
})

//Retrieve singular resource
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//Delete singular resoucrce
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

//add new person
app.get("/lol", (request, response) => {
  const genID = () => {
    let newID = Math.floor(Math.random()*Number.MAX_VALUE)
    while (persons.map(p => p.id).includes(newID)) {
      newID = Math.floor(Math.random()*Number.MAX_VALUE)
    }
    return newID
  }

  const body = request.body

  //Name or number missing
  if (!body.name || !body.number) {
    response.status(400).json({
      error: "Name and/or number missing"
    })
  }
  //Name aready inside
  else if (persons.map(p => p.name).includes(body.name)) {
    response.status(400).json({
      error: "Name already exists"
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: genID()
  }
  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})