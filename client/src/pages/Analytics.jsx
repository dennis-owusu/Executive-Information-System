import React from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    ShoppingCart,
    Activity,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
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
import { cn } from '../lib/utils';

export default function AnalyticsPage() {
    // Mock data
    const revenueData = [
        { month: 'Jan', revenue: 12000, orders: 120, customers: 89 },
        { month: 'Feb', revenue: 15000, orders: 145, customers: 102 },
        { month: 'Mar', revenue: 18000, orders: 168, customers: 118 },
        { month: 'Apr', revenue: 14500, orders: 132, customers: 95 },
        { month: 'May', revenue: 21000, orders: 195, customers: 145 },
        { month: 'Jun', revenue: 25000, orders: 230, customers: 168 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 45, color: '#FF6A00' },
        { name: 'Office', value: 25, color: '#1890FF' },
        { name: 'Accessories', value: 20, color: '#52C41A' },
        { name: 'Others', value: 10, color: '#FAAD14' }
    ];

    const topProducts = [
        { name: 'Wireless Headphones', sales: 234, revenue: 70200 },
        { name: 'Smart Watch', sales: 189, revenue: 85050 },
        { name: 'Laptop Stand', sales: 156, revenue: 12480 },
        { name: 'Mechanical Keyboard', sales: 123, revenue: 19677 },
    ];

    return (
        <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-success to-primary p-8 shadow-alibaba-lg">
                <div className="absolute inset-0 bg-grid opacity-10"></div>
                <div className="relative">
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-white/90">Comprehensive insights into your business performance</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    label="Total Revenue"
                    value="$105,500"
                    change="+23.5%"
                    positive={true}
                    icon={DollarSign}
                    color="primary"
                    delay={0}
                />
                <KPICard
                    label="Total Orders"
                    value="990"
                    change="+12.8%"
                    positive={true}
                    icon={ShoppingCart}
                    color="accent"
                    delay={100}
                />
                <KPICard
                    label="Total Customers"
                    value="717"
                    change="+8.2%"
                    positive={true}
                    icon={Users}
                    color="success"
                    delay={200}
                />
                <KPICard
                    label="Avg Order Value"
                    value="$106.57"
                    change="-2.4%"
                    positive={false}
                    icon={Activity}
                    color="warning"
                    delay={300}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up animation-delay-200">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-foreground">Revenue Trend</h3>
                        <p className="text-sm text-muted-foreground">Monthly revenue and order performance</p>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1890FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#1890FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" stroke="#FF6A00" fill="url(#colorRevenue)" strokeWidth={2} name="Revenue ($)" />
                                <Area type="monotone" dataKey="orders" stroke="#1890FF" fill="url(#colorOrders)" strokeWidth={2} name="Orders" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up animation-delay-300">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-foreground">Sales by Category</h3>
                        <p className="text-sm text-muted-foreground">Product category breakdown</p>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {categoryData.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                    <span className="text-foreground font-medium">{cat.name}</span>
                                </div>
                                <span className="text-muted-foreground font-semibold">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up animation-delay-400">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground">Top Selling Products</h3>
                    <p className="text-sm text-muted-foreground">Best performers by sales volume</p>
                </div>
                <div className="space-y-4">
                    {topProducts.map((product, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary hover:bg-border/30 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-primary">${product.revenue.toLocaleString()}</p>
                                <p className="text-xs text-success font-semibold">+{Math.floor(Math.random() * 20 + 5)}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function KPICard({ label, value, change, positive, icon: Icon, color, delay }) {
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
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                    <Icon size={24} />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                    positive ? "bg-success/20 text-success" : "bg-error/20 text-error"
                )}>
                    {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                <p className="text-3xl font-bold text-foreground">{value}</p>
            </div>
        </div>
    );
}
