const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (err) {
    console.error('JWT verification error:', err.message)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const ok = req.user.role === role || req.user.role === 'admin'
    if (!ok) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}

module.exports = { auth, requireRole }
