'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Truck, Calendar, MapPin, Phone, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function SuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Load mock order data from localStorage
    const saved = localStorage.getItem('recentBooking');
    if (saved) {
      setOrderData(JSON.parse(saved));
    } else if (orderId) {
      // Fallback fallback if localStorage got cleared
      setOrderData({
        id: orderId,
        name: 'Customer',
        phone: 'Contact Number',
        address: 'Specified Delivery Address',
        total: 250,
        paymentMethod: 'Cash on Delivery',
        deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toDateString(),
        items: []
      });
    }
  }, [orderId]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Confetti-style checkmark badge */}
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-green-100 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-base text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Thank you for shopping with Meducil. Your order has been registered and is being processed for express doorstep dispatch.
          </p>

          <Card className="shadow-xl border-slate-100 overflow-hidden text-left mb-10 rounded-3xl bg-white">
            {/* Header info */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Order #{orderData.id.slice(-6).toUpperCase()}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Status: Processing Dispatch</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-primary-400" />
            </div>

            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Delivery info items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-500" /> Shipping Recipient
                  </h4>
                  <div className="text-sm text-slate-600 pl-6">
                    <p className="font-semibold text-slate-900">{orderData.name}</p>
                    <p className="text-xs flex items-center gap-1.5 mt-1 text-slate-400">
                      <Phone className="w-3.5 h-3.5" /> {orderData.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-500" /> Delivery Address
                  </h4>
                  <p className="text-sm text-slate-600 pl-6 leading-relaxed">{orderData.address}</p>
                </div>
              </div>

              {/* Delivery speed estimate */}
              <div className="bg-primary-50/50 border border-primary-100/50 rounded-2xl p-5 flex items-start gap-4">
                <Truck className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div className="text-sm text-primary-900 space-y-1">
                  <h5 className="font-bold">Potency-Safe Express Delivery</h5>
                  <p className="text-primary-800/80 leading-relaxed text-xs">
                    Your formulations are protected in shock-proof bubble-wrapped cases to guard dilutions and drops. 
                    Estimated doorstep delivery by: <strong className="text-primary-950 font-bold block sm:inline mt-1 sm:mt-0">{orderData.deliveryDate}</strong>
                  </p>
                </div>
              </div>

              {/* Order items review */}
              {orderData.items && orderData.items.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-slate-950 text-sm">Items Ordered</h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20">
                    {orderData.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center p-4">
                        <div className="flex gap-3 min-w-0">
                          <div className="relative w-10 h-10 bg-white rounded-lg border border-slate-100 p-1 flex items-center justify-center shrink-0">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.name}</p>
                            <p className="text-[11px] text-slate-400">{item.brand} • {item.form} • Qty: {item.cartQuantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-950 text-sm shrink-0 pl-4">₹{item.price * item.cartQuantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Receipt Totals */}
              <div className="border-t border-slate-100 pt-6 flex flex-col items-end space-y-2 text-sm text-slate-500">
                <div className="flex justify-between w-full max-w-[240px]">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-slate-800">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between w-full max-w-[240px] text-base font-bold text-slate-950 border-t border-slate-100 pt-3">
                  <span>Grand Total Paid:</span>
                  <span>₹{orderData.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/medicines">
            <Button size="xl" className="w-full sm:w-auto shadow-xl shadow-primary-500/10 px-12 bg-primary-600 text-white hover:bg-primary-700 rounded-full font-bold">
              Continue Shopping <ArrowRight className="w-4.5 h-4.5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <SuccessClient />
    </Suspense>
  );
}
