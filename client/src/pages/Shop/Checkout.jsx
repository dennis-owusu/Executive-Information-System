import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { Mail, Phone, MapPin, CreditCard, Lock, CheckCircle, Truck, Shield, Package, ArrowLeft } from 'lucide-react';
import ShopNavbar from '../../components/ShopNavbar';
import { verifyPayment, createOrder } from '../../services/api';

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
  
  const [step, setStep] = useState(1);
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
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Raw subtotal from getTotal():', getTotal());
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Processed subtotal:', subtotal);
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Total:', total);
  }, [cart, subtotal, total]);

  // Paystack configuration
  const config = {
    reference: reference,
    email: formData.email,
    amount: Math.round(total * 100), // Convert to kobo/cents
    publicKey: 'pk_test_c45444fba0ed1a546015617807267ded4552be18',
    currency: 'GHS',
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
    metadata: {
      custom_fields: [
        { display_name: "Name", variable_name: "name", value: `${formData.firstName} ${formData.lastName}` },
        { display_name: "Phone", variable_name: "phone", value: formData.phone },
        { display_name: "Address", variable_name: "address", value: `${formData.address}, ${formData.city}` }
      ]
    }
  };

  // Initialize Paystack payment
  const initializePayment = usePaystackPayment(config);

  // Regenerate reference if it's invalid
  useEffect(() => {
    if (!reference || reference.length < 10) {
      console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Regenerating invalid reference:', reference);
      setReference(generateOrderReference());
    }
  }, [reference]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = async (reference) => {
    console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Payment success callback triggered', reference);
    try {
      // First verify the payment with Paystack
      const verificationResult = await verifyPayment(reference.reference);
      console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Payment verification result', verificationResult);
      
      if (verificationResult.success) {
        setLoading(true); // Show loading state while creating order
        
        // Create order with all the details
        const orderData = {
          reference: reference.reference,
          items: cart.map(item => ({
            productId: item._id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
            image: item.images?.[0] || item.image
          })),
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip
          },
          paymentDetails: {
            amount: total,
            currency: 'GHS',
            status: 'paid'
          },
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total
        };

        console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Creating order with data:', orderData);
        
        // Create the order
        const orderResult = await createOrder(orderData);
        console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Order creation result:', orderResult);
        
        setLoading(false); // Hide loading state
        
        // Clear cart on successful order creation
        clearCart();
        
        // Navigate to success page with order details
        navigate('/shop/order-success', { 
          state: { 
            reference: reference.reference,
            orderId: orderResult.orderId || orderResult._id 
          } 
        });
      } else {
        alert('Payment verification failed. Please contact support.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('[CHECKOUT][ERROR]', new Date().toISOString(), 'Payment/order processing error:', error);
      alert('Payment processing failed. Please contact support.');
      setProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Validate shipping fields before proceeding to payment
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city) {
        alert('Please fill in all required shipping fields');
        return;
      }
      setStep(2);
    } else {
      // Validate required fields
      if (!formData.email || !formData.firstName || !formData.lastName) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Validate total amount
      if (total <= 0) {
        alert('Invalid order total');
        return;
      }
      
      setProcessing(true);
      
      // Initialize Paystack payment
      initializePayment(handlePaymentSuccess, () => {
        console.log('[CHECKOUT][DEBUG]', new Date().toISOString(), 'Payment closed');
        setProcessing(false);
      });
    }
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
            <div className={`flex items-center ${step === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4" />
            <div className={`flex items-center ${step === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
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
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Pay with Paystack</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-800">Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                </div>
              )}
              
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
                    step === 1 ? 'Continue to Payment' : 'Complete Order'
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
                const itemPrice = isNaN(Number(item.price)) ? 0 : Number(item.price) || 0;
                const itemTotal = itemPrice * (item.quantity || 0);
                
                return (
                  <div key={item._id} className="flex items-center space-x-4">
                    <img
                      src={item.images?.[0] || item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
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