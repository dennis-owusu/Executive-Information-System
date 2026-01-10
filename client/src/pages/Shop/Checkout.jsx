import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Truck, Package, ArrowLeft, CheckCircle } from 'lucide-react';
import ShopNavbar from '../../components/ShopNavbar';
import { createOrder } from '../../services/api';

function generateOrderReference() {
  return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

export default function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  
  const [processing, setProcessing] = useState(false);
  const [reference, setReference] = useState(() => generateOrderReference());
  const [loading, setLoading] = useState(false);

  // Calculate totals with proper validation
  const rawSubtotal = getTotal();
  const subtotal = isNaN(rawSubtotal) ? 0 : Number(rawSubtotal) || 0;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Debug cart data
  useEffect(() => {
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Cart data:', cart);
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Cart items with prices:', cart.map(item => ({
      id: item._id,
      name: item.name || item.productName,
      price: item.price || item.productPrice,
      quantity: item.quantity,
      image: item.image || item.productImage || item.images?.[0]
    })));
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Raw subtotal from getTotal():', getTotal());
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Processed subtotal:', subtotal);
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Shipping:', shipping);
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Tax:', tax);
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Total:', total);
  }, [cart, subtotal, total, shipping, tax]);

  // Order reference for tracking
  const orderReference = reference;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderSubmit = async () => {
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Order submission started');
    setLoading(true);
    
    try {
      // Create order directly without payment verification
      const orderData = {
        reference: orderReference,
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: Number(item.price || item.productPrice || 0)
        })),
        totalPrice: total,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        phoneNumber: formData.phone,
        postalCode: formData.zip,
        paymentMethod: 'cash_on_delivery', // Since we removed Paystack
        userInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phoneNumber: formData.phone
        },
        orderNumber: orderReference
      };

      console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Creating order with data:', orderData);
      
      // Create the order
      const orderResult = await createOrder(orderData);
      console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Order creation result:', orderResult);
      
      setLoading(false);
      
      // Clear cart on successful order creation
      clearCart();
      
      // Navigate to success page with order details
      navigate('/shop/order-success', { 
        state: { 
          reference: orderReference,
          orderId: orderResult.orderId || orderResult._id 
        } 
      });
    } catch (error) {
      console.error('[CHECKOUT][ERROR]', new Date().toISOString(), 'Order creation error:', error);
      let errorMessage = 'Order creation failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Order creation failed: ${errorMessage}`);
      setLoading(false);
      setProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city) {
      alert('Please fill in all required shipping fields');
      return;
    }
    
    // Validate total amount
    if (total <= 0) {
      alert('Invalid order total');
      return;
    }
    
    setProcessing(true);
    
    // Create order directly without payment
    handleOrderSubmit();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopNavbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          
          {/* Progress indicator */}
          <div className="flex items-center mt-6">
            <div className="flex items-center text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
                1
              </div>
              <span className="ml-2 font-medium">Shipping & Order</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={processing || loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing || loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {loading ? 'Creating Order...' : 'Processing...'}
                    </span>
                  ) : (
                    'Complete Order'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => {
                // Handle both frontend and backend field naming conventions
                const itemPrice = isNaN(Number(item.price)) ? 
                  (isNaN(Number(item.productPrice)) ? 0 : Number(item.productPrice) || 0) : 
                  Number(item.price) || 0;
                const itemTotal = itemPrice * (item.quantity || 0);
                const itemName = item.name || item.productName || 'Unknown Product';
                const itemImage = item.images?.[0] || item.image || item.productImage || '/placeholder-product.jpg';
                
                return (
                  <div key={item._id} className="flex items-center space-x-4">
                    <img
                      src={itemImage.startsWith('http') ? itemImage : `http://localhost:4000${itemImage}`}
                      alt={itemName}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{itemName}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">₵{itemPrice.toFixed(2)} each</p>
                    </div>
                    <span className="font-medium text-gray-900">₵{itemTotal.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₵${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₵{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>₵{total.toFixed(2)}</span>
              </div>
            </div>
            
            {shipping === 0 ? (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Free shipping!</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Add ₵{(50 - subtotal).toFixed(2)} more for FREE shipping!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}