import React, { useState, useEffect } from 'react';
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
import { getUserData } from '../utils/auth';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [userData, setUserData] = useState(null);
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        company: '',
        bio: ''
    });
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            orderUpdates: true,
            lowStock: true,
            weeklyReports: true
        },
        appearance: {
            theme: 'system' // light, dark, system
        }
    });

    // Define applyTheme function before it's used in useEffect
    const applyTheme = (theme) => {
        document.documentElement.classList.remove('light', 'dark');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
            document.documentElement.classList.add('light');
        } else if (theme === 'system') {
            // Apply system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.add('light');
            }
        }
    };

    // Load saved settings and user data on component mount
    useEffect(() => {
        // Load user data
        const user = getUserData();
        if (user) {
            setUserData(user);
            setProfileForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                company: user.company || '',
                bio: user.bio || ''
            });
        }

        // Load saved settings
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(parsedSettings);
            // Apply theme immediately
            if (parsedSettings.appearance?.theme) {
                applyTheme(parsedSettings.appearance.theme);
            }
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
            const currentSettings = localStorage.getItem('appSettings');
            if (currentSettings) {
                const parsed = JSON.parse(currentSettings);
                if (parsed.appearance?.theme === 'system') {
                    applyTheme('system');
                }
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, []);

    const handleNotificationChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value
            }
        }));
    };

    const handleThemeChange = (theme) => {
        setSettings(prev => ({
            ...prev,
            appearance: {
                ...prev.appearance,
                theme: theme
            }
        }));
        // Apply theme immediately
        applyTheme(theme);
    };

    const handleProfileChange = (field, value) => {
        setProfileForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Save settings to localStorage or API
        localStorage.setItem('appSettings', JSON.stringify(settings));
        
        // Save profile data to localStorage (in a real app, this would be an API call)
        const updatedUser = {
            ...userData,
            ...profileForm
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
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
                                    <label className="block text-sm font-semibold text-foreground mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={profileForm.firstName}
                                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={profileForm.lastName}
                                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => handleProfileChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profileForm.phoneNumber}
                                        onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Company</label>
                                    <input
                                        type="text"
                                        value={profileForm.company}
                                        onChange={(e) => handleProfileChange('company', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={userData?.usersRole || userData?.role || 'User'}
                                        disabled
                                        className="w-full px-4 py-3 border-2 border-input rounded-xl bg-surface-secondary text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Bio</label>
                                <textarea
                                    value={profileForm.bio}
                                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                                    placeholder="Tell us a bit about yourself..."
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white rounded-2xl border border-border shadow-alibaba p-6 animate-slide-up animation-delay-100">
                        <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
                        <div className="space-y-4">
                            {[
                                { key: 'email', label: 'Email Notifications', desc: 'Receive email updates for important events' },
                                { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified when orders are placed or updated' },
                                { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Alert when products are running low on inventory' },
                                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly performance summary reports' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary/20 transition-all">
                                    <div>
                                        <p className="font-semibold text-foreground">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={settings.notifications[item.key]}
                                            onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                                            className="sr-only peer" 
                                        />
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
                                { name: 'Light', value: 'light' },
                                { name: 'Dark', value: 'dark' },
                                { name: 'System', value: 'system' },
                            ].map((theme, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleThemeChange(theme.value)}
                                    className={cn(
                                        "p-6 rounded-xl border-2 font-semibold transition-all",
                                        settings.appearance.theme === theme.value
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border hover:border-primary/30"
                                    )}
                                >
                                    {theme.name}
                                    {settings.appearance.theme === theme.value && <Check size={20} className="mt-2 mx-auto" />}
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
