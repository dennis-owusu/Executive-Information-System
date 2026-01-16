import React, { useEffect, useState } from 'react';
import { getProducts, updateProduct, deleteProduct } from '../services/api';

import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    ChevronLeft,
    ChevronRight,
    Package,
    TrendingUp,
    AlertCircle,
    Star,
    Tag,
    DollarSign,
    Check,
    X,
    RefreshCw,
    ShoppingBag,
    Clock,
    Grid,
    List,
    AlertTriangle,
    Battery,
    BatteryLow,
    BatteryMedium,
    BatteryFull,
    ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import ProductForm from '../components/forms/ProductForm';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [openForm, setOpenForm] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setRefreshing(true);
            const data = await getProducts({ startIndex: 0 });
            setProducts(data.products || data.items || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const displayedProducts = products
        .filter(p => (p.productName || '').toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(p => categoryFilter === 'all' || p.category?._id === categoryFilter)
        .filter(p => {
            if (statusFilter === 'all') return true;
            if (statusFilter === 'in-stock') return (p.numberOfProductsAvailable || 0) > 20;
            if (statusFilter === 'low-stock') return (p.numberOfProductsAvailable || 0) <= 20 && (p.numberOfProductsAvailable || 0) > 0;
            if (statusFilter === 'out-of-stock') return (p.numberOfProductsAvailable || 0) === 0;
            if (statusFilter === 'featured') return p.featured;
            return true;
        });

    const toggleProduct = (id) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedProducts(newSelected);
    };

    const toggleAll = () => {
        if (selectedProducts.size === displayedProducts.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(displayedProducts.map(p => p._id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.size === 0 || !window.confirm(`Delete ${selectedProducts.size} product(s)?`)) return;
        
        try {
            // Delete products one by one
            const deletePromises = Array.from(selectedProducts).map(id => deleteProduct(id));
            const results = await Promise.allSettled(deletePromises);
            
            // Filter out successfully deleted products
            const deletedIds = results
                .filter(result => result.status === 'fulfilled' && result.value?.success)
                .map((_, index) => Array.from(selectedProducts)[index]);
            
            if (deletedIds.length > 0) {
                setProducts(prev => prev.filter(p => !deletedIds.includes(p._id)));
                setSelectedProducts(new Set());
            }
        } catch (error) {
            console.error('Failed to delete products:', error);
        }
    };

    const handleBulkFeatured = async () => {
        if (selectedProducts.size === 0) return;
        
        try {
            // Update products to be featured one by one
            const updatePromises = Array.from(selectedProducts).map(id => 
                updateProduct(id, { featured: true })
            );
            const results = await Promise.allSettled(updatePromises);
            
            // Update products that were successfully updated
            const updatedProducts = results
                .filter(result => result.status === 'fulfilled' && result.value?.success)
                .map(result => result.value.product);
            
            if (updatedProducts.length > 0) {
                setProducts(prev => prev.map(p => {
                    const updated = updatedProducts.find(up => up._id === p._id);
                    return updated ? { ...p, ...updated } : p;
                }));
                setSelectedProducts(new Set());
            }
        } catch (error) {
            console.error('Failed to update products:', error);
        }
    };

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const stats = {
        total: products.length,
        active: products.length,
        lowStock: products.filter(p => (p.numberOfProductsAvailable || 0) < 20 && (p.numberOfProductsAvailable || 0) > 0).length,
        outOfStock: products.filter(p => (p.numberOfProductsAvailable || 0) === 0).length,
        featured: products.filter(p => p.featured).length,
        totalValue: products.reduce((sum, p) => sum + (p.productPrice || 0) * (p.numberOfProductsAvailable || 0), 0)
    };

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-[2000px] mx-auto animate-fade-in">
            {/* Hero Header with Vibrant Gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-6 md:p-8 shadow-2xl shadow-purple-500/30">
                <div className="absolute inset-0 bg-white/5 opacity-20"></div>
                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Product Management</h1>
                                <p className="text-white/80 text-lg">Manage your entire product catalog in one place</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 text-white/90">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Last updated: Just now</span>
                            </div>
                            <button 
                                onClick={fetchProducts} 
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all hover:scale-105 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all hover:scale-105 active:scale-95">
                            <Download size={18} />
                            <span>Export Data</span>
                        </button>
                        <button 
                            onClick={() => setOpenForm(true)} 
                            className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold bg-gradient-to-r from-white to-gray-100 text-purple-600 rounded-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all active:translate-y-0 shadow-lg"
                        >
                            <Plus size={18} />
                            <span>Add New Product</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Colorful Stats Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <StatCard 
                    icon={Package} 
                    label="Total Products" 
                    value={stats.total} 
                    change="+12%" 
                    color="from-blue-500 to-cyan-500"
                    delay={100}
                />
                <StatCard 
                    icon={TrendingUp} 
                    label="Active" 
                    value={stats.active} 
                    change="+8%" 
                    color="from-emerald-500 to-green-500"
                    delay={150}
                />
                <StatCard 
                    icon={AlertTriangle} 
                    label="Low Stock" 
                    value={stats.lowStock} 
                    change="-3%" 
                    color="from-amber-500 to-yellow-500"
                    delay={200}
                />
                <StatCard 
                    icon={X} 
                    label="Out of Stock" 
                    value={stats.outOfStock} 
                    change="+2%" 
                    color="from-rose-500 to-red-500"
                    delay={250}
                />
                <StatCard 
                    icon={Star} 
                    label="Featured" 
                    value={stats.featured} 
                    change="+15%" 
                    color="from-purple-500 to-pink-500"
                    delay={300}
                />
               {/*  <StatCard 
                    icon={DollarSign} 
                    label="Total Value" 
                    value={`₵${stats.totalValue.toLocaleString()}`} 
                    change="+23%" 
                    color="from-orange-500 to-amber-500"
                    delay={350}
                /> */}
            </div>

            {/* Control Panel */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors z-10" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products by name, SKU, description..."
                                className="relative w-full pl-12 pr-4 py-3.5 text-sm border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all z-10 bg-white"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-3 text-sm font-medium border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all bg-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat._id}>{cat.categoryName}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 text-sm font-medium border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="in-stock">In Stock</option>
                            <option value="low-stock">Low Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                            <option value="featured">Featured</option>
                        </select>

                        <button className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all hover:border-purple-500 group">
                            <Filter size={18} className="group-hover:text-purple-600 transition-colors" />
                            <span>Advanced Filters</span>
                        </button>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedProducts.size > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-blue-200 animate-slide-down">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">
                                        {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
                                    </p>
                                    <p className="text-xs text-gray-600">Select an action to perform</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleBulkFeatured}
                                    className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                >
                                    <Star size={14} />
                                    Mark Featured
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    Delete Selected
                                </button>
                                <button
                                    onClick={() => setSelectedProducts(new Set())}
                                    className="px-4 py-2.5 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all border-2 border-gray-300"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Products Grid/List */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="inline-flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-800">Loading Products</p>
                                <p className="text-sm text-gray-500">Fetching your product catalog...</p>
                            </div>
                        </div>
                    </div>
                ) : displayedProducts.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="inline-flex flex-col items-center gap-4 max-w-md">
                            <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl">
                                <Package size={48} className="text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-800 mb-2">No products found</p>
                                <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayedProducts.map((product, index) => (
                                <ProductGridCard
                                    key={product._id}
                                    product={product}
                                    index={index}
                                    selected={selectedProducts.has(product._id)}
                                    onToggle={() => toggleProduct(product._id)}
                                    onUpdate={async (payload) => {
                                        const res = await updateProduct(product._id, payload);
                                        if (res?.success) {
                                            setProducts(prev => prev.map(p => p._id === product._id ? res.product : p));
                                        }
                                    }}
                                    onDelete={async () => {
                                        if (window.confirm('Delete this product?')) {
                                            const res = await deleteProduct(product._id);
                                            if (res.success) {
                                                setProducts(prev => prev.filter(p => p._id !== product._id));
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 w-14">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.size === displayedProducts.length && displayedProducts.length > 0}
                                            onChange={toggleAll}
                                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-600/30 cursor-pointer"
                                        />
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider px-6 py-4">
                                        Product
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider px-6 py-4">
                                        Category
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider px-6 py-4">
                                        Price
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider px-6 py-4">
                                        Stock
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider px-6 py-4">
                                        Status
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider px-6 py-4">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {displayedProducts.map((product, index) => (
                                    <ProductListRow
                                        key={product._id}
                                        product={product}
                                        index={index}
                                        selected={selectedProducts.has(product._id)}
                                        onToggle={() => toggleProduct(product._id)}
                                        onUpdate={async (payload) => {
                                            const res = await updateProduct(product._id, payload);
                                            if (res?.success) {
                                                setProducts(prev => prev.map(p => p._id === product._id ? res.product : p));
                                            }
                                        }}
                                        onDelete={async () => {
                                            if (window.confirm('Delete this product?')) {
                                                const res = await deleteProduct(product._id);
                                                if (res.success) {
                                                    setProducts(prev => prev.filter(p => p._id !== product._id));
                                                }
                                            }
                                        }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && displayedProducts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl border-2 border-gray-200 shadow-lg">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-bold text-gray-800">{displayedProducts.length}</span> of{' '}
                        <span className="font-bold text-gray-800">{products.length}</span> products
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:border-purple-500 hover:scale-105">
                            <ChevronLeft size={18} className="text-gray-600" />
                        </button>
                        <button className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-md">
                            1
                        </button>
                        <button className="px-4 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:scale-105">
                            2
                        </button>
                        <button className="px-4 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:scale-105">
                            3
                        </button>
                        <span className="px-2 text-gray-400">...</span>
                        <button className="px-4 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:scale-105">
                            10
                        </button>
                        <button className="p-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:border-purple-500 hover:scale-105">
                            <ChevronRight size={18} className="text-gray-600" />
                        </button>
                    </div>
                    <div className="text-sm text-gray-600">
                        <select className="px-3 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 bg-white">
                            <option>10 per page</option>
                            <option>25 per page</option>
                            <option>50 per page</option>
                        </select>
                    </div>
                </div>
            )}

            <ProductForm open={openForm} onClose={() => setOpenForm(false)} onCreated={(prod) => setProducts(prev => [prod, ...prev])} />
        </div>
    );
}

function ProductGridCard({ product, index, selected, onToggle, onUpdate, onDelete }) {
    const [newPrice, setNewPrice] = useState(product.productPrice);
    const [updating, setUpdating] = useState(false);

    const handlePriceUpdate = async () => {
        setUpdating(true);
        await onUpdate({ productPrice: Number(newPrice) });
        setUpdating(false);
    };

    return (
        <div 
            className={`relative group rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-scale-in ${
                selected 
                    ? 'border-purple-500 bg-gradient-to-br from-blue-50 to-purple-50' 
                    : 'border-gray-200 hover:border-purple-500/50'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Selection Checkbox */}
            <div className="absolute top-4 left-4 z-10">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                    className="w-5 h-5 rounded-full border-2 border-gray-300 checked:border-purple-600 checked:bg-purple-600 focus:ring-2 focus:ring-purple-600/30 cursor-pointer"
                />
            </div>

            {/* Featured Badge */}
            {product.featured && (
                <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold rounded-full">
                        <Star size={10} />
                        Featured
                    </div>
                </div>
            )}

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
                {product.productImage ? (
                    <img 
                        src={product.productImage.startsWith('http') ? product.productImage : `${window.location.origin}${product.productImage}`}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = `https://placehold.co/400x300/cccccc/969696?text=${encodeURIComponent(product.productName?.substring(0, 20) || 'Product')}`;
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Package size={48} className="text-gray-400" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Category */}
                <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold rounded-lg">
                        <Tag size={10} />
                        {product.category?.categoryName || 'Uncategorized'}
                    </span>
                </div>

                {/* Name & Description */}
                <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-purple-600 transition-colors">
                    {product.productName}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {product.description || 'No description available'}
                </p>

                {/* Price & Stock */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-800">
                                ${product.productPrice?.toFixed(2) || '0.00'}
                            </span>
                            {product.discountPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                    ${product.discountPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        {/* Quick Price Edit */}
                        <div className="flex items-center gap-2 mt-2">
                            <input 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                value={newPrice} 
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-lg"
                            />
                            <button 
                                onClick={handlePriceUpdate}
                                disabled={updating}
                                className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                                {updating ? '...' : 'Update'}
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <StockIndicator stock={product.numberOfProductsAvailable || 0} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <button 
                        onClick={() => {/* Implement quick edit */}}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    >
                        <Edit size={14} />
                        Quick Edit
                    </button>
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                            <Eye size={16} />
                        </button>
                        <button 
                            onClick={onDelete}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductListRow({ product, index, selected, onToggle, onUpdate, onDelete }) {
    const [newPrice, setNewPrice] = useState(product.productPrice);
    const [updating, setUpdating] = useState(false);

    const handlePriceUpdate = async () => {
        setUpdating(true);
        await onUpdate({ productPrice: Number(newPrice) });
        setUpdating(false);
    };

    return (
        <tr 
            className={`group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 ${
                selected ? 'bg-blue-50' : ''
            }`}
        >
            <td className="px-6 py-4">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-600/30 cursor-pointer"
                />
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0 group-hover:border-purple-500/50 transition-all">
                        {product.productImage ? (
                            <img 
                                src={product.productImage.startsWith('http') ? product.productImage : `${window.location.origin}${product.productImage}`}
                                alt={product.productName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/100x100/cccccc/969696?text=${encodeURIComponent(product.productName?.charAt(0) || 'P')}`;
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-gray-400" />
                            </div>
                        )}
                        {product.featured && (
                            <div className="absolute -top-1 -right-1">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                            {product.productName}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                            {product.description || 'No description'}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold rounded-lg">
                    <Tag size={10} />
                    {product.category?.categoryName || 'Uncategorized'}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-800">
                            ${product.productPrice?.toFixed(2) || '0.00'}
                        </span>
                        {product.discountPrice && (
                            <span className="text-xs text-gray-500 line-through">
                                ${product.discountPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            value={newPrice} 
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg"
                        />
                        <button 
                            onClick={handlePriceUpdate}
                            disabled={updating}
                            className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            {updating ? '...' : 'Save'}
                        </button>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <StockIndicator stock={product.numberOfProductsAvailable || 0} showLabel />
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-800"></span>
                        Active
                    </span>
                    {product.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 text-xs font-bold rounded-full">
                            <Star size={10} />
                            Featured
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-all hover:scale-110">
                        <Eye size={16} />
                    </button>
                    <button 
                        onClick={() => {/* Implement quick edit */}}
                        className="p-2 hover:bg-purple-50 text-gray-400 hover:text-purple-500 rounded-lg transition-all hover:scale-110"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={onDelete}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all hover:scale-110"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function StockIndicator({ stock, showLabel = false }) {
    const getStockConfig = (stock) => {
        if (stock === 0) {
            return { 
                color: 'from-rose-500 to-red-500', 
                icon: Battery,
                bg: 'bg-red-50',
                textColor: 'text-red-700',
                text: 'Out of Stock'
            };
        } else if (stock < 10) {
            return { 
                color: 'from-amber-500 to-orange-500', 
                icon: BatteryLow,
                bg: 'bg-orange-50',
                textColor: 'text-orange-700',
                text: 'Very Low'
            };
        } else if (stock < 20) {
            return { 
                color: 'from-yellow-500 to-amber-500', 
                icon: BatteryMedium,
                bg: 'bg-amber-50',
                textColor: 'text-amber-700',
                text: 'Low Stock'
            };
        } else {
            return { 
                color: 'from-emerald-500 to-green-500', 
                icon: BatteryFull,
                bg: 'bg-green-50',
                textColor: 'text-green-700',
                text: 'In Stock'
            };
        }
    };

    const config = getStockConfig(stock);
    const Icon = config.icon;

    return (
        <div className="flex items-center gap-2">
            <div className="relative w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`absolute left-0 top-0 h-full bg-gradient-to-r ${config.color} rounded-full`}
                    style={{ width: `${Math.min((stock / 100) * 100, 100)}%` }}
                ></div>
            </div>
            <div className="flex items-center gap-1">
                <Icon size={14} className={config.textColor} />
                {showLabel ? (
                    <span className={`text-xs font-bold ${config.textColor}`}>
                        {stock} units
                    </span>
                ) : (
                    <span className={`px-2 py-1 text-xs font-bold rounded-lg ${config.bg} ${config.textColor}`}>
                        {stock}
                    </span>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, change, color, delay }) {
    const isPositive = change?.startsWith('+');
    
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border-2 p-6 bg-gradient-to-br shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up group",
                `border-transparent ${color}`
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-white/90 group-hover:bg-white/80 transition-colors rounded-2xl"></div>
            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                    {change && (
                        <p className={`text-xs font-semibold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {change} this month
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-xl", `bg-gradient-to-br ${color}`)}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );
}