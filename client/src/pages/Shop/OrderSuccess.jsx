import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home, ShoppingBag, ArrowRight } from 'lucide-react';
import ShopNavbar from '../../components/ShopNavbar';

export default function OrderSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const reference = location.state?.reference || 'N/A';
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate('/shop');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <ShopNavbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center animate-fade-in">
                    {/* Success Animation */}
                    <div className="relative w-32 h-32 mx-auto mb-8">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                        <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
                            <CheckCircle size={64} className="text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 mb-4">Order Confirmed!</h1>
                    <p className="text-xl text-slate-600 mb-2">
                        Thank you for your purchase. Your order is being processed.
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                        Redirecting to home page in <span className="font-bold text-purple-600">{countdown}</span> seconds...
                    </p>

                    {/* Order Reference */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
                        <p className="text-sm text-slate-500 mb-2">Order Reference</p>
                        <p className="text-2xl font-mono font-black text-purple-600">{reference}</p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <Package size={32} className="text-purple-600 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-900 mb-1">Order Processing</h3>
                            <p className="text-sm text-slate-500">Your order is being prepared for shipment</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <Home size={32} className="text-purple-600 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-900 mb-1">Delivery</h3>
                            <p className="text-sm text-slate-500">Expected within 3-5 business days</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:scale-105"
                        >
                            <Home size={20} />
                            Go to Home Now
                        </Link>
                        <Link
                            to="/shop/my-orders"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            View My Orders
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
