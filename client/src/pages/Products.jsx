import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Download,
    ChevronLeft,
    ChevronRight,
    Package,
    TrendingUp,
    AlertCircle,
    Star
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedProducts, setSelectedProducts] = useState(new Set());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts({ limit: 50 });
                setProducts(data.items || []);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const displayedProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
            {/* Header with Gradient */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-8 shadow-alibaba-lg">
                <div className="absolute inset-0 bg-grid opacity-10"></div>
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Product Catalog</h1>
                        <p className="text-white/90">Manage your inventory and product listings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all hover:scale-105">
                            <Download size={18} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-white text-primary rounded-xl hover:shadow-lg transition-all hover:scale-105">
                            <Plus size={18} />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={Package} label="Total Products" value={products.length} color="primary" delay={100} />
                <StatCard icon={TrendingUp} label="Active" value={products.filter(p => p.isActive).length} color="success" delay={200} />
                <StatCard icon={AlertCircle} label="Low Stock" value={products.filter(p => p.stock < 20).length} color="warning" delay={300} />
                <StatCard icon={Star} label="Out of Stock" value={products.filter(p => p.stock === 0).length} color="error" delay={400} />
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up animation-delay-200">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative group">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by product name, SKU, or description..."
                                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                        </div>
                    </div>

                    <select className="px-4 py-3 text-sm font-medium border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all">
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Office</option>
                        <option>Accessories</option>
                    </select>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-3 text-sm font-medium border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium border-2 border-border rounded-xl hover:bg-secondary transition-all">
                        <Filter size={18} />
                        <span>More</span>
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-border shadow-alibaba overflow-hidden animate-slide-up animation-delay-300">
                {/* Table Header Actions */}
                {selectedProducts.size > 0 && (
                    <div className="px-6 py-4 bg-primary/5 border-b border-divider flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                            {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                Bulk Edit
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors">
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-secondary border-b-2 border-divider">
                            <tr>
                                <th className="text-left px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.size === displayedProducts.length && displayedProducts.length > 0}
                                        onChange={toggleAll}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                    />
                                </th>
                                <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">
                                    Product
                                </th>
                                <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">
                                    SKU
                                </th>
                                <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">
                                    Category
                                </th>
                                <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">
                                    Price
                                </th>
                                <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">
                                    Stock
                                </th>
                                <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">
                                    Status
                                </th>
                                <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-divider">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center">
                                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-3"></div>
                                        <p className="text-sm text-muted-foreground">Loading products...</p>
                                    </td>
                                </tr>
                            ) : displayedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center">
                                        <Package size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                                        <p className="text-sm font-medium text-foreground">No products found</p>
                                        <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            ) : (
                                displayedProducts.map((product, index) => (
                                    <ProductRow
                                        key={product._id}
                                        product={product}
                                        index={index}
                                        selected={selectedProducts.has(product._id)}
                                        onToggle={() => toggleProduct(product._id)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && displayedProducts.length > 0 && (
                    <div className="px-6 py-4 border-t border-divider flex items-center justify-between bg-surface-secondary">
                        <div className="text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{displayedProducts.length}</span> of <span className="font-semibold text-foreground">{products.length}</span> products
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 border-2 border-border rounded-lg hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:scale-105 transition-all">
                                1
                            </button>
                            <button className="px-4 py-2 border-2 border-border rounded-lg hover:bg-secondary transition-all hover:scale-105">
                                2
                            </button>
                            <button className="px-4 py-2 border-2 border-border rounded-lg hover:bg-secondary transition-all hover:scale-105">
                                3
                            </button>
                            <button className="p-2 border-2 border-border rounded-lg hover:bg-secondary transition-all hover:scale-105">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductRow({ product, index, selected, onToggle }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <tr
            className="group hover:bg-surface-secondary transition-all duration-200 animate-scale-in"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <td className="px-6 py-4">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl border-2 border-border bg-surface-secondary overflow-hidden flex-shrink-0 group-hover:border-primary/30 transition-all">
                        {product.images?.[0]?.url ? (
                            <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f0f0f0" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} className="text-muted-foreground opacity-40" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {product.description}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm font-mono text-muted-foreground bg-surface-secondary px-3 py-1 rounded-lg">
                    {product.sku || 'N/A'}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                    {product.categories?.slice(0, 2).map((cat, i) => (
                        <span key={i} className="inline-block px-2 py-1 text-xs bg-accent/10 text-accent rounded-md font-medium">
                            {cat}
                        </span>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-base font-bold text-primary">${product.price}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-sm font-bold",
                        product.stock < 10 ? "text-error" :
                            product.stock < 30 ? "text-warning" :
                                "text-success"
                    )}>
                        {product.stock}
                    </span>
                    {product.stock < 20 && product.stock > 0 && (
                        <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
                    )}
                    {product.stock === 0 && (
                        <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full font-semibold">
                            Out
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full",
                    product.isActive
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                )}>
                    <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        product.isActive ? "bg-success" : "bg-error"
                    )}></span>
                    {product.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-all hover:scale-110">
                        <Eye size={16} />
                    </button>
                    <button className="p-2 hover:bg-accent/10 text-muted-foreground hover:text-accent rounded-lg transition-all hover:scale-110">
                        <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-error/10 text-muted-foreground hover:text-error rounded-lg transition-all hover:scale-110">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function StatCard({ icon: Icon, label, value, color, delay }) {
    const colors = {
        primary: 'from-primary/20 to-primary/5 border-primary/20 text-primary',
        success: 'from-success/20 to-success/5 border-success/20 text-success',
        warning: 'from-warning/20 to-warning/5 border-warning/20 text-warning',
        error: 'from-error/20 to-error/5 border-error/20 text-error'
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border-2 p-6 bg-gradient-to-br shadow-sm hover:shadow-alibaba transition-all duration-300 hover:-translate-y-1 animate-slide-up",
                colors[color]
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                    <p className="text-3xl font-bold text-foreground">{value}</p>
                </div>
                <div className={cn("p-4 rounded-xl bg-white/50 backdrop-blur-sm")}>
                    <Icon size={28} />
                </div>
            </div>
        </div>
    );
}
