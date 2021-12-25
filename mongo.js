const mongoose = require('mongoose');

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@fso-api.znbqj.mongodb.net/FSO-api?retryWrites=true&w=majority`;

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Phone = mongoose.model('Phone', phoneSchema);

if (process.argv.length <= 3) {
  Phone.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phone => {
      console.log(`${phone.name} ${phone.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const phone = new Phone({
    name: process.argv[3],
    number: process.argv[4],
  });
  
  phone.save().then(result => {
    console.log(`added ${phone.name} number ${phone.number} to phonebook`)
    mongoose.connection.close()
  });
}
