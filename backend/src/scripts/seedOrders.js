const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('../models/Order');
const Product = require('../models/Product');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const sampleOrders = [
    { customer: 'Alice Corp', total: 1500, status: 'completed' },
    { customer: 'Bob Inc', total: 3200, status: 'completed' },
    { customer: 'Charlie Ltd', total: 450, status: 'pending' },
    { customer: 'Delta Group', total: 8900, status: 'completed' },
    { customer: 'Echo Ent', total: 120, status: 'cancelled' },
    { customer: 'Foxtrot Sys', total: 2100, status: 'completed' },
];

async function seed() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error('MONGODB_URI is missing');

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing orders
        await Order.deleteMany({});
        console.log('Cleared existing orders');

        // Get some products to reference (if any)
        const products = await Product.find().limit(5);

        if (products.length === 0) {
            console.log('No products found to reference, creating mock orders without products links...');
        }

        const ordersToCreate = sampleOrders.map((o, index) => {
            // Pick a random product if available
            const product = products.length > 0 ? products[index % products.length] : null;

            return {
                customer: o.customer,
                totalAmount: o.total,
                status: o.status,
                products: product ? [{
                    product: product._id,
                    quantity: Math.floor(Math.random() * 5) + 1,
                    priceAtPurchase: product.price || 100
                }] : [],
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date in last 7 days
            };
        });

        await Order.insertMany(ordersToCreate);
        console.log(`Seeded ${ordersToCreate.length} orders`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
