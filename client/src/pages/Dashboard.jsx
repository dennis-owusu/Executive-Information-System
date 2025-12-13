import React, { useEffect, useState } from 'react';
import { getDashboardStats, getDashboardChartData } from '../services/api';
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
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
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, chartRes] = await Promise.all([
                    getDashboardStats(),
                    getDashboardChartData()
                ]);
                setStats(statsRes);
                setChartData(chartRes);
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue Chart - Takes 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-border shadow-alibaba">
                    <div className="p-6 border-b border-divider">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-base text-foreground">Revenue Trend</h3>
                                <p className="text-sm text-muted-foreground mt-1">Weekly performance overview</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <select className="text-sm border border-input rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>This Week</option>
                                    <option>This Month</option>
                                    <option>This Year</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-[320px]">
                            {chartData && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.labels.map((l, i) => ({
                                        name: l,
                                        value: chartData.datasets[0].data[i],
                                        orders: Math.floor(chartData.datasets[0].data[i] / 50)
                                    }))}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#9CA3AF"
                                            tick={{ fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            tick={{ fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(v) => `$${v}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#FF6A00"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
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
                            {[
                                { name: 'Electronics', value: 45, color: '#FF6A00' },
                                { name: 'Fashion', value: 30, color: '#1890FF' },
                                { name: 'Home & Garden', value: 15, color: '#52C41A' },
                                { name: 'Sports', value: 10, color: '#FAAD14' }
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                            <p className="text-sm font-medium text-foreground">{order.customer}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-foreground">${order.totalAmount}</p>
                                        <span className={cn(
                                            "inline-block text-[10px] px-2 py-0.5 rounded-full font-medium",
                                            order.status === 'completed' && "bg-success/10 text-success",
                                            order.status === 'pending' && "bg-warning/10 text-warning",
                                            order.status === 'cancelled' && "bg-error/10 text-error"
                                        )}>
                                            {order.status}
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
                        <AlertItem
                            type="warning"
                            title="Low Stock Alert"
                            message="5 products are running low on inventory"
                            time="2 hours ago"
                        />
                        <AlertItem
                            type="info"
                            title="New Orders"
                            message="12 new orders received today"
                            time="4 hours ago"
                        />
                        <AlertItem
                            type="success"
                            title="Revenue Milestone"
                            message="You've reached $10,000 in sales this month!"
                            time="1 day ago"
                        />
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
                        {metric.type === 'currency' ? `$${metric.value.toLocaleString()}` : metric.value.toLocaleString()}
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
