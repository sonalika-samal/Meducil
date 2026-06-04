'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine } from '@/lib/data/medicines';

interface WishlistContextType {
  wishlist: Medicine[];
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  toggleWishlist: (medicine: Medicine) => void;
  isWishlisted: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Medicine[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('meducil_wishlist');
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse wishlist:', e);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('meducil_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized]);

  const toggleWishlist = (medicine: Medicine) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === medicine.id);
      if (exists) {
        return prev.filter((item) => item.id !== medicine.id);
      } else {
        return [...prev, medicine];
      }
    });
  };

  const isWishlisted = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistOpen,
        setWishlistOpen,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
        clearWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
