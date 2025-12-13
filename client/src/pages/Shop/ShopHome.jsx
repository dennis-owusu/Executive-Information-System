import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, Truck, Shield, CreditCard, ArrowRight, Star, Heart, Zap, Gift, Clock } from 'lucide-react';
import ShopNavbar from '../../components/ShopNavbar';
import { getProducts } from '../../services/api';
import { useCart } from '../../contexts/CartContext';

export default function ShopHomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Ensure your API function handles queries correctly
                const data = await getProducts({ limit: 8 });
                setFeaturedProducts(data?.items || []);
            } catch (error) {
                console.error("Failed to fetch featured products", error);
                setFeaturedProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <ShopNavbar />

            {/* Custom Styles for Animation - Fixed for standard React */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(6deg); }
                    50% { transform: translateY(-20px) rotate(6deg); }
                }
                @keyframes float-alt {
                    0%, 100% { transform: translateY(0) rotate(-6deg); }
                    50% { transform: translateY(-20px) rotate(-6deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-alt {
                    animation: float-alt 6s ease-in-out infinite;
                    animation-delay: 2s;
                }
            `}</style>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700"></div>
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z" fill="rgba(255,255,255,0.07)"/%3E%3C/svg%3E')` }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                <Zap size={16} className="text-yellow-300" />
                                <span className="text-sm font-semibold text-white">Flash Sale - Up to 50% Off</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                                Discover
                                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                                    Amazing Deals
                                </span>
                            </h1>

                            <p className="text-xl text-white/90 max-w-lg mx-auto lg:mx-0">
                                Explore our curated collection of premium products. Free shipping on all orders over $50.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/shop/products"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-2xl hover:bg-yellow-300 hover:text-purple-900 transition-all duration-300 shadow-2xl shadow-purple-900/30 hover:shadow-yellow-500/30 hover:scale-105"
                                >
                                    <ShoppingBag size={22} />
                                    Shop Now
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/shop/products"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-bold rounded-2xl hover:bg-white/20 transition-all"
                                >
                                    <Gift size={20} />
                                    View Offers
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                                <div className="flex items-center gap-2 text-white/80">
                                    <Truck size={20} />
                                    <span className="text-sm font-medium">Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Shield size={20} />
                                    <span className="text-sm font-medium">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Clock size={20} />
                                    <span className="text-sm font-medium">24/7 Support</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block relative h-[500px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-3xl shadow-2xl p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500 animate-float">
                                <img
                                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
                                    alt="Product"
                                    className="w-full h-40 object-cover rounded-2xl"
                                    loading="lazy"
                                />
                                <p className="mt-3 font-bold text-gray-800">Premium Headphones</p>
                                <p className="text-purple-600 font-bold">$299.99</p>
                            </div>
                            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-3xl shadow-2xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500 animate-float-alt">
                                <img
                                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
                                    alt="Product"
                                    className="w-full h-32 object-cover rounded-2xl"
                                    loading="lazy"
                                />
                                <p className="mt-3 font-bold text-gray-800">Smart Watch</p>
                                <p className="text-purple-600 font-bold">$199.99</p>
                            </div>
                            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30"></div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)" />
                    </svg>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">Shop by Category</h2>
                    <p className="text-gray-500 text-lg">Find exactly what you're looking for</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: 'Electronics', icon: '🎧', color: 'from-blue-500 to-cyan-400', count: 120 },
                        { name: 'Fashion', icon: '👕', color: 'from-pink-500 to-rose-400', count: 85 },
                        { name: 'Home & Living', icon: '🏠', color: 'from-amber-500 to-yellow-400', count: 200 },
                        { name: 'Sports', icon: '⚽', color: 'from-green-500 to-emerald-400', count: 65 },
                    ].map((category, i) => (
                        <Link
                            key={i}
                            to="/shop/products"
                            className="group relative overflow-hidden rounded-3xl p-6 h-48 flex flex-col justify-end transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
                            <div className="absolute top-4 right-4 text-5xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                                {category.icon}
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                                <p className="text-white/80 text-sm">{category.count}+ Products</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2">Featured Products</h2>
                            <p className="text-gray-500 text-lg">Handpicked just for you</p>
                        </div>
                        <Link
                            to="/shop/products"
                            className="group inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 transition-colors"
                        >
                            View All Products
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.slice(0, 8).map((product, index) => (
                                <ProductCard
                                    key={product._id || index}
                                    product={product}
                                    index={index}
                                    onAddToCart={() => addToCart(product)}
                                    onBuyNow={() => {
                                        addToCart(product);
                                        navigate('/shop/checkout');
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Strip */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'text-blue-600 bg-blue-100' },
                            { icon: Shield, title: 'Secure Payment', desc: '100% protected', color: 'text-green-600 bg-green-100' },
                            { icon: CreditCard, title: 'Easy Returns', desc: '30-day guarantee', color: 'text-purple-600 bg-purple-100' },
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-5 p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300">
                                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center`}>
                                    <feature.icon size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{feature.title}</h3>
                                    <p className="text-gray-500">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Join thousands of happy customers. Get exclusive deals and free shipping on your first order!
                    </p>
                    <Link
                        to="/shop/products"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-700 font-bold text-lg rounded-2xl hover:bg-yellow-300 hover:text-purple-900 transition-all duration-300 shadow-2xl hover:scale-105"
                    >
                        <ShoppingBag size={24} />
                        Explore All Products
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                            EIS
                        </div>
                        <span className="text-xl font-bold">Shop</span>
                    </div>
                    <p className="text-slate-400">© 2024 EIS Shop. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function ProductCard({ product, index, onAddToCart, onBuyNow }) {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart();
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onBuyNow();
    };

    // Fallback product data if product is undefined
    const productData = product || {
        _id: `fallback-${index}`,
        name: 'Product Name',
        price: 0,
        images: []
    };

    // Determine target link (prevents error if _id is missing in fallback)
    const productLink = productData._id ? `/shop/product/${productData._id}` : '#';

    return (
        <div
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <Link to={productLink} className="block w-full h-full">
                    {productData.images?.[0]?.url && !imageError ? (
                        <img
                            src={productData.images[0].url}
                            alt={productData.name}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package size={48} className="text-slate-300" />
                        </div>
                    )}
                </Link>

                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={handleAddToCart}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${added ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:bg-purple-600 hover:text-white'}`}
                        >
                            {added ? '✓ Added!' : 'Add to Cart'}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all shadow-md"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                <button
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-500 transition-all transform hover:scale-110 z-20"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add wishlist logic here
                    }}
                >
                    <Heart size={18} />
                </button>

                {index < 2 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full z-20">
                        🔥 Hot Deal
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <Link to={productLink} className="block flex-grow">
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">(4.8)</span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors h-12">
                        {productData.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div>
                        <span className="text-2xl font-black text-purple-600">
                            ${typeof productData.price === 'number' ? productData.price.toFixed(2) : '0.00'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}