import React, { useState } from 'react';
import ShopNavbar from '../../components/ShopNavbar';
import { User, Mail, Phone, MapPin, Key, CreditCard, Shield, Edit2, LogOut, Bell, Camera } from 'lucide-react';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <ShopNavbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="relative w-28 h-28 mx-auto mb-6">
                        <div className="w-28 h-28 rounded-full bg-white shadow-2xl flex items-center justify-center text-4xl font-black text-purple-600">
                            {(user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-purple-600 transition-colors">
                            <Camera size={18} />
                        </button>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">{user.email || 'User'}</h1>
                    <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium capitalize">
                        {user.role || 'Customer'}
                    </span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Personal Information</h3>
                                    <p className="text-slate-500">Manage your personal details</p>
                                </div>
                                <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoField icon={<Mail />} label="Email Address" value={user.email || 'user@example.com'} />
                                <InfoField icon={<Phone />} label="Phone Number" value="+1 (555) 000-0000" />
                                <InfoField icon={<MapPin />} label="Address" value="123 Main St, New York, NY 10001" className="md:col-span-2" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Security Settings</h3>
                                <p className="text-slate-500">Manage your account security</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Key size={22} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Password</h4>
                                            <p className="text-sm text-slate-500">Last changed 30 days ago</p>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                                        Change
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Shield size={22} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                                            <p className="text-sm text-slate-500">Add extra security to your account</p>
                                        </div>
                                    </div>
                                    <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-slate-200 cursor-pointer transition-colors hover:bg-slate-300">
                                        <span className="translate-x-1 inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = '/login';
                                }}
                                className="flex items-center gap-2 px-5 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-all"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Notification Preferences</h3>
                                <p className="text-slate-500">Choose what updates you want to receive</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Order Updates', desc: 'Get notified about your order status' },
                                    { title: 'Promotions', desc: 'Receive deals and special offers' },
                                    { title: 'New Products', desc: 'Be the first to know about new arrivals' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-purple-600 cursor-pointer">
                                            <span className="translate-x-6 inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoField({ icon, label, value, className = '' }) {
    return (
        <div className={className}>
            <label className="block text-sm font-semibold text-slate-500 mb-2">{label}</label>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-400">{icon}</span>
                <span className="text-slate-900 font-medium">{value}</span>
            </div>
        </div>
    );
}
