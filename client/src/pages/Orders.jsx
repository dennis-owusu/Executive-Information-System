import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Search,
    Filter,
    Download,
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    DollarSign,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getMyOrders, getAllOrders } from '../services/api';
import { getUserRole, hasRole } from '../utils/auth';

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real orders from API
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            
            // Check if user is admin/executive to fetch all orders
            const userRole = getUserRole();
            const isAdmin = hasRole(['admin', 'executive', 'outlet']);
            
            console.log('User role:', userRole);
            console.log('Is admin:', isAdmin);
            
            let response;
            if (isAdmin) {
                console.log('Fetching all orders (admin view)');
                response = await getAllOrders();
            } else {
                console.log('Fetching user orders (customer view)');
                response = await getMyOrders();
            }
            
            console.log('Orders API response:', response);
            
            // Handle different response formats
            if (response.orders) {
                setOrders(response.orders);
            } else if (Array.isArray(response)) {
                setOrders(response);
            } else {
                console.warn('Unexpected orders response format:', response);
                setOrders([]);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats from real orders data
    const stats = [
        { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'primary', trend: '+12%' },
        { label: 'Completed', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle2, color: 'success', trend: '+8%' },
        { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'warning', trend: '+3' },
        { label: 'Total Revenue', value: `$${orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'accent', trend: '+15%' },
    ];

    const statusColors = {
        completed: 'bg-success/10 text-success',
        pending: 'bg-warning/10 text-warning',
        processing: 'bg-accent/10 text-accent',
        cancelled: 'bg-error/10 text-error'
    };

    return (
        <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
            {/* Header */}
            {/* Header with Gradient */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 shadow-xl">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 bg-grid opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
                        <p className="text-emerald-50">Track and manage customer orders in real-time</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                            <Download size={18} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 text-sm font-bold bg-white text-teal-600 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                            <Calendar size={18} />
                            <span>Filter Date</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-2xl border border-border shadow-alibaba p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading orders...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-white rounded-2xl border border-border shadow-alibaba p-8 text-center">
                    <div className="text-error mb-4">
                        <XCircle size={48} className="mx-auto" />
                    </div>
                    <p className="text-foreground font-medium mb-2">Error Loading Orders</p>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button 
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* No Orders State */}
            {!loading && !error && orders.length === 0 && (
                <div className="bg-white rounded-2xl border border-border shadow-alibaba p-8 text-center">
                    <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-foreground font-medium mb-2">No Orders Found</p>
                    <p className="text-muted-foreground">You don't have any orders yet.</p>
                </div>
            )}

            {/* Stats - Only show if we have orders */}
            {!loading && !error && orders.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} delay={i * 100} />
                    ))}
                </div>
            )}

            {/* Filters - Only show if we have orders */}
            {!loading && !error && orders.length > 0 && (
                <div className="bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up animation-delay-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative group">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by order ID, customer name..."
                                    className="w-full pl-12 pr-4 py-3 text-sm border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 text-sm font-medium border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        >
                            <option value="all">All Status</option>
                            <option value="delivered">Delivered</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium border-2 border-border rounded-xl hover:bg-secondary transition-all">
                            <Filter size={18} />
                            <span>More</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Orders Table - Only show if we have orders */}
            {!loading && !error && orders.length > 0 && (
                <div className="bg-white rounded-2xl border border-border shadow-alibaba overflow-hidden animate-slide-up animation-delay-300">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-secondary border-b-2 border-divider">
                                <tr>
                                    <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">Order ID</th>
                                    <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">Customer</th>
                                    <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">Date</th>
                                    <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">Items</th>
                                    <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">Amount</th>
                                    <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">Status</th>
                                    <th className="text-left text-xs font-bold text-foreground uppercase tracking-wider px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-divider">
                                {orders.map((order, i) => (
                                    <tr key={order._id} className="group hover:bg-surface-secondary transition-all animate-scale-in" style={{ animationDelay: `${i * 30}ms` }}>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono font-semibold text-primary">{order.orderNumber}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                                    {(order.userInfo?.name || 'Unknown')[0]}
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {order.userInfo?.name || 'Guest Customer'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-foreground">
                                                {order.products?.length || 0} items
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-base font-bold text-primary">
                                                ${(order.totalPrice || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full capitalize", statusColors[order.status])}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                                                View Details
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, trend, delay }) {
    const colors = {
        primary: 'from-primary/20 to-primary/5 border-primary/20 text-primary',
        success: 'from-success/20 to-success/5 border-success/20 text-success',
        warning: 'from-warning/20 to-warning/5 border-warning/20 text-warning',
        accent: 'from-accent/20 to-accent/5 border-accent/20 text-accent'
    };

    return (
        <div
            className={cn("relative overflow-hidden rounded-2xl border-2 p-6 bg-gradient-to-br shadow-sm hover:shadow-alibaba transition-all duration-300 hover:-translate-y-1 animate-slide-up", colors[color])}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                    <p className="text-3xl font-bold text-foreground">{value}</p>
                    {trend && <p className="text-xs font-semibold mt-2 opacity-70">{trend} from last period</p>}
                </div>
                <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                    <Icon size={28} />
                </div>
            </div>
        </div>
    );
}
