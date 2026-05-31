'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  image: string;
  form: string;
  quantity: string;
  cartQuantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  trackingNumber: string | null;
  items: OrderItem[];
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'meducil_orders';

function mapRowToOrder(row: any): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    totalAmount: Number(row.total_amount),
    status: row.status || 'Pending',
    paymentMethod: row.payment_method || 'Cash on Delivery',
    trackingNumber: row.tracking_number || null,
    items: Array.isArray(row.items) ? row.items : [],
    createdAt: row.created_at || new Date().toISOString()
  };
}

function mapOrderToRow(order: Order) {
  return {
    id: order.id,
    customer_name: order.customerName,
    phone: order.phone,
    address: order.address,
    total_amount: order.totalAmount,
    status: order.status,
    payment_method: order.paymentMethod,
    tracking_number: order.trackingNumber,
    items: order.items,
    created_at: order.createdAt
  };
}

export function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveLocalOrders(orders: Order[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('meducil_orders_updated'));
  }
}

export type ConnectionStatus = 'connected' | 'local';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('local');

  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured. Loading orders from local storage.');
        setOrders(getLocalOrders());
        setConnectionStatus('local');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const mapped = data.map(mapRowToOrder);
          setOrders(mapped);
          setConnectionStatus('connected');
        }
      } catch (e) {
        console.warn('Failed to load from Supabase database. Falling back to local storage cache:', e);
        setOrders(getLocalOrders());
        setConnectionStatus('local');
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const handleUpdate = () => {
      if (!isSupabaseConfigured() || connectionStatus === 'local') {
        setOrders(getLocalOrders());
      }
    };

    window.addEventListener('meducil_orders_updated', handleUpdate);
    return () => {
      window.removeEventListener('meducil_orders_updated', handleUpdate);
    };
  }, [connectionStatus]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingNumber'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      status: 'Pending',
      trackingNumber: null,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured() && connectionStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('orders')
          .insert([mapOrderToRow(newOrder)]);

        if (error) throw error;

        // Optimistic update
        setOrders(prev => [newOrder, ...prev]);
      } catch (e) {
        console.error('Failed to save order to Supabase. Writing to local storage fallback instead:', e);
        const current = getLocalOrders();
        const updated = [newOrder, ...current];
        saveLocalOrders(updated);
        setOrders(updated);
        setConnectionStatus('local');
      }
    } else {
      const current = getLocalOrders();
      const updated = [newOrder, ...current];
      saveLocalOrders(updated);
      setOrders(updated);
    }
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order['status'], trackingNumber?: string | null) => {
    if (isSupabaseConfigured() && connectionStatus === 'connected') {
      try {
        const updatePayload: any = { status };
        if (trackingNumber !== undefined) {
          updatePayload.tracking_number = trackingNumber;
        }

        const { error } = await supabase
          .from('orders')
          .update(updatePayload)
          .eq('id', id);

        if (error) throw error;

        setOrders(prev => prev.map(o => o.id === id ? { ...o, status, ...(trackingNumber !== undefined ? { trackingNumber } : {}) } : o));
      } catch (e) {
        console.error('Failed to update order status in Supabase. Mutating local storage fallback instead:', e);
        const current = getLocalOrders();
        const updated = current.map(o => o.id === id ? { ...o, status, ...(trackingNumber !== undefined ? { trackingNumber } : {}) } : o);
        saveLocalOrders(updated);
        setOrders(updated);
        setConnectionStatus('local');
      }
    } else {
      const current = getLocalOrders();
      const updated = current.map(o => o.id === id ? { ...o, status, ...(trackingNumber !== undefined ? { trackingNumber } : {}) } : o);
      saveLocalOrders(updated);
      setOrders(updated);
    }
  };

  const deleteOrder = async (id: string) => {
    if (isSupabaseConfigured() && connectionStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setOrders(prev => prev.filter(o => o.id !== id));
      } catch (e) {
        console.error('Failed to delete order from Supabase. Mutating local storage fallback instead:', e);
        const current = getLocalOrders();
        const updated = current.filter(o => o.id !== id);
        saveLocalOrders(updated);
        setOrders(updated);
        setConnectionStatus('local');
      }
    } else {
      const current = getLocalOrders();
      const updated = current.filter(o => o.id !== id);
      saveLocalOrders(updated);
      setOrders(updated);
    }
  };

  return {
    orders,
    loading,
    connectionStatus,
    createOrder,
    updateOrderStatus,
    deleteOrder
  };
}
