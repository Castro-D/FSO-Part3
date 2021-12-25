require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT
const Phone = require('./models/phone')

app.use(express.static('build'))
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/persons', (req, res) => {
  Phone.find({})
    .then((phones) => {
      res.json(phones)
    })
    .catch(error => next(error))
});

app.get('/api/persons/:id', (req, res, next) => {
  Phone.findById(req.params.id)
    .then(phone => {
      if (phone) {
        res.json(phone)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
  Phone.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons/', (req, res, next) => {
  const body = req.body
  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  const phone = new Phone({
    name: body.name,
    number: body.number
  })

  phone.save()
    .then(savedPhone => {
      res.json(savedPhone)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});