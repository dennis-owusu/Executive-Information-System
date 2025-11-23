const express = require('express')
const jwt = require('jsonwebtoken')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
  const lower = email.toLowerCase()
  const role = lower.includes('admin') ? 'admin' : (lower.includes('exec') || lower.includes('executive') ? 'executive' : 'user')
  const token = jwt.sign({ sub: '1', role, email }, process.env.JWT_SECRET, { expiresIn: '2h' })
  res.json({ token, user: { email, role } })
})

router.get('/me', auth, (req, res) => {
  res.json({ user: { id: req.user.sub, role: req.user.role, email: req.user.email } })
})

module.exports = router
