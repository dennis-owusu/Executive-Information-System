const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product'); // Ensure product stock management if needed
const { auth } = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { products, totalAmount, shippingAddress, paymentReference } = req.body;

        const newOrder = new Order({
            user: req.user.sub, // From auth middleware
            products: products.map(p => ({
                product: p._id,
                quantity: p.quantity,
                priceAtPurchase: p.price,
                name: p.name,
                image: p.images?.[0]?.url || ''
            })),
            totalAmount,
            shippingAddress,
            paymentReference,
            status: 'processing'
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get logged in user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.sub }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'email firstName lastName').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
