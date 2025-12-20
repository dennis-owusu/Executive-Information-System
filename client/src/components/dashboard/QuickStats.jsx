import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Package,
    ShoppingCart,
    Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

// Format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// Format large numbers
const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
};

// Mini sparkline data generator
const generateSparklineData = (trend, points = 7) => {
    const isPositive = trend?.startsWith('+');
    const baseValue = 50;
    return Array.from({ length: points }, (_, i) => ({
        value: baseValue + (isPositive ? 1 : -1) * (Math.random() * 20 + i * 3)
    }));
};

// Individual Stat Card with Mini Sparkline
function StatCard({ stat, index }) {
    const icons = {
        revenue: DollarSign,
        orders: ShoppingCart,
        customers: Users,
        products: Package,
        default: Activity
    };

    const iconKey = stat.label?.toLowerCase().includes('revenue') ? 'revenue'
        : stat.label?.toLowerCase().includes('order') ? 'orders'
            : stat.label?.toLowerCase().includes('customer') ? 'customers'
                : stat.label?.toLowerCase().includes('product') ? 'products'
                    : 'default';

    const Icon = icons[iconKey];
    const isPositive = stat.trend?.startsWith('+');
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    const sparklineData = generateSparklineData(stat.trend);

    const colorVariants = [
        { bg: 'bg-primary/10', icon: 'text-primary', line: '#FF6A00', gradient: 'from-primary/5' },
        { bg: 'bg-accent/10', icon: 'text-accent', line: '#1890FF', gradient: 'from-accent/5' },
        { bg: 'bg-success/10', icon: 'text-success', line: '#52C41A', gradient: 'from-success/5' },
        { bg: 'bg-warning/10', icon: 'text-warning', line: '#FAAD14', gradient: 'from-warning/5' }
    ];
    const colors = colorVariants[index % colorVariants.length];

    return (
        <div
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            role="article"
            aria-label={`${stat.label}: ${stat.value}`}
            tabIndex={0}
        >
            {/* Background gradient on hover */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br",
                colors.gradient,
                "to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            )} />

            <div className="relative">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        colors.bg
                    )}>
                        <Icon size={24} className={colors.icon} />
                    </div>

                    {/* Trend Badge */}
                    {stat.trend && (
                        <div className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                            isPositive ? "bg-success/10 text-success" : "bg-error/10 text-error"
                        )}>
                            <TrendIcon size={12} />
                            <span>{stat.trend}</span>
                        </div>
                    )}
                </div>

                {/* Value Section */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">
                            {stat.type === 'currency'
                                ? formatCurrency(stat.value)
                                : formatNumber(stat.value)}
                        </p>
                    </div>

                    {/* Mini Sparkline */}
                    <div className="w-20 h-10 ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparklineData}>
                                <Tooltip
                                    content={() => null}
                                    wrapperStyle={{ display: 'none' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={colors.line}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subtitle */}
                <p className="text-xs text-gray-400 mt-3">vs last period</p>
            </div>
        </div>
    );
}

// Main Quick Stats Grid Component
export default function QuickStats({ stats = [] }) {
    // Default stats if none provided
    const defaultStats = [
        { label: 'Total Revenue', value: 148520, type: 'currency', trend: '+12.5%' },
        { label: 'Total Orders', value: 2847, type: 'number', trend: '+8.2%' },
        { label: 'Active Customers', value: 1520, type: 'number', trend: '+5.1%' },
        { label: 'Products', value: 342, type: 'number', trend: '+2.8%' }
    ];

    const displayStats = stats.length > 0 ? stats : defaultStats;

    return (
        <section
            aria-label="Key performance indicators"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
            {displayStats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
            ))}
        </section>
    );
}

// Export individual card for reuse
export { StatCard };
