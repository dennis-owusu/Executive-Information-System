import React, { useState, useEffect } from 'react';
import ShopNavbar from '../../components/ShopNavbar';
import { Package, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyOrders, updateOrder } from '../../services/api';
import { getUserData } from '../../utils/auth';

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userData = getUserData();
                console.log('User data:', userData);
                
                if (!userData || !userData._id) {
                    console.log('No user data found, cannot fetch orders');
                    setOrders([]);
                    setLoading(false);
                    return;
                }
                
                // Get the user ID from localStorage
                const userId = userData._id;
                console.log('Fetching orders for user ID:', userId);
                
                const data = await getMyOrders();
                console.log('MyOrders data:', data);
                console.log('MyOrders response type:', typeof data);
                console.log('MyOrders response keys:', Object.keys(data));
                
                // Handle different response formats
                let ordersData = [];
                if (data && typeof data === 'object') {
                    if (Array.isArray(data)) {
                        ordersData = data;
                    } else if (data.orders && Array.isArray(data.orders)) {
                        ordersData = data.orders;
                    } else if (data.data && Array.isArray(data.data)) {
                        ordersData = data.data;
                    }
                }
                
                console.log('Processed orders data:', ordersData);
                console.log('Number of orders found:', ordersData.length);
                
                if (ordersData.length > 0) {
                    console.log('First order structure:', JSON.stringify(ordersData[0], null, 2));
                    console.log('First order userInfo:', ordersData[0].userInfo);
                    console.log('First order userInfo type:', typeof ordersData[0].userInfo);
                    console.log('First order userInfo.name:', ordersData[0].userInfo?.name);
                    console.log('First order userInfo.name type:', typeof ordersData[0].userInfo?.name);
                    console.log('First order status:', ordersData[0].status);
                    console.log('First order products count:', ordersData[0].products?.length);
                }
                setOrders(ordersData);
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

    const filteredOrders = filter === 'all' ? orders : (Array.isArray(orders) ? orders.filter(o => o.status === filter) : []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const updatedOrder = await updateOrder(orderId, { status: newStatus });
            // Update the local state to reflect the change
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Failed to update order status:', error);
            throw error;
        }
    };

    const loadAllOrders = async () => {
        try {
            setLoading(true);
            const data = await getMyOrders();
            console.log('All orders data:', data);
            
            // Handle different response formats
            let ordersData = [];
            if (data && typeof data === 'object') {
                if (Array.isArray(data)) {
                    ordersData = data;
                } else if (data.orders && Array.isArray(data.orders)) {
                    ordersData = data.orders;
                } else if (data.data && Array.isArray(data.data)) {
                    ordersData = data.data;
                }
            }
            
            setOrders(ordersData);
            console.log('Loaded orders:', ordersData);
        } catch (error) {
            console.error('Failed to load all orders:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <ShopNavbar />
            
            {/* Debug Info */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info:</h3>
                    <p className="text-sm text-yellow-700">Total Orders: {orders.length}</p>
                    <p className="text-sm text-yellow-700">Loading: {loading ? 'Yes' : 'No'}</p>
                    <p className="text-sm text-yellow-700">Filter: {filter}</p>
                    <p className="text-sm text-yellow-700">Filtered Orders: {filteredOrders.length}</p>
                </div>
            </div>

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
                            <OrderCard key={order._id} order={order} statusConfig={statusConfig} index={index} onStatusUpdate={handleStatusUpdate} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function OrderCard({ order, statusConfig, index, onStatusUpdate }) {
    const [expanded, setExpanded] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const status = statusConfig[order.status] || statusConfig.processing;
    const StatusIcon = status.icon;

    const handleStatusChange = async (newStatus) => {
        if (newStatus === order.status) return;
        
        setUpdatingStatus(true);
        try {
            await onStatusUpdate(order._id, newStatus);
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status. Please try again.');
        } finally {
            setUpdatingStatus(false);
        }
    };

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
                        {/* Status Update Dropdown */}
                        <div className="relative">
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={updatingStatus}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border appearance-none cursor-pointer ${status.color} ${updatingStatus ? 'opacity-50' : ''}`}
                                style={{ backgroundColor: 'transparent' }}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            {updatingStatus && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
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
                                    {item?.product?.productImage && <img src={item.product.productImage.startsWith('http') ? item.product.productImage : `${window.location.origin}${item.product.productImage}`} alt={item.product?.productName || item.product?.name} className="w-full h-full object-cover" />}
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
                        <p className="text-sm text-slate-600">
                            {(() => {
                                const name = order.userInfo?.name;
                                if (typeof name === 'string') return name;
                                if (typeof name === 'object' && name && typeof name.name === 'string') return name.name;
                                return 'Guest Customer';
                            })()}
                        </p>
                        <p className="text-sm text-slate-600">{order.address}</p>
                        <p className="text-sm text-slate-600">{order.city}{order.state ? `, ${order.state}` : ''}{order.postalCode ? ` ${order.postalCode}` : ''}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
