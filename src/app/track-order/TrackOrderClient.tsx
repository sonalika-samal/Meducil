'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Clock, Truck, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getLocalOrders, Order } from '@/lib/data/orderStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function TrackOrderClient() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  // Handle URL parameters for automatic tracking (e.g. from order success)
  useEffect(() => {
    const urlId = searchParams?.get('id');
    if (urlId) {
      setOrderId(urlId);
      handleTrack(urlId);
    }
  }, [searchParams]);

  const handleTrack = async (idToSearch: string) => {
    const cleanId = (idToSearch || orderId).trim();
    if (!cleanId) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      // 1. Search locally first
      const localOrders = getLocalOrders();
      const localMatch = localOrders.find(o => o.id.toLowerCase() === cleanId.toLowerCase());
      
      if (localMatch) {
        setOrder(localMatch);
        setLoading(false);
        return;
      }

      // 2. Search database if configured
      if (isSupabaseConfigured()) {
        const { data, error: dbError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', cleanId)
          .single();

        if (dbError) {
          throw new Error('Order not found in database');
        }

        if (data) {
          setOrder({
            id: data.id,
            customerName: data.customer_name,
            phone: data.phone,
            address: data.address,
            totalAmount: Number(data.total_amount),
            status: data.status || 'Pending',
            paymentMethod: data.payment_method || 'Cash on Delivery',
            trackingNumber: data.tracking_number || null,
            courierName: data.courier_name || null,
            trackingUrl: data.tracking_url || null,
            items: Array.isArray(data.items) ? data.items : [],
            createdAt: data.created_at || new Date().toISOString()
          });
          setLoading(false);
          return;
        }
      }
      
      setError('No order found with the provided ID. Please verify your code and try again.');
    } catch (err) {
      console.warn('Track order search failure:', err);
      setError('Order not found. Please double-check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  const step = order ? getStatusStep(order.status) : 1;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Input Box */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); handleTrack(''); }} className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Enter Order Details</h2>
          <p className="text-sm text-slate-500">
            Provide the unique Order ID (e.g. <code className="font-mono text-primary-600 bg-slate-50 px-1.5 py-0.5 rounded">ORD-XXXXXXXXXXXXX</code>) received in your SMS or email invoice.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="ORD-..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading} className="shrink-0 h-12 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Locating...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Order
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Loading Placeholder */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {searched && error && !loading && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
          <div>
            <h3 className="font-bold text-rose-900 text-lg">Order Not Found</h3>
            <p className="text-sm text-rose-700 mt-1">{error}</p>
          </div>
          <p className="text-xs text-rose-600">
            If you need assistance, please contact our support desk on WhatsApp at <a href="https://wa.me/917846969508" className="underline font-semibold">7846969508</a>.
          </p>
        </div>
      )}

      {/* Order Status Display */}
      {searched && order && !loading && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
          {/* Header details */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Reference</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{order.id}</h3>
              <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 text-right">
              <span className="text-xs text-slate-400 block">Total Amount</span>
              <span className="text-lg font-extrabold text-slate-900">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Tracking Status Pipeline */}
          {order.status === 'Cancelled' ? (
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-rose-950">This Order is Cancelled</h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  This transaction has been voided. Any payments processed will be refunded within 5-7 business days back to your payment method. For details, contact WhatsApp support at 7846969508.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Shipment Status</h4>
              
              {/* Visual timeline */}
              <div className="relative">
                {/* Connector line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 hidden sm:block" />
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block"
                  style={{ width: `${(step - 1) * 50}%` }}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                  {/* Step 1: Processing */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center bg-white">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step >= 1 ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-left sm:text-center">
                      <span className="block text-sm font-bold text-slate-900">Fulfillment Desk</span>
                      <span className="block text-xs text-slate-400">Remedy packaging</span>
                    </div>
                  </div>

                  {/* Step 2: Shipped */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center bg-white">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step >= 2 ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="text-left sm:text-center">
                      <span className="block text-sm font-bold text-slate-900">In Transit</span>
                      <span className="block text-xs text-slate-400">Shipped with courier</span>
                    </div>
                  </div>

                  {/* Step 3: Delivered */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center bg-white">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step >= 3 ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="text-left sm:text-center">
                      <span className="block text-sm font-bold text-slate-900">Delivered</span>
                      <span className="block text-xs text-slate-400">Safely handed over</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courier Details */}
          {(order.trackingNumber || order.courierName) && order.status !== 'Cancelled' && (
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans">Courier Logistics</span>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700 font-sans">
                <div className="space-y-1">
                  <p>Courier Partner: <strong>{order.courierName || 'Standard Courier'}</strong></p>
                  <p>Tracking Number: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-xs select-all">{order.trackingNumber || 'N/A'}</code></p>
                </div>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                  >
                    Track Shipment <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Order Items & Customer details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Shipment Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div className="space-y-2">
                <p><strong>Customer Name:</strong> {order.customerName}</p>
                <p><strong>Phone Contact:</strong> {order.phone}</p>
                <p><strong>Shipping Address:</strong> {order.address}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Payment Mode:</strong> {order.paymentMethod}</p>
                <p><strong>Remedy Formulations:</strong></p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} ({item.quantity}) — x{item.cartQuantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
