require("dotenv").config()
const express = require('express');
const Sentry = require('@sentry/node');const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/person")

Sentry.init({ dsn: 'https://8d8040c884ac46f8acf72f4d098ae4ef@o326454.ingest.sentry.io/5244720' });
app.use(Sentry.Handlers.requestHandler());

app.use(express.json())
app.use(express.static("build"))
app.use(cors())

morgan.token("postRequest", (request,response) => {
  if (request.method == "POST") {
    return JSON.stringify(request.body)
  } else {
    return ""
  }
})
app.use(morgan(":method :status :res[content-length] - :response-time ms :postRequest"))

app.get("/info", (request, response) => {
  const time = new Date()
  Person
  .find({})
  .then(result => {
    response.send(`
    <p>Phonebook has info for ${result.length} people</p>
    <p>${time}</p>
  `)
  })
  .catch(error => {
    response.status(500).end()
  })
})

//collectionView of all persons
app.get("/api/persons", (request, response) => {
  Person
  .find({})
  .then(persons => {
    response.json(persons)
  })
  .catch(error => {
    response.status(500).json({
      error: error
    })
  })
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
app.get("/api/persons/:id", (request, response, next) => {
  Person
  .findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    next(error)
  })
})

//Delete singular resoucrce
app.delete("/api/persons/:id", (request, response, next) => {
  Person
  .findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => {
    next(error)
  })
})

//add new person
app.post("/api/persons", (request, response) => {
  if (!request.body) {
    response.status(400).json({
      error: "Content missing"
    })
  }
  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number,
  })
  newPerson
  .save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => {
    response.status(500).json({
      error: error
    })
  })
})

//Update name or number
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const newPerson = {
    name: body.name,
    number: body.number
  }

  Person
  .findByIdAndUpdate(request.params.id, newPerson, {new: true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => {
    next(error)
  })
})

//Sentry debug
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

//Sentry
app.use(Sentry.Handlers.errorHandler());

//Not found
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//another error
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})