import React, { useState } from 'react';
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

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock orders data
    const orders = [
        { id: 'ORD-1001', customer: 'Alice Corp', amount: 1299.99, status: 'completed', items: 3, date: '2024-12-12' },
        { id: 'ORD-1002', customer: 'Bob Industries', amount: 2499.50, status: 'pending', items: 5, date: '2024-12-12' },
        { id: 'ORD-1003', customer: 'Charlie Ltd', amount: 899.00, status: 'processing', items: 2, date: '2024-12-11' },
        { id: 'ORD-1004', customer: 'Delta Systems', amount: 3599.99, status: 'completed', items: 8, date: '2024-12-11' },
        { id: 'ORD-1005', customer: 'Echo Enterprises', amount: 599.99, status: 'cancelled', items: 1, date: '2024-12-10' },
        { id: 'ORD-1006', customer: 'Foxtrot Group', amount: 1899.00, status: 'completed', items: 4, date: '2024-12-10' },
    ];

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'primary', trend: '+12%' },
        { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, icon: CheckCircle2, color: 'success', trend: '+8%' },
        { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'warning', trend: '+3' },
        { label: 'Total Revenue', value: `$${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}`, icon: DollarSign, color: 'accent', trend: '+15%' },
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
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-primary p-8 shadow-alibaba-lg">
                <div className="absolute inset-0 bg-grid opacity-10"></div>
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
                        <p className="text-white/90">Track and manage customer orders in real-time</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all hover:scale-105">
                            <Download size={18} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-white text-accent rounded-xl hover:shadow-lg transition-all hover:scale-105">
                            <Calendar size={18} />
                            <span>Filter Date</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} delay={i * 100} />
                ))}
            </div>

            {/* Filters */}
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
                        <option value="completed">Completed</option>
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

            {/* Orders Table */}
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
                                <tr key={order.id} className="group hover:bg-surface-secondary transition-all animate-scale-in" style={{ animationDelay: `${i * 30}ms` }}>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono font-semibold text-primary">{order.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                                {order.customer[0]}
                                            </div>
                                            <span className="text-sm font-medium text-foreground">{order.customer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-foreground">{order.items} items</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-base font-bold text-primary">${order.amount.toLocaleString()}</span>
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
