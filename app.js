const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001

let data = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/persons', (req, res) => {
  res.send(data);
});

app.get('/info', (req, res) => {
  res.send(`
    <div>
      <p>phone book has info for ${data.length} people</p>
      <p>${new Date()}</p>
    </div>
  `)
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = data.find((person) => person.id === id)

  if (person) {
    return res.send(person)
  }
  return res.status(404).json({message: `person with ${id} not found`})
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  data = data.filter(person => person.id !== id)
  res.status(204).end()
});

app.post('/api/persons/', (req, res) => {
  const person = req.body
  const duplicate = data.some((obj) => obj.name === person.name)
  if (!person.name || !person.number || duplicate ) {
    return res.status(400).json({error: 'content missing or already exists'})
  }
  person.id = Math.random() * 1000000;
  data = data.concat(person)
  console.log(data)
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});