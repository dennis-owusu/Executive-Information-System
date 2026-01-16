import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Categories from '../models/categories.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function diagnoseProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find().sort({ createdAt: -1 }).populate('category', 'categoryName');

    console.log('All Products:');
    for (const product of products) {
      console.log(`\nProduct ID: ${product._id}`);
      console.log(`Name: ${product.productName}`);
      console.log(`Price: ${product.productPrice}`);
      console.log(`Outlet: ${product.outlet}`);
      console.log(`Category: ${product.category?.categoryName || 'No Category'} (${product.category?._id || 'N/A'})`);
    }

    console.log('\nDiagnosis complete');
  } catch (error) {
    console.error('Error diagnosing products:', error);
  } finally {
    mongoose.connection.close();
  }
}

diagnoseProducts();