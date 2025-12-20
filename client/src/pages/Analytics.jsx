import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    TrendingUp,
    Users,
    DollarSign,
    ShoppingCart,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Upload,
    Download,
    FileText,
    CheckCircle2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { cn } from '../lib/utils';
import { Bot } from 'lucide-react';

export default function AnalyticsPage() {
    // State for handling file upload feedback
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success
    const [salesSummary, setSalesSummary] = useState(null);
    const [opsSummary, setOpsSummary] = useState(null);
    const [productsData, setProductsData] = useState(null);
    const [customersData, setCustomersData] = useState(null);
    const [ordersData, setOrdersData] = useState(null);
    const [categoriesData, setCategoriesData] = useState(null);
    const [aiInsights, setAiInsights] = useState('');
    const [loadingInsights, setLoadingInsights] = useState(false);
    const fileInputRef = useRef(null);

    // Fetch analytics data on component mount
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                console.log('Fetching comprehensive analytics data...');
                const { 
                    getDashboardStats, 
                    getDashboardChartData, 
                    getProducts, 
                    getCustomers, 
                    getOrders,
                    getCategories 
                } = await import('../services/api');

                // Fetch dashboard stats (includes operations data)
                console.log('Fetching dashboard stats...');
                const statsData = await getDashboardStats();
                console.log('Dashboard stats received:', statsData);
                setOpsSummary({
                    paymentSuccessRate: statsData.paymentSuccessRate || 0,
                    avgFulfillmentHours: statsData.avgFulfillmentHours || 0,
                    totalRevenue: statsData.totalRevenue || 0,
                    totalOrders: statsData.totalOrders || 0,
                    totalProducts: statsData.totalProducts || 0,
                    totalCustomers: statsData.totalCustomers || 0
                });
                
                // Fetch chart data (includes sales data)
                console.log('Fetching chart data with monthly period...');
                const chartData = await getDashboardChartData({ period: 'monthly' });
                console.log('Chart data received:', chartData);
                
                // Transform chart data to match expected format
                const transformedSalesData = {
                    total: {
                        total: chartData.datasets[0].data.reduce((sum, val) => sum + val, 0),
                        count: chartData.datasets[0].data.length
                    },
                    series: chartData.labels.map((label, index) => ({
                        _id: label,
                        total: chartData.datasets[0].data[index]
                    }))
                };
                setSalesSummary(transformedSalesData);
                
                // Fetch additional system data for comprehensive analysis
                console.log('Fetching additional system data...');
                
                // Fetch products data
                try {
                    const productsResponse = await getProducts();
                    const productsArray = productsResponse.products || productsResponse;
                    setProductsData({
                        totalProducts: productsArray.length,
                        activeProducts: productsArray.filter(p => p.status === 'active').length,
                        lowStockProducts: productsArray.filter(p => p.stock && p.stock < 10).length,
                        categories: [...new Set(productsArray.map(p => p.category?.categoryName).filter(Boolean))].length
                    });
                } catch (error) {
                    console.log('Products data not available:', error.message);
                    setProductsData({ totalProducts: 0, activeProducts: 0, lowStockProducts: 0, categories: 0 });
                }
                
                // Fetch customers data
                try {
                    const customersResponse = await getCustomers();
                    const customersArray = customersResponse.allUsers || customersResponse;
                    setCustomersData({
                        totalCustomers: customersArray.length,
                        activeCustomers: customersArray.filter(c => c.status === 'active').length,
                        newCustomersThisMonth: customersArray.filter(c => {
                            const createdDate = new Date(c.createdAt);
                            const currentDate = new Date();
                            return createdDate.getMonth() === currentDate.getMonth() && 
                                   createdDate.getFullYear() === currentDate.getFullYear();
                        }).length
                    });
                } catch (error) {
                    console.log('Customers data not available:', error.message);
                    setCustomersData({ totalCustomers: 0, activeCustomers: 0, newCustomersThisMonth: 0 });
                }
                
                // Fetch orders data
                try {
                    const ordersResponse = await getOrders();
                    const ordersArray = ordersResponse.orders || ordersResponse;
                    setOrdersData({
                        totalOrders: ordersArray.length,
                        pendingOrders: ordersArray.filter(o => o.status === 'pending').length,
                        completedOrders: ordersArray.filter(o => o.status === 'completed').length,
                        cancelledOrders: ordersArray.filter(o => o.status === 'cancelled').length
                    });
                } catch (error) {
                    console.log('Orders data not available:', error.message);
                    setOrdersData({ totalOrders: 0, pendingOrders: 0, completedOrders: 0, cancelledOrders: 0 });
                }
                
                // Fetch categories data
                try {
                    const categoriesResponse = await getCategories();
                    const categoriesArray = categoriesResponse.allCategory || categoriesResponse;
                    setCategoriesData({
                        totalCategories: categoriesArray.length,
                        activeCategories: categoriesArray.filter(c => c.status === 'active').length,
                        featuredCategories: categoriesArray.filter(c => c.featured).length
                    });
                } catch (error) {
                    console.log('Categories data not available:', error.message);
                    setCategoriesData({ totalCategories: 0, activeCategories: 0, featuredCategories: 0 });
                }
                
                console.log('Comprehensive analytics data loaded successfully');
                
                // Auto-generate AI insights once data is loaded
                setTimeout(() => {
                    console.log('Auto-generating AI insights...');
                    generateAIInsights();
                }, 1000);
                
            } catch (error) {
                console.error('Failed to fetch analytics data:', error);
                console.error('Error details:', error.response?.data || error.message);
                // Set empty data to prevent errors
                setSalesSummary({ total: { total: 0, count: 0 }, series: [] });
                setOpsSummary({ 
                    paymentSuccessRate: 0, 
                    avgFulfillmentHours: 0, 
                    totalRevenue: 0, 
                    totalOrders: 0, 
                    totalProducts: 0, 
                    totalCustomers: 0 
                });
                setProductsData({ totalProducts: 0, activeProducts: 0, lowStockProducts: 0, categories: 0 });
                setCustomersData({ totalCustomers: 0, activeCustomers: 0, newCustomersThisMonth: 0 });
                setOrdersData({ totalOrders: 0, pendingOrders: 0, completedOrders: 0, cancelledOrders: 0 });
                setCategoriesData({ totalCategories: 0, activeCategories: 0, featuredCategories: 0 });
            }
        };
        
        fetchAnalyticsData();
    }, []);

    // Function to trigger the hidden file input
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Function to handle the actual file selection
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadStatus('uploading');
            // Simulate an upload process
            setTimeout(() => {
                setUploadStatus('success');
                // Reset status after 3 seconds
                setTimeout(() => setUploadStatus('idle'), 3000);
            }, 1500);
            console.log("File selected:", file.name);
        }
    };

    // Function to generate AI insights
    const generateAIInsights = async () => {
        setLoadingInsights(true);
        try {
            console.log('Starting AI insights generation...');
            console.log('Available data:', {
                salesSummary: !!salesSummary,
                opsSummary: !!opsSummary,
                productsData: !!productsData,
                customersData: !!customersData,
                ordersData: !!ordersData,
                categoriesData: !!categoriesData
            });

            const { getAIInsights } = await import('../services/api');
            
            // Prepare comprehensive system data
            const systemData = {
                sales: salesSummary || { total: { total: 0, count: 0 }, series: [] },
                operations: opsSummary || { 
                    paymentSuccessRate: 0, 
                    avgFulfillmentHours: 0, 
                    totalRevenue: 0, 
                    totalOrders: 0, 
                    totalProducts: 0, 
                    totalCustomers: 0 
                },
                products: productsData || { totalProducts: 0, activeProducts: 0, lowStockProducts: 0, categories: 0 },
                customers: customersData || { totalCustomers: 0, activeCustomers: 0, newCustomersThisMonth: 0 },
                orders: ordersData || { totalOrders: 0, pendingOrders: 0, completedOrders: 0, cancelledOrders: 0 },
                categories: categoriesData || { totalCategories: 0, activeCategories: 0, featuredCategories: 0 }
            };

            // Calculate key metrics
            const totalRevenue = systemData.sales.total.total;
            const totalOrders = systemData.operations.totalOrders;
            const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
            const orderCompletionRate = systemData.orders.totalOrders > 0 ? 
                ((systemData.orders.completedOrders / systemData.orders.totalOrders) * 100).toFixed(1) : 0;
            const customerGrowthRate = systemData.customers.totalCustomers > 0 ?
                ((systemData.customers.newCustomersThisMonth / systemData.customers.totalCustomers) * 100).toFixed(1) : 0;
            const stockAlertLevel = systemData.products.lowStockProducts > 0 ?
                ((systemData.products.lowStockProducts / systemData.products.totalProducts) * 100).toFixed(1) : 0;

            const question = `As an AI business analyst, provide a focused business executive summary for our e-commerce system. Analyze the following real system data and provide strategic insights:

Business Performance Metrics:
- Total Revenue: $${totalRevenue.toLocaleString()}
- Total Orders: ${totalOrders.toLocaleString()}
- Average Order Value: $${avgOrderValue}
- Customer Base: ${systemData.customers.totalCustomers.toLocaleString()} total, ${systemData.customers.activeCustomers} active
- Product Portfolio: ${systemData.products.totalProducts} products across ${systemData.categories.totalCategories} categories
- Order Fulfillment: ${orderCompletionRate}% completion rate, ${systemData.orders.pendingOrders} pending

Operational Health:
- Payment Success: ${systemData.operations.paymentSuccessRate.toFixed(1)}%
- Fulfillment Speed: ${systemData.operations.avgFulfillmentHours.toFixed(1)} hours average
- Inventory Status: ${systemData.products.lowStockProducts} low stock items (${stockAlertLevel}%)
- Customer Growth: ${customerGrowthRate}% monthly growth

Business Analysis Requirements:
1. Revenue performance and growth opportunities
2. Customer acquisition and retention analysis
3. Operational efficiency assessment
4. Inventory and supply chain insights
5. Strategic recommendations for scaling
6. Risk identification and mitigation
7. Actionable next steps for management

Format as clean business report with executive summary, key findings, and prioritized recommendations. Focus on actionable insights for business decision-making.`;

            const insights = await getAIInsights(question);
            console.log('AI insights received:', insights);
            
            // If insights is empty or null, show a fallback business analysis
            if (!insights || insights.trim() === '') {
                setAiInsights(`## Business Performance Summary

### Executive Overview
Current system performance shows ${systemData.products.totalProducts} active products serving ${systemData.customers.totalCustomers} customers with ${systemData.orders.totalOrders} total orders processed.

### Key Financial Metrics
- Total Revenue: $${totalRevenue.toLocaleString()}
- Average Order Value: $${avgOrderValue}
- Order Completion Rate: ${orderCompletionRate}%

### Operational Health
- Customer Growth: ${customerGrowthRate}% monthly increase
- Payment Success Rate: ${systemData.operations.paymentSuccessRate.toFixed(1)}%
- Fulfillment Speed: ${systemData.operations.avgFulfillmentHours.toFixed(1)} hours average
- Inventory Alerts: ${systemData.products.lowStockProducts} items require attention

### Strategic Recommendations
1. **Revenue Optimization**: Focus on increasing average order value through bundling and upselling
2. **Customer Retention**: Implement loyalty programs to maintain ${customerGrowthRate}% growth momentum
3. **Operational Efficiency**: Streamline fulfillment to reduce ${systemData.operations.avgFulfillmentHours.toFixed(1)}-hour processing time
4. **Inventory Management**: Address ${systemData.products.lowStockProducts} low-stock items to prevent stockouts

### Next Steps
Monitor daily metrics and adjust strategies based on real-time performance data.`);
            } else {
                setAiInsights(insights);
            }
        } catch (err) {
            console.error('Failed to generate AI insights', err);
            console.error('Error details:', err.response?.data || err.message);
            
            // Create a fallback analysis based on available data
            const fallbackAnalysis = `🤖 **Manual System Analysis**

**Data Availability Status:**
- Sales Data: ${salesSummary ? '✅ Available' : '❌ Missing'}
- Operations Data: ${opsSummary ? '✅ Available' : '❌ Missing'}
- Products Data: ${productsData ? '✅ Available' : '❌ Missing'}
- Customers Data: ${customersData ? '✅ Available' : '❌ Missing'}
- Orders Data: ${ordersData ? '✅ Available' : '❌ Missing'}
- Categories Data: ${categoriesData ? '✅ Available' : '❌ Missing'}

**Current System Metrics:**
- Total Revenue: $${(salesSummary?.total?.total || 0).toLocaleString()}
- Total Orders: ${ordersData?.totalOrders || 0}
- Total Products: ${productsData?.totalProducts || 0}
- Total Customers: ${customersData?.totalCustomers || 0}
- Total Categories: ${categoriesData?.totalCategories || 0}

**Key Recommendations:**
${(productsData?.totalProducts || 0) === 0 ? '• Add products to start generating revenue\n' : ''}
${(customersData?.totalCustomers || 0) === 0 ? '• Focus on customer acquisition strategies\n' : ''}
${(ordersData?.totalOrders || 0) === 0 ? '• Implement marketing campaigns to drive orders\n' : ''}
• Monitor system performance regularly
• Ensure all data sources are properly connected

*AI service temporarily unavailable. This analysis is based on your current system data.*`;
            
            setAiInsights(fallbackAnalysis);
        } finally {
            setLoadingInsights(false);
        }
    };

    // Use real data if available, otherwise fall back to initial state or empty
    const revenueData = salesSummary?.series?.map(item => ({
        month: item._id,
        revenue: item.total,
        orders: item.count || 0
    })) || [];

    const categoryData = [
        { name: 'Electronics', value: 45, color: '#4F46E5' }, 
        { name: 'Office', value: 25, color: '#0EA5E9' },     
        { name: 'Accessories', value: 20, color: '#10B981' }, 
        { name: 'Others', value: 10, color: '#F59E0B' }      
    ];

    const topProducts = [
        { name: 'Wireless Headphones', sales: 234, revenue: 70200 },
        { name: 'Smart Watch', sales: 189, revenue: 85050 },
        { name: 'Laptop Stand', sales: 156, revenue: 12480 },
        { name: 'Mechanical Keyboard', sales: 123, revenue: 19677 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-8 animate-fade-in">
            
            {/* --- HEADER SECTION WITH ACTIONS --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of your store's performance and imports.</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".csv,.xlsx,.json"
                    />

                    {/* Import Button */}
                    <button 
                        onClick={handleUploadClick}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm border",
                            uploadStatus === 'success' 
                                ? "bg-green-100 text-green-700 border-green-200" 
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600"
                        )}
                    >
                        {uploadStatus === 'success' ? (
                            <>
                                <CheckCircle2 size={18} />
                                <span>Upload Complete</span>
                            </>
                        ) : (
                            <>
                                <Upload size={18} />
                                <span>Import Data</span>
                            </>
                        )}
                    </button>

                    {/* Primary Action Button */}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200/50 transition-all duration-200 transform hover:-translate-y-0.5">
                        <Download size={18} />
                        <span>Download Report</span>
                    </button>
                </div>
            </div>

            {/* --- KPI CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    label="Total Revenue"
                    value={`$${salesSummary?.total?.total?.toLocaleString() || '0'}`}
                    change="+0%"
                    positive={true}
                    icon={DollarSign}
                    colorScheme="indigo"
                    delay={0}
                />
                <KPICard
                    label="Total Orders"
                    value={salesSummary?.total?.count || '0'}
                    change="+0%"
                    positive={true}
                    icon={ShoppingCart}
                    colorScheme="blue"
                    delay={100}
                />
                <KPICard
                    label="Operations Success"
                    value={`${(opsSummary?.paymentSuccessRate * 100)?.toFixed(1) || 0}%`}
                    change="+0%"
                    positive={true}
                    icon={Users}
                    colorScheme="emerald"
                    delay={200}
                />
                <KPICard
                    label="Avg Fulfillment"
                    value={`${opsSummary?.avgFulfillmentHours?.toFixed(1) || 0}h`}
                    change="-0%"
                    positive={false}
                    icon={Activity}
                    colorScheme="amber"
                    delay={300}
                />
            </div>

            {/* --- MAIN CHART GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Revenue Trend</h3>
                            <p className="text-sm text-slate-500">Monthly financial performance</p>
                        </div>
                        {/* Small Chart Action */}
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <FileText size={20} />
                        </button>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E293B',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend iconType="circle" />
                                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="url(#colorRevenue)" strokeWidth={3} name="Revenue" activeDot={{ r: 8 }} />
                                <Area type="monotone" dataKey="orders" stroke="#0EA5E9" fill="url(#colorOrders)" strokeWidth={3} name="Orders" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Sales by Category</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {categoryData.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }}></div>
                                    <span className="text-slate-700 font-medium text-sm">{cat.name}</span>
                                </div>
                                <span className="text-slate-900 font-bold text-sm">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- AI INSIGHTS SECTION --- */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">AI Executive Review</h3>
                        <p className="text-sm text-slate-500">AI-generated insights and recommendations</p>
                    </div>
                    <button 
                        onClick={generateAIInsights}
                        disabled={loadingInsights}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Bot size={18} />
                        {loadingInsights ? 'Generating...' : 'Refresh Insights'}
                    </button>
                </div>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                    {aiInsights ? (
                        <div className="space-y-6">
                        <ReactMarkdown
  components={{
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 mt-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold tracking-tight text-gray-800 mb-4 mt-8 border-b border-gray-100 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium text-gray-800 mb-2 mt-6">
        {children}
      </h3>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-600 marker:text-gray-400">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-2 mb-4 text-gray-600 marker:text-gray-500">
        {children}
      </ol>
    ),
    p: ({ children }) => (
      <p className="text-base leading-7 text-gray-600 mb-4">
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-800">
        {children}
      </em>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic text-gray-700">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200">
        {children}
      </code>
    ),
    hr: () => <hr className="my-8 border-gray-200" />,
  }}
>
  {aiInsights}
</ReactMarkdown>

                        </div>
                    ) : (
                        <p className="text-slate-500">Click "Refresh Insights" to generate AI review.</p>
                    )}
                </div>
            </div>

            {/* --- TOP PRODUCTS LIST --- */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Top Selling Products</h3>
                        <p className="text-sm text-slate-500">Best performers by sales volume</p>
                    </div>
                    <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {topProducts.map((product, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${
                                    i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-orange-400'
                                }`}>
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{product.productName || product.name}</p>
                                    <p className="text-sm text-slate-500">{product.sales} units sold</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-slate-900">${product.revenue.toLocaleString()}</p>
                                <div className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-600">
                                    <TrendingUp size={14} />
                                    <span>High Demand</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Sub-component for KPI Cards with distinct color schemes
function KPICard({ label, value, change, positive, icon: Icon, colorScheme, delay }) {
    
    // explicit color mapping for distinct "Not Black & White" feel
    const styles = {
        indigo: "bg-indigo-50 border-indigo-100 hover:border-indigo-300 text-indigo-600",
        blue: "bg-sky-50 border-sky-100 hover:border-sky-300 text-sky-600",
        emerald: "bg-emerald-50 border-emerald-100 hover:border-emerald-300 text-emerald-600",
        amber: "bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-600",
    };

    const iconBgStyles = {
        indigo: "bg-white text-indigo-600",
        blue: "bg-white text-sky-600",
        emerald: "bg-white text-emerald-600",
        amber: "bg-white text-amber-600",
    }

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up",
                styles[colorScheme]
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-xl shadow-sm", iconBgStyles[colorScheme])}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/60 backdrop-blur-sm",
                    positive ? "text-emerald-700" : "text-rose-600"
                )}>
                    {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold opacity-80 mb-1 text-slate-700">{label}</p>
                <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            </div>
        </div>
    );
}