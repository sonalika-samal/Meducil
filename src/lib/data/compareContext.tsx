'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine } from '@/lib/data/medicines';

interface CompareContextType {
  compareList: Medicine[];
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
  addToCompare: (medicine: Medicine) => boolean; // Returns true if added, false if already present or full
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  getCompareCount: () => number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Medicine[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load comparison list from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('meducil_compare');
      if (stored) {
        try {
          setCompareList(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse compare list:', e);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save comparison list to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('meducil_compare', JSON.stringify(compareList));
    }
  }, [compareList, isInitialized]);

  const addToCompare = (medicine: Medicine): boolean => {
    let success = false;
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === medicine.id);
      if (exists) {
        return prev; // Already added
      }
      if (prev.length >= 4) {
        return prev; // Limit reached (max 4)
      }
      success = true;
      return [...prev, medicine];
    });
    return success;
  };

  const isInCompare = (id: string) => {
    return compareList.some((item) => item.id === id);
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const getCompareCount = () => {
    return compareList.length;
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        compareOpen,
        setCompareOpen,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        getCompareCount,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
