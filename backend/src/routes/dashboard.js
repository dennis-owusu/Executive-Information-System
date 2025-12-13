const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const Order = require('../models/Order')

// Dashboard routes are open for demo purposes (add auth back in production)

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
    try {
        // 1. Total Revenue
        const revenueAgg = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
        const totalRevenue = revenueAgg[0]?.total || 0

        // 2. Total Orders
        const totalOrders = await Order.countDocuments()

        // 3. Low Stock Products
        const lowStockCount = await Product.countDocuments({ stock: { $lt: 10 } })

        // 4. Recent Orders (limit 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('products.product', 'name')

        res.json({
            metrics: [
                { label: 'Total Revenue', value: totalRevenue, type: 'currency', trend: '+12%' },
                { label: 'Total Orders', value: totalOrders, type: 'number', trend: '+5%' },
                { label: 'Low Stock Alerts', value: lowStockCount, type: 'alert', trend: 'stable' },
                { label: 'Active Users', value: 124, type: 'number', trend: '+18%' } // Mocked for now
            ],
            recentOrders
        })
    } catch (err) {
        console.error('Dashboard stats error:', err)
        res.status(500).json({ message: 'Server Error' })
    }
})

// GET /api/dashboard/chart-data
router.get('/chart-data', async (req, res) => {
    try {
        // Mock data for the graph - in real app, aggregate Order collection by date
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const data = [1200, 1900, 3000, 500, 2000, 3000, 4500] // Mock weekly revenue

        res.json({
            labels,
            datasets: [
                {
                    label: 'Revenue',
                    data,
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
                }
            ]
        })
    } catch (err) {
        res.status(500).json({ message: 'Server Error' })
    }
})

module.exports = router
