const request = require('supertest')
const jwt = require('jsonwebtoken')
const Product = require('../src/models/Product')
const app = require('../src/app')

function adminToken() {
  const secret = process.env.JWT_SECRET || 'testsecret'
  return jwt.sign({ sub: '1', role: 'admin' }, secret, { expiresIn: '1h' })
}

describe('Product API', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret'
  })

  const originals = {}
  beforeEach(() => {
    originals.find = Product.find
    originals.findById = Product.findById
    originals.countDocuments = Product.countDocuments
    originals.create = Product.create
  })
  afterEach(() => {
    Product.find = originals.find
    Product.findById = originals.findById
    Product.countDocuments = originals.countDocuments
    Product.create = originals.create
  })

  test('POST /api/products creates product', async () => {
    const token = adminToken()
    const created = { _id: '507f1f77bcf86cd799439011', name: 'Test Product', price: 9.99, images: [] }
    Product.create = jest.fn().mockResolvedValue(created)
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Product')
      .field('price', '9.99')
      .attach('images', Buffer.from('fake'), 'image.png')
    expect(res.statusCode).toBe(201)
    expect(res.body.name).toBe('Test Product')
    expect(res.body.price).toBe(9.99)
  })

  test('POST /api/products validates missing fields', async () => {
    const token = adminToken()
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('description', 'No name and price')
    expect(res.statusCode).toBe(400)
  })

  test('GET /api/products lists products with pagination', async () => {
    Product.countDocuments = jest.fn().mockResolvedValue(1)
    const items = [{ _id: '1', name: 'A', price: 1 }]
    Product.find = jest.fn().mockReturnValue({
      sort() { return this },
      skip() { return this },
      limit() { return items }
    })
    const res = await request(app).get('/api/products').query({ page: 1, limit: 10 })
    expect(res.statusCode).toBe(200)
    expect(res.body.items.length).toBe(1)
    expect(res.body.total).toBe(1)
  })

  test('GET /api/products/:id returns single product', async () => {
    const p = { _id: '2', name: 'X', price: 19.99 }
    Product.findById = jest.fn().mockResolvedValue(p)
    const res = await request(app).get('/api/products/2')
    expect(res.statusCode).toBe(200)
    expect(res.body._id).toBe('2')
  })

  test('GET /api/products/category/:category filters', async () => {
    Product.countDocuments = jest.fn().mockResolvedValue(2)
    const items = [{ _id: '3', name: 'Cat Product', price: 29.99 }]
    Product.find = jest.fn().mockReturnValue({
      sort() { return this },
      skip() { return this },
      limit() { return items }
    })
    const res = await request(app).get('/api/products/category/Electronics')
    expect(res.statusCode).toBe(200)
    expect(res.body.items.length).toBeGreaterThan(0)
  })
})
