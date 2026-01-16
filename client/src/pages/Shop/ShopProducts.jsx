import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useSearch } from '../../contexts/SearchContext';
import { ShoppingCart, Star, Heart, Filter, Grid, List, SlidersHorizontal, Package, X } from 'lucide-react';
import ShopNavbar from '../../components/ShopNavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProducts } from '../../services/api';

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
}

function getRatingText(productId) {
    const h = hashString(String(productId || ''));
    return `4.${h % 10}`;
}

function shouldShowOriginalPrice(productId) {
    const h = hashString(String(productId || ''));
    return h % 2 === 1;
}

export default function ShopProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const { addToCart } = useCart();
    const { searchTerm, setSearchTerm, performSearch } = useSearch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts({ limit: 50 });
                console.log('[ShopProducts] API Response:', data); // Debug log
                const allProducts = data.products || data.items || [];
                setProducts(allProducts);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Handle URL search parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            // Set the search term from URL
            setSearchTerm(searchParam);
        }
    }, [location.search]);

    const categories = ['all', ...new Set(products.map(p => p.category?.categoryName || p.category || 'Uncategorized').filter(Boolean))];
    
    // Apply both category filter and search filter
    const categoryFilteredProducts = filter === 'all' ? products : products.filter(p => {
      const productCategory = p.category?.categoryName || p.category || 'Uncategorized';
      return productCategory === filter;
    });
    
    // Apply search filter using performSearch from SearchContext
    const filteredProducts = performSearch(categoryFilteredProducts, searchTerm);

    return (
        <div className="min-h-screen bg-slate-50">
            <ShopNavbar />

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Explore Our Collection
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Discover {products.length}+ premium products at unbeatable prices
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 sticky top-20 z-40">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 6).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filter === cat
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500 bg-white"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low → High</option>
                                <option value="price-high">Price: High → Low</option>
                                <option value="newest">Newest First</option>
                            </select>

                            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Results Header */}
                {searchTerm && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-purple-900">Search Results</h3>
                                <p className="text-purple-700">Showing results for "{searchTerm}"</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    navigate('/shop/products');
                                }}
                                className="px-4 py-2 bg-white text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                                Clear Search
                            </button>
                        </div>
                    </div>
                )}

                {/* Results Info */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-slate-600">
                        Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> products
                        {searchTerm && <span className="text-purple-600 font-medium"> matching "{searchTerm}"</span>}
                    </p>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-medium">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            {searchTerm ? `No products found for "${searchTerm}"` : 'No products found'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {searchTerm ? 'Try adjusting your search terms or browse all products' : 'No products available in this category'}
                        </p>
                        <button
                            onClick={() => {
                                setFilter('all');
                                if (searchTerm) {
                                    setSearchTerm('');
                                    navigate('/shop/products');
                                }
                            }}
                            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                        >
                            {searchTerm ? 'Clear Search' : 'Show All Products'}
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                    }>
                        {filteredProducts.map((product, index) => (
                            viewMode === 'grid' ? (
                                <ProductCardGrid
                                    key={product._id}
                                    product={product}
                                    index={index}
                                    onAddToCart={() => addToCart(product)}
                                    onBuyNow={() => {
                                        addToCart(product);
                                        navigate('/shop/checkout');
                                    }}
                                />
                            ) : (
                                <ProductCardList
                                    key={product._id}
                                    product={product}
                                    onAddToCart={() => addToCart(product)}
                                    onBuyNow={() => {
                                        addToCart(product);
                                        navigate('/shop/checkout');
                                    }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCardGrid({ product, index, onAddToCart, onBuyNow }) {
    const [imageError, setImageError] = useState(false);
    const [added, setAdded] = useState(false);
    const ratingText = getRatingText(product?._id);
    const showDiscount = shouldShowOriginalPrice(product?._id);

    const handleAddToCart = () => {
        onAddToCart();
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div
            className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Image Container */}
            <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                {product.productImage && !imageError ? (
                    <img
                        src={product.productImage.startsWith('http') ? product.productImage : `${window.location.origin}${product.productImage}`}
                        alt={product.productName || product.name}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package size={64} className="text-slate-200" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.numberOfProductsAvailable === 0 && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">Sold Out</span>
                    )}
                    {product.numberOfProductsAvailable > 0 && product.numberOfProductsAvailable < 10 && (
                        <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">Only {product.numberOfProductsAvailable} left</span>
                    )}
                    {index < 3 && product.numberOfProductsAvailable > 0 && (
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold rounded-full">🔥 Best Seller</span>
                    )}
                </div>

                {/* Wishlist */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 transform hover:scale-110">
                    <Heart size={18} />
                </button>

                {/* Quick Actions */}
                <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.numberOfProductsAvailable === 0}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${added
                                ? "bg-green-500 text-white"
                                : product.numberOfProductsAvailable === 0
                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                    : "bg-white text-slate-900 hover:bg-purple-600 hover:text-white"
                            }`}
                    >
                        {added ? "✓ Added!" : "Add to Cart"}
                    </button>
                    {product.numberOfProductsAvailable > 0 && (
                        <button
                            onClick={onBuyNow}
                            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                        >
                            Buy Now
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {product.category && (
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                        {product.category.categoryName || product.category || 'Uncategorized'}
                    </span>
                )}

                <h3 className="font-bold text-slate-900 mt-1 mb-2 line-clamp-2 min-h-[48px] group-hover:text-purple-600 transition-colors">
                    {product.productName || product.name}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">({ratingText})</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-purple-600">₵{product.productPrice || product.price}</span>
                    {showDiscount && (
                        <span className="text-sm text-slate-400 line-through">₵{((product.productPrice || product.price) * 1.3).toFixed(0)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductCardList({ product, onAddToCart, onBuyNow }) {
    const [imageError, setImageError] = useState(false);
    const [added, setAdded] = useState(false);
    const ratingText = getRatingText(product?._id);

    const handleAddToCart = () => {
        onAddToCart();
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="flex gap-6 bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all">
            <div className="w-40 h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                {product.productImage && !imageError ? (
                    <img
                        src={product.productImage}
                        alt={product.productName || product.name}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package size={40} className="text-slate-300" />
                    </div>
                )}
            </div>

            <div className="flex-1 py-2">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        {product.category && (
                            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                                {product.category.categoryName || product.category || 'Uncategorized'}
                            </span>
                        )}
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{product.productName || product.name}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                            ))}
                            <span className="text-xs text-slate-400 ml-1">({ratingText})</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-3xl font-black text-purple-600 block">₵{product.productPrice || product.price}</span>
                        {product.numberOfProductsAvailable > 0 && product.numberOfProductsAvailable < 10 && (
                            <span className="text-xs text-amber-600 font-medium">Only {product.numberOfProductsAvailable} left</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.numberOfProductsAvailable === 0}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${added
                                ? "bg-green-500 text-white"
                                : product.numberOfProductsAvailable === 0
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-slate-100 text-slate-900 hover:bg-purple-600 hover:text-white"
                            }`}
                    >
                        {added ? "✓ Added!" : "Add to Cart"}
                    </button>
                    {product.numberOfProductsAvailable > 0 && (
                        <button
                            onClick={onBuyNow}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                        >
                            Buy Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
