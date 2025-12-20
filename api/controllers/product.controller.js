import { errorHandler } from "../utils/error.js"; 
import Product from "../models/product.model.js";

export const newProducts = async (req, res, next) => {
    // Handle both FormData and JSON requests
    let productData;
    let productImage;
    
    if (req.file) {
      // FormData request with file upload
      productData = {
        productName: req.body.productName,
        category: req.body.category,
        numberOfProductsAvailable: req.body.numberOfProductsAvailable,
        productPrice: req.body.productPrice,
        description: req.body.description,
        outlet: req.body.outlet,
        specifications: req.body.specifications,
        featured: req.body.featured,
        discountPrice: req.body.discountPrice,
        author: req.body.author
      };
      productImage = `/uploads/${req.file.filename}`;
    } else {
      // JSON request with image URL or base64
      productData = req.body;
      productImage = req.body.productImage;
      
      // If it's a base64 image that's too large, return an error
      if (productImage && productImage.length > 1000000) { // 1MB limit for base64
        return next(errorHandler(413, 'Image data too large. Please use image upload instead.'));
      }
    }
    
    const { productName, category, numberOfProductsAvailable, productPrice, description, outlet, specifications, featured, discountPrice, author } = productData;

    if (!productName || !productPrice || !productImage) {
        return next(errorHandler(400, 'Product name, price, and image are required'));
    }

    try {
        const newProduct = new Product({
            productName,
            category,
            numberOfProductsAvailable,
            productPrice,
            productImage: productImage,
            description,
            specifications,   
            featured,
            discountPrice,
            author,
            outlet
        });

        await newProduct.save();
        res.status(200).json({ success: true, product: newProduct });
    } catch (error) {
        next(error);
    }
};

export const oneProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(errorHandler(404, 'Product not found'));
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};
export const getProducts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const products = await Product.find({
            ...(req.query.productId && { productId: req.query.productId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.productName && { productName: req.query.productName }),
            ...(req.query.numberOfProductsAvailable && { numberOfProductsAvailable: req.query.numberOfProductsAvailable }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { productName: { $regex: req.query.searchTerm, $options: 'i' } },
                    { description: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .populate('category', 'categoryName')
            .sort({ updatedAt: sortDirection })
            .skip(startIndex);

        const totalProducts = await Product.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthProducts = await Product.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            success: true,
            products,
            totalProducts,
            lastMonthProducts,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json({ success: true, message: 'Product has been deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const updateData = {
            productId: req.body.productId,
            category: req.body.category,
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            numberOfProductsAvailable: req.body.numberOfProductsAvailable,
            productImage: req.body.productImage,
            description: req.body.description,
            specifications: req.body.specifications,
            featured: req.body.featured,
            discountPrice: req.body.discountPrice,
            author: req.body.author
        };

        if (req.file) {
            updateData.productImage = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedProduct) {
            return next(errorHandler(404, 'Product not found'));
        }

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        next(error);
    }
};

export const purchaseProducts = async (req, res, next) => {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return next(errorHandler(400, 'Quantity must be greater than zero.'));
    }

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(errorHandler(404, 'Product not found.'));
        }

        if (product.numberOfProductsAvailable < quantity) {
            return next(errorHandler(400, 'Not enough products available.'));
        }

        product.numberOfProductsAvailable -= quantity;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Purchase successful',
            product: {
                _id: product._id,
                productId: product.productId,
                productName: product.productName,
                numberOfProductsAvailable: product.numberOfProductsAvailable,
            },
        });
    } catch (error) {
        next(error);
    }
};
