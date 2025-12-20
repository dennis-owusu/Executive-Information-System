import React from 'react';
import {
    Sparkles,
    Clock,
    CheckCircle2,
    RefreshCw,
    Calendar,
    Download,
    Filter,
    Plus,
    Package,
    ShoppingCart,
    BarChart3,
    Eye,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Modern Quick Action Card
function QuickActionCard({ icon: Icon, title, description, href, onClick, colorClass, delay = 0, stats }) {
    const Component = href ? 'a' : 'button';
    const props = href ? { href } : { onClick };

    return (
        <Component
            {...props}
            className={cn(
                "group relative overflow-hidden rounded-2xl bg-white p-5 border border-gray-100",
                "hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1",
                "focus:outline-none focus:ring-4 focus:ring-primary/10",
                "animate-slide-up flex flex-col justify-between h-full"
            )}
            style={{ animationDelay: `${delay}ms` }}
            aria-label={`${title}: ${description}`}
        >
            <div className={cn(
                "absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 transition-transform group-hover:scale-110",
                colorClass?.replace('text-', 'bg-') || 'bg-gray-500' // Fail-safe for color
            )} />

            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3",
                        "bg-gray-50 group-hover:bg-white shadow-sm border border-gray-100"
                    )}>
                        <Icon size={24} className={cn("text-gray-500 transition-colors", colorClass)} />
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 font-medium">{description}</p>
            </div>

            {stats && (
                <div className="relative z-10 mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs font-semibold text-gray-400 group-hover:text-gray-600">
                    <Eye size={12} />
                    {stats}
                </div>
            )}
        </Component>
    );
}

// Add Product Card (Special Styling)
function AddProductCard({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-left text-white shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-violet-500/20 animate-slide-up flex flex-col justify-between h-full"
            aria-label="Add new product"
        >
            {/* Animated Background Shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 group-hover:bg-white/30 transition-all group-hover:rotate-6">
                    <Plus size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Add Product</h3>
                <p className="text-white/80 text-sm font-medium">Create a new listing</p>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                <Sparkles size={12} />
                <span>Quick Action</span>
            </div>
        </button>
    );
}

// Main Dashboard Header
export default function DashboardHeader({
    onRefresh,
    onAddProduct,
    onExport,
    onFilter,
    timeRange = 'week',
    onTimeRangeChange,
    isRefreshing = false,
    recentProductsCount = 0,
    pendingOrdersCount = 0
}) {
    const timeRanges = ['week', 'month', 'year'];
    const timeRangeLabels = {
        week: 'Last 7 Days',
        month: 'This Month',
        year: 'This Year'
    };

    const handleTimeRangeToggle = () => {
        const currentIndex = timeRanges.indexOf(timeRange);
        const nextIndex = (currentIndex + 1) % timeRanges.length;
        onTimeRangeChange?.(timeRanges[nextIndex]);
    };

    return (
        <div className="space-y-8">
            {/* Top Bar with Title & Controls */}
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-fade-in">
                {/* Left: Title & Status */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Dashboard
                        </h1>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Updates
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base max-w-xl">
                        Welcome back! Here's what's happening with your store today, {new Date().toLocaleDateString(undefined, { weekday: 'long' })}.
                    </p>

                    <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>All Systems Operational</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Time Range Selector */}
                    <button
                        onClick={handleTimeRangeToggle}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all focus:ring-2 focus:ring-primary/20"
                    >
                        <Calendar size={18} className="text-gray-500" />
                        {timeRangeLabels[timeRange]}
                    </button>

                    {/* Filter Button */}
                    <button
                        onClick={onFilter}
                        className="p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all relative group"
                        aria-label="Filter"
                    >
                        <Filter size={20} />
                        <span className="hidden group-hover:block absolute top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">Filters</span>
                    </button>

                    {/* Refresh Button */}
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className={cn(
                            "p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all",
                            isRefreshing && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label="Refresh"
                    >
                        <RefreshCw size={20} className={cn(isRefreshing && "animate-spin")} />
                    </button>

                    {/* Export Button (Primary) */}
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Export Report</span>
                    </button>
                </div>
            </header>

            {/* Quick Actions Grid */}
            <section aria-label="Quick actions" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AddProductCard onClick={onAddProduct} />

                <QuickActionCard
                    icon={Package}
                    title="Products"
                    description="Manage inventory"
                    href="/products"
                    colorClass="text-blue-500 bg-blue-500"
                    delay={50}
                    stats={`${recentProductsCount} New Added`}
                />

                <QuickActionCard
                    icon={ShoppingCart}
                    title="Orders"
                    description="Process shipments"
                    href="/orders"
                    colorClass="text-emerald-500 bg-emerald-500"
                    delay={100}
                    stats={`${pendingOrdersCount} Pending`}
                />

                <QuickActionCard
                    icon={BarChart3}
                    title="Analytics"
                    description="View store insights"
                    href="/analytics"
                    colorClass="text-purple-500 bg-purple-500"
                    delay={150}
                    stats="Growth +12%"
                />
            </section>
        </div>
    );
}

export { QuickActionCard };