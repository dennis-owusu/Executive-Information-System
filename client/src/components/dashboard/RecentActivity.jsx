import React from 'react';
import {
    ShoppingBag,
    Package,
    Users,
    ArrowRight,
    Clock,
    DollarSign,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// Format relative time
const formatRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
};

// Status configuration
const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
    pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
    processing: { icon: AlertCircle, color: 'text-info', bg: 'bg-info/10', label: 'Processing' },
    cancelled: { icon: XCircle, color: 'text-error', bg: 'bg-error/10', label: 'Cancelled' },
    active: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Active' },
    inactive: { icon: XCircle, color: 'text-error', bg: 'bg-error/10', label: 'Inactive' }
};

// Status Badge Component
function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
            config.bg, config.color
        )}>
            <Icon size={12} />
            <span>{config.label}</span>
        </div>
    );
}

// Order Item Component
function OrderItem({ order, index }) {
    return (
        <div
            className="group flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer animate-slide-in-right"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ShoppingBag size={22} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {order.customer || 'Customer Order'}
                    </p>
                    <p className="text-sm font-bold text-gray-900 ml-2">
                        {formatCurrency(order.totalAmount || order.total || 0)}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        {formatRelativeTime(order.createdAt)}
                    </p>
                    <StatusBadge status={order.status || 'pending'} />
                </div>
            </div>
        </div>
    );
}

// Product Item Component
function ProductItem({ product, index }) {
    return (
        <div
            className="group flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer animate-slide-in-right"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Product Image */}
            <div className="w-14 h-14 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                {product.productImage ? (
                    <img
                        src={product.productImage.startsWith('http') ? product.productImage : `${window.location.origin}${product.productImage}`}
                        alt={product.productName || product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-gray-300" />
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{product.productName || product.name}</p>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-medium text-primary">
                        {formatCurrency(product.productPrice || product.price || 0)}
                    </span>
                    <span className="text-xs text-gray-500">
                        Stock: {product.numberOfProductsAvailable || product.stock || 0}
                    </span>
                </div>
            </div>

            {/* Active Status */}
            <StatusBadge status={product.isActive ? 'active' : 'inactive'} />
        </div>
    );
}

// Recent Orders Section
export function RecentOrders({ orders = [], onAddProduct, onViewAll }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag size={20} className="text-primary" />
                        Recent Orders
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">Latest transactions</p>
                </div>
                {onViewAll && (
                    <a
                        href="/orders"
                        onClick={(e) => { e.preventDefault(); onViewAll(); }}
                        className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors group"
                        aria-label="View all orders"
                    >
                        View All
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                )}
            </div>

            {/* Orders List */}
            <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto custom-scrollbar">
                {orders.length > 0 ? (
                    orders.slice(0, 5).map((order, i) => (
                        <OrderItem key={order._id || i} order={order} index={i} />
                    ))
                ) : (
                    <div className="p-10 text-center">
                        <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
                        <p className="text-gray-500 font-medium">No recent orders</p>
                        <p className="text-sm text-gray-400 mt-1">Orders will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Recent Products Section
export function RecentProducts({ products = [], onAddProduct, onViewAll }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Package size={20} className="text-accent" />
                        Recent Products
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">Latest additions</p>
                </div>
                {onViewAll && (
                    <a
                        href="/products"
                        onClick={(e) => { e.preventDefault(); onViewAll(); }}
                        className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors group"
                        aria-label="View all products"
                    >
                        View All
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                )}
            </div>

            {/* Products List */}
            <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto custom-scrollbar">
                {products.length > 0 ? (
                    products.slice(0, 5).map((product, i) => (
                        <ProductItem key={product._id || i} product={product} index={i} />
                    ))
                ) : (
                    <div className="p-10 text-center">
                        <Package size={48} className="mx-auto mb-4 text-gray-200" />
                        <p className="text-gray-500 font-medium">No products yet</p>
                        <p className="text-sm text-gray-400 mt-1">Add your first product</p>
                        {onAddProduct && (
                            <button
                                onClick={onAddProduct}
                                className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Add Product
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Combined Recent Activity Grid
export default function RecentActivity({ orders = [], products = [], onAddProduct, onViewOrders, onViewProducts }) {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Recent activity">
            <RecentOrders orders={orders} onViewAll={onViewOrders} />
            <RecentProducts products={products} onAddProduct={onAddProduct} onViewAll={onViewProducts} />
        </section>
    );
}
