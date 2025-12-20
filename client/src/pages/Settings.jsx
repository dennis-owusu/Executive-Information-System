import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Palette,
    Database,
    Globe,
    Save,
    Check
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
            {/* Header */}
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 to-gray-800 p-8 shadow-xl">
                <div className="absolute inset-0 bg-grid opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative">
                    <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
                    <p className="text-slate-300">Manage your application preferences and configuration</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Settings Menu */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { icon: User, label: 'Profile', active: true },
                        { icon: Bell, label: 'Notifications' },
                        { icon: Shield, label: 'Security' },
                        { icon: Palette, label: 'Appearance' },
                        { icon: Database, label: 'Data & Privacy' },
                        { icon: Globe, label: 'Language & Region' },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left",
                                item.active
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-white border border-border hover:bg-surface-secondary"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up">
                        <h2 className="text-xl font-bold text-foreground mb-6">Profile Information</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Admin User"
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="admin@eis.com"
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        defaultValue="+1 234 567 8900"
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Role</label>
                                    <input
                                        type="text"
                                        defaultValue="Executive Administrator"
                                        disabled
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl bg-surface-secondary text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Company</label>
                                <input
                                    type="text"
                                    defaultValue="Executive Information Systems Inc."
                                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up animation-delay-100">
                        <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Email Notifications', desc: 'Receive email updates for important events' },
                                { label: 'Order Updates', desc: 'Get notified when orders are placed or updated' },
                                { label: 'Low Stock Alerts', desc: 'Alert when products are running low on inventory' },
                                { label: 'Weekly Reports', desc: 'Receive weekly performance summary reports' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary/20 transition-all">
                                    <div>
                                        <p className="font-semibold text-foreground">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Appearance Section */}
                    <div className="bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up animation-delay-200">
                        <h2 className="text-xl font-bold text-foreground mb-6">Appearance</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { name: 'Light', active: false },
                                { name: 'Dark', active: false },
                                { name: 'System', active: true },
                            ].map((theme, i) => (
                                <button
                                    key={i}
                                    className={cn(
                                        "p-6 rounded-xl border-2 font-semibold transition-all",
                                        theme.active
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border hover:border-primary/30"
                                    )}
                                >
                                    {theme.name}
                                    {theme.active && <Check size={20} className="mt-2 mx-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3">
                        <button className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:bg-secondary transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={cn(
                                "px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2",
                                saved
                                    ? "bg-success text-white"
                                    : "bg-primary text-white hover:shadow-lg hover:scale-105"
                            )}
                        >
                            {saved ? (
                                <>
                                    <Check size={18} />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
