const express = require('express')
const jwt = require('jsonwebtoken')
const { auth } = require('../middleware/auth')
const User = require('../models/User')

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify Password (Plaintext for now as per env limitations, TODO: use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check Role (Optional: if we want to strict enforce role login)
    // For now, if user logs in, we trust their stored role.
    // However, if the request demands a specific role (like 'admin'), we could check.
    // The previous implementation auto-assigned role. Here we use DB role.

    // Sign Token
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ sub: user._id, role: user.role, email: user.email }, secret, { expiresIn: '2h' })

    res.json({ token, user: { email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

// Register (New)
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
      email,
      password, // Plaintext
      firstName,
      lastName,
      role: role || 'user'
    });

    await user.save();

    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ sub: user._id, role: user.role, email: user.email }, secret, { expiresIn: '2h' })

    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = router
