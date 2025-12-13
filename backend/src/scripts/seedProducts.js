const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const sampleProducts = [
    {
        name: 'Wireless Headphones Pro',
        description: 'Premium noise-cancelling headphones with 40-hour battery life',
        price: 299.99,
        categories: ['Electronics', 'Audio'],
        stock: 45,
        sku: 'WHP-001',
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', alt: 'Headphones' }]
    },
    {
        name: 'Smart Watch Ultra',
        description: 'Advanced fitness tracking with heart rate monitor and GPS',
        price: 449.99,
        categories: ['Electronics', 'Wearables'],
        stock: 23,
        sku: 'SWU-002',
        images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', alt: 'Watch' }]
    },
    {
        name: 'Laptop Stand Aluminum',
        description: 'Ergonomic laptop stand with adjustable height',
        price: 79.99,
        categories: ['Office', 'Accessories'],
        stock: 67,
        sku: 'LSA-003',
        images: [{ url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', alt: 'Laptop Stand' }]
    },
    {
        name: 'Mechanical Keyboard RGB',
        description: 'Gaming keyboard with customizable RGB lighting',
        price: 159.99,
        categories: ['Electronics', 'Gaming'],
        stock: 12,
        sku: 'MKR-004',
        images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', alt: 'Keyboard' }]
    },
    {
        name: 'Desk Organizer Set',
        description: 'Minimalist desk organizer with pen holder and storage',
        price: 34.99,
        categories: ['Office', 'Organization'],
        stock: 89,
        sku: 'DOS-005',
        images: [{ url: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400', alt: 'Organizer' }]
    },
    {
        name: 'Portable Charger 20000mAh',
        description: 'Fast-charging power bank with dual USB ports',
        price: 49.99,
        categories: ['Electronics', 'Accessories'],
        stock: 156,
        sku: 'PC-006',
        images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', alt: 'Charger' }]
    },
    {
        name: 'Webcam 4K Ultra HD',
        description: 'Professional webcam with auto-focus and noise reduction',
        price: 189.99,
        categories: ['Electronics', 'Video'],
        stock: 34,
        sku: 'WC4K-007',
        images: [{ url: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400', alt: 'Webcam' }]
    },
    {
        name: 'Ergonomic Office Chair',
        description: 'Premium mesh back chair with lumbar support',
        price: 399.99,
        categories: ['Office', 'Furniture'],
        stock: 8,
        sku: 'EOC-008',
        images: [{ url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400', alt: 'Chair' }]
    },
    {
        name: 'USB-C Hub Multi-Port',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
        price: 59.99,
        categories: ['Electronics', 'Accessories'],
        stock: 203,
        sku: 'USBCH-009',
        images: [{ url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400', alt: 'USB Hub' }]
    },
    {
        name: 'Wireless Mouse Ergonomic',
        description: 'Vertical ergonomic mouse with adjustable DPI',
        price: 39.99,
        categories: ['Electronics', 'Accessories'],
        stock: 142,
        sku: 'WME-010',
        images: [{ url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', alt: 'Mouse' }]
    }
];

async function seed() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error('MONGODB_URI is missing');

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(sampleProducts);
        console.log(`Seeded ${sampleProducts.length} products`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
