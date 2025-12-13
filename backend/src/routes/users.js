const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get all customers (users with role 'user')
router.get('/', auth, async (req, res) => {
    try {
        // Only fetch normal users for the customers page? Or all? User requested "remove mock data".
        // I'll return all for now or filter by query.
        const users = await User.find({ role: 'user' }).select('-password');

        // Add some "stats" for the UI if needed, but for now just raw data.
        // We might want to aggregate orders count for each user to replace mock stats.
        // But let's keep it simple first.
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
