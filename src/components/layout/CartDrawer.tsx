'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/data/cartContext';
import { useOrders } from '@/lib/data/orderStore';
import { X, Trash2, Plus, Minus, ShoppingCart, ShoppingBag, ArrowRight, PackageOpen, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/data/userStore';

export function CartDrawer() {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    clearCart 
  } = useCart();
  
  const { createOrder } = useOrders();
  const router = useRouter();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  
  // Checkout Form State
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Auto-fill logged-in user profiles
  useEffect(() => {
    if (cartOpen) {
      const user = getCurrentUser();
      if (user) {
        setShippingInfo(prev => ({
          ...prev,
          name: user.name,
          phone: user.phone
        }));
      }
    }
  }, [cartOpen]);

  const subtotal = getCartTotal();
  const shippingFee = subtotal >= 500 || subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal + shippingFee;

  // Helper to load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Simple Validation
    const errors: Record<string, string> = {};
    if (!shippingInfo.name.trim()) errors.name = 'Full Name is required';
    if (!shippingInfo.phone.trim()) errors.phone = 'Phone Number is required';
    if (!shippingInfo.address.trim()) errors.address = 'Complete Address is required';
    if (!shippingInfo.city.trim()) errors.city = 'City is required';
    if (!shippingInfo.pincode.trim() || shippingInfo.pincode.length !== 6) {
      errors.pincode = 'Valid 6-digit Pincode is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const orderPayload = {
      customerName: shippingInfo.name,
      phone: shippingInfo.phone,
      address: `${shippingInfo.address}, ${shippingInfo.city} - ${shippingInfo.pincode}`,
      totalAmount: grandTotal,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        mrp: item.mrp,
        image: item.image,
        form: item.form,
        quantity: item.quantity,
        cartQuantity: item.cartQuantity
      })),
      paymentMethod: 'Cash on Delivery'
    };

    if (paymentMethod === 'online') {
      setIsProcessingPayment(true);
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          alert('Failed to load Razorpay checkout client. Check internet connection.');
          setIsProcessingPayment(false);
          return;
        }

        // Trigger backend create-order API
        const createRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: grandTotal })
        });
        const orderData = await createRes.json();

        if (orderData.error) {
          alert('Failed to initiate secure payment transaction: ' + orderData.error);
          setIsProcessingPayment(false);
          return;
        }

        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Meducil',
          description: 'Secure Homoeopathic Checkout Portal',
          order_id: orderData.id,
          handler: async function (response: any) {
            try {
              // Trigger signature verification API
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature || 'mock_sig_placeholder'
                })
              });
              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                // Finalize insertion in DB with transaction ID
                const finalOrder = {
                  ...orderPayload,
                  paymentMethod: `Razorpay Online (${response.razorpay_payment_id || 'Captured'})`
                };
                const created = await createOrder(finalOrder);

                const recentOrder = {
                  id: created.id,
                  name: created.customerName,
                  phone: created.phone,
                  address: created.address,
                  total: created.totalAmount,
                  items: created.items,
                  paymentMethod: created.paymentMethod,
                  deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toDateString()
                };

                localStorage.setItem('recentBooking', JSON.stringify(recentOrder));
                clearCart();
                setCartOpen(false);
                setCheckoutStep('cart');
                setIsProcessingPayment(false);
                router.push(`/success?id=${created.id}`);
              } else {
                alert('Payment verification failed: ' + verifyData.error);
                setIsProcessingPayment(false);
              }
            } catch (err) {
              console.error('Signature check routine crashed:', err);
              setIsProcessingPayment(false);
            }
          },
          prefill: {
            name: shippingInfo.name,
            contact: shippingInfo.phone
          },
          theme: {
            color: '#0f172a'
          },
          modal: {
            ondismiss: function() {
              setIsProcessingPayment(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error('Razorpay process failed:', err);
        setIsProcessingPayment(false);
      }
    } else {
      // Cash on Delivery
      try {
        const created = await createOrder(orderPayload);
        const recentOrder = {
          id: created.id,
          name: created.customerName,
          phone: created.phone,
          address: created.address,
          total: created.totalAmount,
          items: created.items,
          paymentMethod: created.paymentMethod,
          deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toDateString()
        };

        localStorage.setItem('recentBooking', JSON.stringify(recentOrder));
        clearCart();
        setCartOpen(false);
        setCheckoutStep('cart');
        router.push(`/success?id=${created.id}`);
      } catch (err) {
        console.error('Failed to create COD order:', err);
      }
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => !isProcessingPayment && setCartOpen(false)}
            className="absolute inset-0 bg-slate-900"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {checkoutStep === 'cart' ? 'Shopping Cart' : 'Checkout Details'}
                </h2>
              </div>
              <button
                onClick={() => !isProcessingPayment && setCartOpen(false)}
                disabled={isProcessingPayment}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
                    <PackageOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Your Cart is Empty</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">
                      Explore our premium homeopathic dilutions, tablets and formulas to add items to your cart.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setCartOpen(false)} 
                    className="rounded-full bg-primary-600 text-white hover:bg-primary-700 px-6 text-sm"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : checkoutStep === 'cart' ? (
                /* Cart Items List */
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 hover:bg-slate-50 transition-colors">
                      <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-1.5 shrink-0 select-none">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="object-contain"
                        />
                      </div>
                      
                      <div className="flex-grow flex flex-col min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{item.brand} • {item.quantity}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-2">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-slate-200 rounded-lg h-7 bg-white shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                              className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-l-lg transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800">
                              {item.cartQuantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                              className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-r-lg transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <span className="font-bold text-slate-950 text-sm">
                            ₹{item.price * item.cartQuantity}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1 self-start transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Checkout Form */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                      placeholder="e.g. Priyanshu Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                    {formErrors.name && <p className="text-red-500 text-[10px] font-bold">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                    {formErrors.phone && <p className="text-red-500 text-[10px] font-bold">{formErrors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Delivery Address *</label>
                    <textarea
                      required
                      rows={3}
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      placeholder="Flat No, Street Name, Landmark..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-sans"
                    />
                    {formErrors.address && <p className="text-red-500 text-[10px] font-bold">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">City *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        placeholder="e.g. New Delhi"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                      />
                      {formErrors.city && <p className="text-red-500 text-[10px] font-bold">{formErrors.city}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={shippingInfo.pincode}
                        onChange={(e) => setShippingInfo({...shippingInfo, pincode: e.target.value.replace(/\D/g, '')})}
                        placeholder="e.g. 110001"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                      />
                      {formErrors.pincode && <p className="text-red-500 text-[10px] font-bold">{formErrors.pincode}</p>}
                    </div>
                  </div>

                  {/* Payment Mode Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-600 block">Payment Mode *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3.5 border rounded-2xl cursor-pointer select-none transition-all flex flex-col justify-between h-20 ${
                          paymentMethod === 'cod' 
                            ? 'bg-slate-900 border-slate-950 text-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Doorstep (COD)</span>
                          {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-primary-400" />}
                        </div>
                        <span className="text-[10px] opacity-80 leading-tight">Pay cash or UPI at delivery</span>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('online')}
                        className={`p-3.5 border rounded-2xl cursor-pointer select-none transition-all flex flex-col justify-between h-20 ${
                          paymentMethod === 'online' 
                            ? 'bg-slate-900 border-slate-950 text-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Online Payment</span>
                          {paymentMethod === 'online' && <CheckCircle2 className="w-4 h-4 text-primary-400" />}
                        </div>
                        <span className="text-[10px] opacity-80 leading-tight">UPI, Card, NetBanking</span>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Sticky Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    {shippingFee === 0 ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 border border-green-100 rounded">
                        FREE
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-900">₹{shippingFee}</span>
                    )}
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-[10px] text-amber-600 font-medium">Add ₹{500 - subtotal} more for Free Shipping!</p>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <Button 
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full rounded-2xl h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 transition-transform"
                  >
                    Proceed to Checkout <ChevronRight className="w-4.5 h-4.5" />
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setCheckoutStep('cart')}
                      disabled={isProcessingPayment}
                      className="rounded-2xl h-12 border-slate-200 hover:bg-slate-100 shrink-0 px-4 disabled:opacity-50"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleCheckoutSubmit}
                      disabled={isProcessingPayment}
                      className="flex-grow rounded-2xl h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-transform disabled:opacity-50"
                    >
                      {isProcessingPayment ? 'Processing...' : 'Confirm Order'}
                      <ShoppingBag className="w-4.5 h-4.5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
