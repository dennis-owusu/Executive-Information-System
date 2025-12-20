import React, { useState, useEffect } from 'react';
import ShopNavbar from '../../components/ShopNavbar';
import { Package, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../services/api';

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const statusConfig = {
        pending: { label: 'Pending', icon: Clock, color: 'bg-slate-100 text-slate-700 border-slate-200' },
        delivered: { label: 'Delivered', icon: CheckCircle2, color: 'bg-green-100 text-green-700 border-green-200' },
        processing: { label: 'Processing', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
        shipped: { label: 'Shipped', icon: Truck, color: 'bg-blue-100 text-blue-700 border-blue-200' },
        cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200' },
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="min-h-screen bg-slate-50">
            <ShopNavbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">My Orders</h1>
                    <p className="text-xl text-white/80">Track and manage your purchases</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {[
                        { value: 'all', label: 'All Orders' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'processing', label: 'Processing' },
                        { value: 'shipped', label: 'Shipped' },
                        { value: 'delivered', label: 'Delivered' },
                        { value: 'cancelled', label: 'Cancelled' },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFilter(value)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filter === value
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-3xl p-16 text-center shadow-lg">
                            <Package size={64} className="mx-auto text-slate-200 mb-6" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders found</h3>
                            <p className="text-slate-500 mb-6">You haven't placed any orders yet</p>
                            <Link
                                to="/shop/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        filteredOrders.map((order, index) => (
                            <OrderCard key={order._id} order={order} statusConfig={statusConfig} index={index} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function OrderCard({ order, statusConfig, index }) {
    const [expanded, setExpanded] = useState(false);
    const status = statusConfig[order.status] || statusConfig.processing;
    const StatusIcon = status.icon;

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            <Package size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                            <p className="text-sm text-slate-500">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border ${status.color}`}>
                            <StatusIcon size={14} />
                            {status.label}
                        </span>
                        <div className="text-right">
                            <p className="text-2xl font-black text-purple-600">₵{Number(order.totalPrice || 0).toFixed(2)}</p>
                            <p className="text-xs text-slate-500">{order.products?.length || 0} items</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                    {expanded ? 'Hide Details' : 'View Details'}
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {expanded && (
                <div className="border-t border-slate-100 bg-slate-50 p-6 animate-fade-in">
                    <div className="space-y-3">
                        {order.products.map((item, i) => (
                            <div key={i} className="flex gap-4 items-center bg-white p-3 rounded-xl">
                                <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                    {item?.product?.productImage && <img src={item.product.productImage.startsWith('http') ? item.product.productImage : `http://localhost:4000${item.product.productImage}`} alt={item.product?.productName || item.product?.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{item.product?.productName || item.product?.name}</p>
                                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-slate-900">₵{Number(item.product?.productPrice || item.product?.price || 0).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2">Shipping To:</h4>
                        <p className="text-sm text-slate-600">{order.userInfo?.name}</p>
                        <p className="text-sm text-slate-600">{order.address}</p>
                        <p className="text-sm text-slate-600">{order.city}{order.state ? `, ${order.state}` : ''}{order.postalCode ? ` ${order.postalCode}` : ''}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
