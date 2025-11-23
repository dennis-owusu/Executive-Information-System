const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = require('./app')

dotenv.config()

const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI

mongoose.connect(mongoUri).then(() => {
  console.log('MongoDB connected successfully')
  app.listen(port, () => {
    console.log(`API listening on ${port}`)
  })
}).catch(err => {
  console.error('Mongo connection error', err)
  process.exit(1)
})
 
//gi8ynKrObaNSPNe8