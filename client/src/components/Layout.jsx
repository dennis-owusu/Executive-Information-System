import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Tag,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Search,
    Bell,
    Menu,
    X,
    ChevronDown,
    Globe
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "bg-surface border-r border-border flex flex-col transition-all duration-300 hidden md:flex",
                sidebarOpen ? "w-64" : "w-20"
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-white">
                    <div className={cn(
                        "flex items-center gap-3 transition-all",
                        !sidebarOpen && "justify-center w-full"
                    )}>
                        <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center text-white font-bold text-sm">
                            EIS
                        </div>
                        {sidebarOpen && (
                            <span className="font-semibold text-base text-foreground">Executive IS</span>
                        )}
                    </div>
                    {sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 hover:bg-secondary rounded-md transition-colors"
                        >
                            <X size={16} className="text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <NavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={!sidebarOpen} />
                    <NavItem to="/products" icon={Package} label="Products" collapsed={!sidebarOpen} />
                    <NavItem to="/categories" icon={Tag} label="Categories" collapsed={!sidebarOpen} />
                    <NavItem to="/orders" icon={ShoppingCart} label="Orders" collapsed={!sidebarOpen} />
                    <NavItem to="/analytics" icon={BarChart3} label="Analytics" collapsed={!sidebarOpen} />
                    <NavItem to="/customers" icon={Users} label="Customers" collapsed={!sidebarOpen} />

                    {sidebarOpen && (
                        <div className="pt-4 mt-4 border-t border-divider">
                            <div className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                System
                            </div>
                        </div>
                    )}
                    <NavItem to="/settings" icon={Settings} label="Settings" collapsed={!sidebarOpen} />
                </nav>

                {/* Collapse Toggle */}
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-4 border-t border-border hover:bg-secondary transition-colors"
                    >
                        <Menu size={20} className="text-muted-foreground mx-auto" />
                    </button>
                )}

                {/* User Section */}
                {sidebarOpen && (
                    <div className="p-4 border-t border-border bg-surface-secondary">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white rounded-lg transition-all"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white shadow-sm z-10">
                    {/* Search */}
                    <div className="flex items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search products, orders, customers..."
                                className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                            <Globe size={18} />
                            <span className="hidden sm:inline">EN</span>
                            <ChevronDown size={14} />
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
                        </button>

                        {/* User Avatar */}
                        <div className="flex items-center gap-3 pl-3 border-l border-divider">
                            <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center text-white text-sm font-medium">
                                AD
                            </div>
                            <div className="hidden lg:block">
                                <div className="text-sm font-medium text-foreground">Admin User</div>
                                <div className="text-xs text-muted-foreground">Executive</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-background">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function NavItem({ to, icon: Icon, label, collapsed }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                collapsed && "justify-center",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            title={collapsed ? label : undefined}
        >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
        </NavLink>
    );
}
