'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine } from '@/lib/data/medicines';
import { logCartEvent } from '@/lib/data/cartEventStore';
import { getCurrentUser } from '@/lib/data/userStore';

export interface CartItem {
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

interface CartContextType {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (medicine: Medicine, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('meducil_shopping_cart');
      if (stored) {
        try {
          setCart(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse shopping cart:', e);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('meducil_shopping_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (medicine: Medicine, quantity: number) => {
    const user = getCurrentUser();
    if (!user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('meducil_pending_cart_item', JSON.stringify({ medicine, quantity }));
        window.dispatchEvent(new CustomEvent('meducil_open_auth', { detail: { mode: 'signup' } }));
      }
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === medicine.id);
      
      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          cartQuantity: updatedCart[existingItemIndex].cartQuantity + quantity,
        };
        return updatedCart;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: medicine.id,
          name: medicine.name,
          brand: medicine.brand,
          price: medicine.price,
          mrp: medicine.mrp,
          image: medicine.image,
          form: medicine.form,
          quantity: medicine.quantity,
          cartQuantity: quantity,
        };
        return [...prevCart, newItem];
      }
    });

    // Background analytics logging
    logCartEvent({
      itemId: medicine.id,
      itemName: medicine.name,
      itemBrand: medicine.brand,
      quantity: quantity,
      action: 'Add to Cart'
    });

    // Auto-open drawer
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === id);
      if (item) {
        // Background analytics logging
        logCartEvent({
          itemId: item.id,
          itemName: item.name,
          itemBrand: item.brand,
          quantity: item.cartQuantity,
          action: 'Remove from Cart'
        });
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === id);
      if (item) {
        const diff = quantity - item.cartQuantity;
        if (diff !== 0) {
          // Background analytics logging
          logCartEvent({
            itemId: item.id,
            itemName: item.name,
            itemBrand: item.brand,
            quantity: Math.abs(diff),
            action: diff > 0 ? 'Increase Quantity' : 'Decrease Quantity'
          });
        }
      }
      return prevCart.map((item) =>
        item.id === id ? { ...item, cartQuantity: quantity } : item
      );
    });
  };

  const clearCart = () => {
    if (cart.length > 0) {
      logCartEvent({
        itemId: 'ALL',
        itemName: 'Multiple Items',
        itemBrand: 'Cart',
        quantity: cart.reduce((acc, i) => acc + i.cartQuantity, 0),
        action: 'Clear Cart'
      });
    }
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cartQuantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
