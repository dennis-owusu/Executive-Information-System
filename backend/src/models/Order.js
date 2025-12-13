const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true },
        name: String, // Store snapshot of name
        image: String // Store snapshot of image url
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zip: String
    },
    status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
        default: 'processing'
    },
    paymentReference: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
