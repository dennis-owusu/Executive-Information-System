import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Tag, Truck, Shield, Package } from 'lucide-react';
import ShopNavbar from '../../components/ShopNavbar';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ShopNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <ShoppingBag size={56} className="text-purple-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 text-lg">Looks like you haven't added anything yet. Start exploring!</p>
            <Link
              to="/shop/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:scale-105"
            >
              <ShoppingBag size={22} />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-slate-50">
      <ShopNavbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/shop/products"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-black text-white">Shopping Cart</h1>
          <p className="text-white/80 mt-2">{cart.length} item{cart.length > 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <CartItem
                key={item._id}
                item={item}
                index={index}
                onUpdateQuantity={(qty) => updateQuantity(item._id, qty)}
                onRemove={() => removeFromCart(item._id)}
              />
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 font-medium hover:underline"
            >
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24 border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                </div>

                {shipping > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800">
                      Add <span className="font-bold">${(50 - subtotal).toFixed(2)}</span> more for FREE shipping!
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-3xl font-black text-purple-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/shop/checkout')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Shield size={16} className="text-green-500" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Truck size={16} className="text-blue-500" />
                  <span>Fast Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, index, onUpdateQuantity, onRemove }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="flex gap-5 bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
        {item.images?.[0]?.url && !imageError ? (
          <img
            src={item.images[0].url}
            alt={item.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-slate-300" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-bold text-slate-900 line-clamp-1">{item.name}</h3>
            {item.categories?.length > 0 && (
              <p className="text-sm text-slate-500">{item.categories[0]}</p>
            )}
          </div>
          <button
            onClick={onRemove}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex items-center gap-1 border-2 border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-bold text-slate-900">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="p-2 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-purple-600">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            {item.quantity > 1 && (
              <p className="text-xs text-slate-400">${item.price} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
