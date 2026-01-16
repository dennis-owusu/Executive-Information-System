import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Home, Package, Receipt, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';

export default function ShopNavbar() {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const { getItemCount } = useCart();
    const { searchTerm, setSearchTerm, clearSearch } = useSearch();
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = !!localStorage.getItem('token');
    const isExecutive = user.role === 'admin' || user.role === 'executive';

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/shop" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                            EIS
                        </div>
                        <span className="font-black text-xl text-slate-900 hidden sm:block">Shop</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/shop" active={isActive('/shop') && location.pathname === '/shop'}>
                            Home
                        </NavLink>
                        <NavLink to="/shop/products" active={isActive('/shop/products')}>
                            Products
                        </NavLink>
                        
                    </div>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && searchTerm.trim()) {
                                        // Navigate to products page with search
                                        navigate(`/shop/products?search=${encodeURIComponent(searchTerm)}`);
                                    }
                                }}
                                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <Link
                            to="/shop/cart"
                            className="relative p-2.5 bg-slate-100 hover:bg-purple-100 rounded-xl transition-all hover:scale-105"
                        >
                            <ShoppingCart size={22} className="text-slate-700" />
                            {getItemCount() > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                    {getItemCount()}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isLoggedIn ? (
                            <Link
                                to={isExecutive ? "/" : "/shop/profile"}
                                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105"
                            >
                                <User size={18} />
                                {isExecutive ? "Dashboard" : "Profile"}
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in">
                        {/* Mobile Search */}
                        <div className="px-4 pb-4">
                            <div className="relative w-full group">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && searchTerm.trim()) {
                                            navigate(`/shop/products?search=${encodeURIComponent(searchTerm)}`);
                                            setMenuOpen(false);
                                        }
                                    }}
                                    className="w-full pl-10 pr-8 py-2.5 text-sm bg-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => {
                                            clearSearch();
                                            setMenuOpen(false);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <MobileNavLink to="/shop" onClick={() => setMenuOpen(false)}>
                                Home
                            </MobileNavLink>
                            <MobileNavLink to="/shop/products" onClick={() => setMenuOpen(false)}>
                                Products
                            </MobileNavLink>
                            
                            <div className="pt-2 mt-2 border-t border-slate-200">
                                {isLoggedIn ? (
                                    <MobileNavLink to={isExecutive ? "/" : "/shop/profile"} onClick={() => setMenuOpen(false)} highlight>
                                        {isExecutive ? "Dashboard" : "My Profile"}
                                    </MobileNavLink>
                                ) : (
                                    <MobileNavLink to="/login" onClick={() => setMenuOpen(false)} highlight>
                                        Sign In
                                    </MobileNavLink>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

function NavLink({ to, active, children }) {
    return (
        <Link
            to={to}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${active
                    ? "bg-purple-100 text-purple-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ to, onClick, highlight, children }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`block px-4 py-3 rounded-xl font-semibold transition-all ${highlight
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
        >
            {children}
        </Link>
    );
}
