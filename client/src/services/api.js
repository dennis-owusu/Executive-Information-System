import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
});

// Add token interceptor if needed
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Existing functions from history
export async function getProducts(params = {}) {
  const { data } = await api.get('/route/allproducts', { params });
  return data;
}

export async function getAllCategories() {
  const { data } = await api.get('/route/allcategories');
  return data;
}

export async function getSalesSummary(params = {}) {
  const { data } = await api.get('/route/sales-summary', { params });
  return data;
}

export async function getOperationsSummary() {
  const { data } = await api.get('/route/operations-summary');
  return data;
}

// New function for AI insights
export async function getAIInsights(question) {
  const { data } = await api.post('/ai/ask', { question });
  return data.answer;
}

// Dashboard functions
export async function getDashboardStats(params = {}) {
  const { data } = await api.get('/route/dashboard/stats', { params });
  return data;
}

export async function getAnalytics(params = {}) {
  // Default to weekly period if not specified
  if (!params.period) {
    params.period = 'weekly';
  }
  const response = await api.get('/route/analytics', { params });
  return response.data;
}

export async function getDashboardChartData(params = {}) {
  // Default to monthly period if not specified
  if (!params.period) {
    params.period = 'monthly';
  }
  const response = await api.get('/route/analytics', { params });
  const salesData = response.data.data.salesData || [];
  return {
    labels: salesData.map(item => item.date),
    datasets: [{
      data: salesData.map(item => item.sales)
    }]
  };
}

export async function createProduct(formData) {
  const { data } = await api.post('/route/products', formData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return data;
}

export async function deleteProduct(productId) {
  const { data } = await api.delete(`/route/delete/${productId}`);
  return data;
}

export async function updateProduct(productId, formData) {
  const { data } = await api.put(`/route/update/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function getCustomers(params = {}) {
  const { data } = await api.get('/auth/get-all-users', { params });
  return data;
}

export async function getCategories() {
  const { data } = await api.get('/route/allcategories');
  return data;
}

export async function createCategory(categoryData) {
  const { data } = await api.post('/route/categories', categoryData);
  return data;
}

export async function updateCategory(id, categoryData) {
  const { data } = await api.put(`/route/update-categories/${id}`, categoryData);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/route/category/delete/${id}`);
  return data;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('images', file);
  
  const { data } = await api.post('/route/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function login(userData) {
  const response = await api.post('/auth/login', userData, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  // Debug: log the full response structure
  console.log('Login API response:', response);
  console.log('Login API response.data:', response.data);
  
  const data = response.data;
  
  // Store user data and token in localStorage for client-side use
  if (data && data._id) {
    localStorage.setItem('user', JSON.stringify(data));
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
  }
  return data;
}

export async function register(userData) {
  console.log('Register API called with:', userData);
  const { data } = await api.post('/auth/create', userData, {
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('Register API response:', data);
  // Store user data and token in localStorage for client-side use
  if (data && data._id) {
    localStorage.setItem('user', JSON.stringify(data));
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
  }
  return data;
}

// Order functions
export async function createOrder(orderData) {
  const { data } = await api.post('/route/createOrder', orderData);
  return data;
}

export async function verifyPayment(paymentData) {
  const { data } = await api.post('/verify-payment', paymentData);
  return data;
}

export async function getMyOrders() {
  const { data } = await api.get('/route/getMyOrders');
  return data;
}

export async function updateOrder(orderId, orderData) {
  const { data } = await api.put(`/route/updateOrder/${orderId}`, orderData);
  return data;
}

export async function getOrders() {
  const { data } = await api.get('/route/getOrders');
  return data;
}

export async function getAllOrders() {
  const { data } = await api.get('/route/getOrders');
  return data;
}