import React, { useEffect, useState } from 'react';
import { getDashboardStats, getAnalytics, getCategories } from '../services/api';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    AlertTriangle,
    Users,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Calendar,
    Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [salesChartData, setSalesChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week');
    const [systemAlerts, setSystemAlerts] = useState([]);

            useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes, categoriesRes] = await Promise.all([
                    getDashboardStats(),
                    getAnalytics({ period: 'weekly' }),
                    getCategories()
                ]);
                console.log('Dashboard stats response:', statsRes);
                console.log('Dashboard recentOrders:', statsRes?.recentOrders);
                if (statsRes?.recentOrders && statsRes.recentOrders.length > 0) {
                    console.log('First recentOrder:', JSON.stringify(statsRes.recentOrders[0], null, 2));
                    console.log('First recentOrder customer:', statsRes.recentOrders[0].customer);
                    console.log('First recentOrder customer type:', typeof statsRes.recentOrders[0].customer);
                    console.log('First recentOrder totalAmount:', statsRes.recentOrders[0].totalAmount);
                    console.log('First recentOrder totalAmount type:', typeof statsRes.recentOrders[0].totalAmount);
                    console.log('First recentOrder status:', statsRes.recentOrders[0].status);
                    console.log('First recentOrder status type:', typeof statsRes.recentOrders[0].status);
                }
                setStats(statsRes);
                setTopProducts(analyticsRes.data?.topProducts || []);
                // The API returns { allCategory: [...] }
                console.log('Dashboard categories response:', categoriesRes);
                const categoriesData = categoriesRes.allCategory || categoriesRes.categories || categoriesRes || [];
                console.log('Dashboard processed categories:', categoriesData);
                setCategories(categoriesData);

                // Generate real system alerts based on actual data
                const alerts = [];
                
                // Low stock alert - check if we have products with low inventory
                if (statsRes?.totalProducts > 0) {
                    // For now, show total products as inventory status
                    // TODO: Add actual low stock logic when reorderPoint field is added to Product model
                    alerts.push({
                        type: 'warning',
                        title: 'Inventory Status',
                        message: `${statsRes.totalProducts} products in inventory`,
                        time: 'Just now'
                    });
                }

                // New orders alert - show recent orders activity
                if (statsRes?.recentOrders && statsRes.recentOrders.length > 0) {
                    const recentOrdersCount = statsRes.recentOrders.length;
                    alerts.push({
                        type: 'info',
                        title: 'Recent Orders',
                        message: `${recentOrdersCount} recent orders received`,
                        time: 'Just now'
                    });
                }

                // Revenue milestone - use actual sales data
                if (statsRes?.totalSales > 0) {
                    alerts.push({
                        type: 'success',
                        title: 'Revenue Milestone',
                        message: `Total sales: ₵${statsRes.totalSales.toLocaleString()}`,
                        time: 'Just now'
                    });
                }

                // Add pending orders alert if there are any
                if (statsRes?.pendingOrders > 0) {
                    alerts.push({
                        type: 'error',
                        title: 'Pending Orders',
                        message: `${statsRes.pendingOrders} orders awaiting processing`,
                        time: 'Just now'
                    });
                }

                // Add new outlets alert if there are any
                if (statsRes?.newOutlets && statsRes.newOutlets.length > 0) {
                    const newOutletsCount = statsRes.newOutlets.length;
                    alerts.push({
                        type: 'info',
                        title: 'New Outlets',
                        message: `${newOutletsCount} new outlets registered`,
                        time: 'Just now'
                    });
                }

                setSystemAlerts(alerts);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Dashboard Overview</h1>
                    <p className="text-sm text-muted-foreground mt-1">Monitor your business performance in real-time</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors">
                        <Calendar size={16} />
                        <span>Last 7 days</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                        <Filter size={16} />
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats?.metrics?.map((metric, i) => (
                    <KPICard key={i} metric={metric} index={i} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trend Chart */}
                <div className="bg-white rounded-lg border border-border shadow-alibaba">
                    <div className="p-6 border-b border-divider">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-base text-foreground">Sales Trend</h3>
                                <p className="text-sm text-muted-foreground mt-1">Weekly sales performance</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                    +12.5%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Mon', sales: 4000, orders: 24 },
                                    { name: 'Tue', sales: 3000, orders: 18 },
                                    { name: 'Wed', sales: 2000, orders: 12 },
                                    { name: 'Thu', sales: 2780, orders: 16 },
                                    { name: 'Fri', sales: 1890, orders: 11 },
                                    { name: 'Sat', sales: 2390, orders: 14 },
                                    { name: 'Sun', sales: 3490, orders: 21 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                                    <YAxis stroke="#888" fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="bg-white rounded-lg border border-border shadow-alibaba">
                    <div className="p-6 border-b border-divider">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-base text-foreground">Category Distribution</h3>
                                <p className="text-sm text-muted-foreground mt-1">Products by category</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground bg-surface-secondary px-2 py-1 rounded-full">
                                    {categories.length} categories
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categories.slice(0, 5).map((cat, index) => ({
                                            name: cat.categoryName,
                                            value: cat.productCount || Math.floor(Math.random() * 50) + 10,
                                            fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categories.slice(0, 5).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bestseller Products Section */}
            <div className="bg-white rounded-lg border border-border shadow-alibaba">
                <div className="p-6 border-b border-divider">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-base text-foreground">Bestseller Products</h3>
                            <p className="text-sm text-muted-foreground mt-1">Most ordered products this week</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground bg-surface-secondary px-2 py-1 rounded-full">
                                {topProducts.length} products
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {topProducts && topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <div key={product.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                            index === 1 ? 'bg-gray-100 text-gray-800' :
                                            index === 2 ? 'bg-orange-100 text-orange-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{product.name}</p>
                                            {/* <p className="text-xs text-muted-foreground">{product.category || 'Uncategorized'}</p> */}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-foreground">{product.units} units sold</p>
                                        <p className="text-xs text-muted-foreground">₵{product.sales.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Package size={24} className="text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">No bestseller data available</p>
                                <p className="text-xs text-muted-foreground mt-1">Products will appear here once orders are placed</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Products Mini Chart */}
            <div className="bg-white rounded-lg border border-border shadow-alibaba">
                <div className="p-6 border-b border-divider">
                    <h3 className="font-semibold text-base text-foreground">Top Categories</h3>
                    <p className="text-sm text-muted-foreground mt-1">By sales volume</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {categories.length > 0 ? (
                            categories.slice(0, 4).map((category, i) => {
                                const colors = ['#FF6A00', '#1890FF', '#52C41A', '#FAAD14'];
                                const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
                                const percentage = totalProducts > 0 ? Math.round((category.productCount || 0) / totalProducts * 100) : 0;
                                
                                return (
                                    <div key={category._id || i}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-foreground">
                                                {category.categoryName}
                                            </span>
                                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%`, backgroundColor: colors[i % colors.length] }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                No categories available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg border border-border shadow-alibaba">
                    <div className="p-6 border-b border-divider flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-base text-foreground">Recent Orders</h3>
                            <p className="text-sm text-muted-foreground mt-1">Latest transactions</p>
                        </div>
                        <button className="text-sm text-primary hover:text-primary/80 font-medium">
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-divider">
                        {stats?.recentOrders?.slice(0, 5).map((order, i) => (
                            <div key={order._id} className="p-4 hover:bg-surface-secondary transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <ShoppingBag size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {(() => {
                                                    const customer = order.customer;
                                                    if (typeof customer === 'string') return customer;
                                                    if (typeof customer === 'object' && customer && typeof customer.name === 'string') return customer.name;
                                                    return 'Unknown Customer';
                                                })()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(() => {
                                                    const date = order.createdAt;
                                                    if (date) return new Date(date).toLocaleDateString();
                                                    return 'N/A';
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-foreground">
                                            ${(() => {
                                                const amount = order.totalAmount;
                                                if (typeof amount === 'number') return amount.toLocaleString();
                                                if (typeof amount === 'string') return amount;
                                                return '0';
                                            })()}
                                        </p>
                                        <span className={cn(
                                            "inline-block text-[10px] px-2 py-0.5 rounded-full font-medium",
                                            order.status === 'completed' && "bg-success/10 text-success",
                                            order.status === 'pending' && "bg-warning/10 text-warning",
                                            order.status === 'cancelled' && "bg-error/10 text-error"
                                        )}>
                                            {(() => {
                                                const status = order.status;
                                                if (typeof status === 'string') return status;
                                                return 'pending';
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) || (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    No recent orders found
                                </div>
                            )}
                    </div>
                </div>

                {/* Quick Actions / Alerts */}
                <div className="bg-white rounded-lg border border-border shadow-alibaba">
                    <div className="p-6 border-b border-divider">
                        <h3 className="font-semibold text-base text-foreground">System Alerts</h3>
                        <p className="text-sm text-muted-foreground mt-1">Important notifications</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {systemAlerts.length > 0 ? (
                            systemAlerts.map((alert, index) => (
                                <AlertItem
                                    key={index}
                                    type={alert.type}
                                    title={alert.title}
                                    message={alert.message}
                                    time={alert.time}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No system alerts at this time</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ metric, index }) {
    const icons = {
        'currency': DollarSign,
        'number': Users,
        'alert': AlertTriangle
    };
    const Icon = icons[metric.type] || Package;

    const isPositive = metric.trend?.startsWith('+');
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <div className="bg-white rounded-lg border border-border shadow-alibaba p-5 hover:shadow-alibaba-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                    <p className="text-2xl font-semibold text-foreground mt-2">
                        {metric.type === 'currency' ? `₵${metric.value.toLocaleString()}` : metric.value.toLocaleString()}
                    </p>
                    {metric.trend && (
                        <div className="flex items-center gap-1 mt-3">
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                isPositive ? "text-success bg-success/10" : "text-error bg-error/10",
                                metric.trend === 'stable' && "text-info bg-info/10"
                            )}>
                                {metric.trend !== 'stable' && <TrendIcon size={12} />}
                                <span>{metric.trend}</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">vs last period</span>
                        </div>
                    )}
                </div>
                <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    index === 0 && "bg-primary/10 text-primary",
                    index === 1 && "bg-accent/10 text-accent",
                    index === 2 && "bg-warning/10 text-warning",
                    index === 3 && "bg-success/10 text-success"
                )}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}

function AlertItem({ type, title, message, time }) {
    const colors = {
        warning: 'text-warning bg-warning/10',
        info: 'text-info bg-info/10',
        success: 'text-success bg-success/10',
        error: 'text-error bg-error/10'
    };

    return (
        <div className="flex gap-3">
            <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", colors[type])} />
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{message}</p>
                <p className="text-xs text-muted-foreground mt-1">{time}</p>
            </div>
        </div>
    );
}
 