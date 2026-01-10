import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, MapPin, Grid, List, User } from 'lucide-react';
import { getCustomers } from '../services/api';

export default function Customers() {
    const [viewMode, setViewMode] = useState('list');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getCustomers();
                console.log('Customers API response:', response);
                // Handle different response formats - the API returns { allUsers: [...], pagination: {...} }
                const customerData = response.allUsers || response.data || response.customers || response || [];
                
                // Filter for customers with user role only
                const userCustomers = Array.isArray(customerData) 
                    ? customerData.filter(user => user.usersRole === 'user')
                    : [];
                
                console.log('Filtered customers with user role:', userCustomers);
                setCustomers(userCustomers);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
                setCustomers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Customers</h1>
                    <p className="text-slate-500">Manage your customer base</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                        <Filter size={20} />
                    </button>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-slate-500'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
            ) : customers.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No customers found</h3>
                    <p className="text-slate-500">Customers with user role will appear here.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'list' ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Contact</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Join Date</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 font-bold">
                                                        {(customer.firstName?.[0] || customer.email?.[0] || 'U').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{customer.firstName} {customer.lastName}</p>
                                                        <p className="text-xs text-slate-500">ID: {customer._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Mail size={14} /> {customer.email}
                                                    </div>
                                                    {customer.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Phone size={14} /> {customer.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {customer.usersRole?.toUpperCase() || 'USER'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-2 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCustomers.map((customer) => (
                                <div key={customer._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-2xl font-black text-purple-600 group-hover:scale-110 transition-transform">
                                            {(customer.firstName?.[0] || customer.email?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                            {customer.usersRole?.toUpperCase() || 'USER'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{customer.firstName} {customer.lastName || 'User'}</h3>
                                    <p className="text-slate-500 text-sm mb-4">Member since {new Date(customer.createdAt).getFullYear()}</p>

                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Mail size={18} className="text-slate-400" />
                                            <span className="text-sm truncate">{customer.email}</span>
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Phone size={18} className="text-slate-400" />
                                                <span className="text-sm">{customer.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
