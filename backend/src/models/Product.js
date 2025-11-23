const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String }
}, { _id: false })

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String },
  price: { type: Number, required: true, index: true },
  categories: [{ type: String, index: true }],
  images: [imageSchema],
  stock: { type: Number, default: 0 },
  sku: { type: String, index: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text' })
// categories already indexed via field option
productSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Product', productSchema)