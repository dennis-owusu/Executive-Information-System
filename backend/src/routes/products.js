const path = require('path')
const express = require('express')
const multer = require('multer')
const Product = require('../models/Product')
const { auth, requireRole } = require('../middleware/auth')
const { cacheDefault } = require('../utils/cache')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_')
    cb(null, `${Date.now()}_${base}${ext}`)
  }
})

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.mimetype)) return cb(new Error('Invalid file type'))
  cb(null, true)
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
  fileFilter
})

router.post('/', auth, requireRole('admin'), upload.array('images', 6), async (req, res, next) => {
  try {
    const { name, description, price, categories = [], stock = 0, sku } = req.body
    if (!name || !price) return res.status(400).json({ message: 'name and price are required' })
    const images = (req.files || []).map(f => ({ url: `/uploads/${f.filename}`, alt: name }))
    const product = await Product.create({ name, description, price: Number(price), categories: Array.isArray(categories) ? categories : [categories], images, stock: Number(stock), sku })
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
})

router.get('/', cacheDefault(), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q, sort = '-createdAt' } = req.query
    const filter = { isActive: true }
    if (q) filter.$text = { $search: q }
    const cursor = Product.find(filter)
    const total = await Product.countDocuments(filter)
    const items = await cursor.sort(sort).skip((Number(page) - 1) * Number(limit)).limit(Number(limit))
    res.json({ items, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', cacheDefault(), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Not Found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

router.get('/category/:category', cacheDefault(), async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const filter = { isActive: true, categories: req.params.category }
    const total = await Product.countDocuments(filter)
    const items = await Product.find(filter).sort('-createdAt').skip((Number(page) - 1) * Number(limit)).limit(Number(limit))
    res.json({ items, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
})

module.exports = router

