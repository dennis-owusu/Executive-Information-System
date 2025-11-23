
import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/common/Navbar.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'

import ProductList from './pages/Shop/ProductList.jsx'
import ProductDetail from './pages/Shop/ProductDetail.jsx'
import Cart from './pages/Shop/Cart.jsx'
import Checkout from './pages/Shop/Checkout.jsx'

import Orders from './pages/User/Orders.jsx'
import Dashboard from './pages/User/Dashboard.jsx'

import ExecutiveDashboard from './pages/Executive/ExecutiveDashboard.jsx'
import ProductUpload from './pages/Executive/ProductUpload.jsx'
import ProductCatalog from './pages/Executive/ProductCatalog.jsx'
import ExecutiveLayout from './layouts/ExecutiveLayout.jsx'
import ExecutiveAnalytics from './pages/Executive/ExecutiveAnalytics.jsx'
import ExecutiveOrders from './pages/Executive/Orders.jsx'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/executive" element={
              <ProtectedRoute roles={["executive","admin"]}>
                <ExecutiveLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ExecutiveDashboard />} />
              <Route path="products" element={<ProductCatalog />} />
              <Route path="products/upload" element={<ProductUpload />} />
              <Route path="analytics" element={<ExecutiveAnalytics />} />
              <Route path="orders" element={<ExecutiveOrders />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}
