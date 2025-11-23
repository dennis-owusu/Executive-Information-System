const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const productsRouter = require('./routes/products')
const authRouter = require('./routes/auth')

const app = express()

const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))

app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.use('/api/products', productsRouter)
app.use('/products', productsRouter)
app.use('/auth', authRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

app.use((err, req, res, _next) => {
  let status = err.status || 500
  if (err.code === 'LIMIT_FILE_SIZE') status = 413
  if (err.message === 'Invalid file type') status = 400
  res.status(status).json({ message: err.message || 'Server Error' })
})

module.exports = app

