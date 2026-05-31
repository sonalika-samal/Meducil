'use client';

import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getCurrentUser } from './userStore';

export interface CartEvent {
  id: string;
  userIdentifier: string;
  itemId: string;
  itemName: string;
  itemBrand: string;
  quantity: number;
  action: string;
  createdAt: string;
}

const CART_EVENTS_KEY = 'meducil_cart_events';

export function getLocalCartEvents(): CartEvent[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_EVENTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveLocalCartEvents(events: CartEvent[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_EVENTS_KEY, JSON.stringify(events));
    window.dispatchEvent(new Event('meducil_cart_events_updated'));
  }
}

export async function logCartEvent(item: {
  itemId: string;
  itemName: string;
  itemBrand: string;
  quantity: number;
  action: string;
}): Promise<CartEvent> {
  const user = getCurrentUser();
  const userIdentifier = user ? `${user.name} (${user.email})` : 'Guest Session';
  
  const newEvent: CartEvent = {
    id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userIdentifier,
    itemId: item.itemId,
    itemName: item.itemName,
    itemBrand: item.itemBrand,
    quantity: item.quantity,
    action: item.action,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('cart_events')
        .insert([{
          id: newEvent.id,
          user_identifier: newEvent.userIdentifier,
          item_id: newEvent.itemId,
          item_name: newEvent.itemName,
          item_brand: newEvent.itemBrand,
          quantity: newEvent.quantity,
          action: newEvent.action,
          created_at: newEvent.createdAt
        }]);

      if (error) throw error;
    } catch (e) {
      console.warn('Failed to insert cart event to Supabase. Writing to local storage fallback instead:', e);
      const local = getLocalCartEvents();
      saveLocalCartEvents([...local, newEvent]);
    }
  } else {
    const local = getLocalCartEvents();
    saveLocalCartEvents([...local, newEvent]);
  }

  return newEvent;
}

export async function getAllCartEvents(): Promise<CartEvent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('cart_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((r: any) => ({
          id: r.id,
          userIdentifier: r.user_identifier,
          itemId: r.item_id,
          itemName: r.item_name,
          itemBrand: r.item_brand,
          quantity: Number(r.quantity),
          action: r.action,
          createdAt: r.created_at
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch cart events from Supabase. Falling back to local storage cache:', e);
    }
  }

  // Local fallback
  const local = getLocalCartEvents();
  return [...local].reverse();
}
