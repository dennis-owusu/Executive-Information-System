import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './routes/ProtectedRoute';

// Shop pages
import ShopHome from './pages/Shop/ShopHome';
import ShopProducts from './pages/Shop/ShopProducts';
import Cart from './pages/Shop/Cart';
import Checkout from './pages/Shop/Checkout';
import OrderSuccess from './pages/Shop/OrderSuccess';
import MyOrders from './pages/Shop/MyOrders';
import Profile from './pages/Shop/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Shop Routes (Public) */}
      <Route path="/shop" element={<ShopHome />} />
      <Route path="/shop/products" element={<ShopProducts />} />
      <Route path="/shop/cart" element={<Cart />} />
      <Route path="/shop/checkout" element={<Checkout />} />
      <Route path="/shop/order-success" element={<OrderSuccess />} />
      <Route path="/shop/my-orders" element={<MyOrders />} />
      <Route path="/shop/profile" element={<Profile />} />

      {/* Protected Routes wrapped in Main Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
}
