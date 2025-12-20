import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { ShoppingBag, TrendingUp, DollarSign, Package } from 'lucide-react';
import { cn } from '../../lib/utils';

// Color palette for charts
const COLORS = ['#FF6A00', '#1890FF', '#52C41A', '#FAAD14', '#722ED1', '#13C2C2'];

// Format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// Custom Tooltip for Pie Chart
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{data.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(data.value)} ({data.payload.percentage}%)
                </p>
            </div>
        );
    }
    return null;
};

// Custom Legend
const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

// Donut Chart Component
function SalesDonutChart({ data = [] }) {
    const defaultData = [
        { name: 'Electronics', value: 45000, percentage: 35 },
        { name: 'Fashion', value: 32000, percentage: 25 },
        { name: 'Home & Garden', value: 25600, percentage: 20 },
        { name: 'Sports', value: 15360, percentage: 12 },
        { name: 'Other', value: 10240, percentage: 8 }
    ];

    const chartData = data.length > 0 ? data : defaultData;
    const totalValue = chartData.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag size={20} className="text-primary" />
                        Sales by Category
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Distribution of revenue</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
                    <p className="text-xs text-success font-medium">Total Sales</p>
                </div>
            </div>

            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="white"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Quick Insights Panel
function QuickInsights({ data = {} }) {
    const insights = [
        {
            icon: TrendingUp,
            label: 'Growth Rate',
            value: data.growthRate || '+12.5%',
            color: 'text-success',
            bg: 'bg-success/10'
        },
        {
            icon: DollarSign,
            label: 'Avg. Order Value',
            value: formatCurrency(data.avgOrderValue || 156),
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            icon: Package,
            label: 'Top Seller',
            value: data.topSeller || 'Electronics',
            color: 'text-accent',
            bg: 'bg-accent/10'
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Insights</h3>
            <div className="space-y-4">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", insight.bg)}>
                            <insight.icon size={22} className={insight.color} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">{insight.label}</p>
                            <p className="text-lg font-bold text-gray-900">{insight.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Main Sales Overview Component
export default function SalesOverview({ salesData = [], insights = {} }) {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <SalesDonutChart data={salesData} />
            </div>
            <div className="lg:col-span-2">
                <QuickInsights data={insights} />
            </div>
        </section>
    );
}

// Export individual components
export { SalesDonutChart, QuickInsights };
