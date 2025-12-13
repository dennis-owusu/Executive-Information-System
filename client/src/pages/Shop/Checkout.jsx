import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { Mail, Phone, MapPin, CreditCard, Lock, CheckCircle, Truck, Shield, Package, ArrowLeft } from 'lucide-react';
import ShopNavbar from '../../components/ShopNavbar';
import { createOrder } from '../../services/api';

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

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  const config = {
    reference: `ORD-${Date.now()}`,
    email: formData.email,
    amount: Math.round(total * 100), // Paystack expects kobo/cents
    publicKey: publicKey,
    metadata: {
      custom_fields: [
        { display_name: "Name", variable_name: "name", value: `${formData.firstName} ${formData.lastName}` },
        { display_name: "Phone", variable_name: "phone", value: formData.phone },
        { display_name: "Address", variable_name: "address", value: `${formData.address}, ${formData.city}` }
      ]
    }
  };

  const onSuccess = async (reference) => {
    setProcessing(true);
    try {
      await createOrder({
        products: cart.map(item => ({
          _id: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          images: item.images
        })),
        totalAmount: total,
        shippingAddress: formData,
        paymentReference: reference.reference
      });

      clearCart();
      navigate('/shop/order-success', { state: { reference: reference.reference } });
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Payment successful but order creation failed. Please contact support with reference: ' + reference.reference);
      setProcessing(false);
    }
  };

  const onClose = () => {
    console.log('Payment closed');
  };

  // Only initialize if key is present to avoid crash, but allow UI to render
  const initializePayment = usePaystackPayment(config);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      if (publicKey.includes('xxxx')) {
        alert('Paystack Public Key is missing! Please set VITE_PAYSTACK_PUBLIC_KEY in .env');
        return;
      }
      initializePayment(onSuccess, onClose);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ShopNavbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <Package size={64} className="mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
          <Link to="/shop/products" className="text-purple-600 font-semibold hover:underline">
            Continue shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ShopNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/shop/cart"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-black text-white">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white' : 'text-white/50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-white text-purple-600' : 'bg-white/20'} font-bold text-sm`}>
                1
              </div>
              <span className="font-medium">Info</span>
            </div>
            <div className="w-12 h-0.5 bg-white/30"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-white/50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-white text-purple-600' : 'bg-white/20'} font-bold text-sm`}>
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Contact & Shipping</h2>
                  <p className="text-slate-500 mb-6">Where should we deliver your order?</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      icon={<Mail size={18} />}
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                    />
                    <InputField
                      icon={<Phone size={18} />}
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                      required
                    />
                    <InputField
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                      required
                    />
                  </div>

                  <InputField
                    icon={<MapPin size={18} />}
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main Street"
                    required
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <InputField
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="New York"
                      required
                    />
                    <InputField
                      label="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="NY"
                      required
                    />
                    <InputField
                      label="ZIP Code"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="10001"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Payment</h2>
                  <p className="text-slate-500 mb-6">Complete your purchase securely</p>

                  <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white">
                    <div className="flex items-center justify-between mb-8">
                      <CreditCard size={32} />
                      <span className="text-sm opacity-70">Paystack Secure</span>
                    </div>
                    <p className="text-xs opacity-70 mb-1">Order Total</p>
                    <p className="text-4xl font-black">${total.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <Shield size={24} className="text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Secure Payment</p>
                      <p className="text-sm text-green-700">Your payment is protected by 256-bit SSL encryption</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border-2 border-slate-200 text-slate-700 font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all"
                      disabled={processing}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          Pay Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-black text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      {item.images?.[0]?.url ? (
                        <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all`}
        />
      </div>
    </div>
  );
}
