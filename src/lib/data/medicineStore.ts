'use client';

import { useState, useEffect } from 'react';
import { Medicine, medicines as staticMedicines } from './medicines';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const LOCAL_STORAGE_KEY = 'meducil_custom_medicines';

function mapRowToMedicine(row: any): Medicine {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    form: row.form,
    quantity: row.quantity,
    mainUsage: row.main_usage || '',
    description: row.description || '',
    price: Number(row.price),
    mrp: Number(row.mrp),
    image: row.image || '',
    rating: Number(row.rating || 5.0),
    reviews: Number(row.reviews || 0),
    potency: row.potency,
    stockStatus: row.stock_status || 'In Stock',
    isDoctorRecommended: !!row.is_doctor_recommended,
    isBestSeller: !!row.is_best_seller,
    benefits: row.benefits || [],
    ingredients: row.ingredients || [],
    dosage: row.dosage || '',
    safetyInfo: row.safety_info || [],
    storage: row.storage || ''
  };
}

function mapMedicineToRow(med: Medicine) {
  return {
    id: med.id,
    name: med.name,
    brand: med.brand,
    category: med.category,
    form: med.form,
    quantity: med.quantity,
    main_usage: med.mainUsage,
    description: med.description,
    price: med.price,
    mrp: med.mrp,
    image: med.image,
    rating: med.rating,
    reviews: med.reviews,
    potency: med.potency,
    stock_status: med.stockStatus,
    is_doctor_recommended: !!med.isDoctorRecommended,
    is_best_seller: !!med.isBestSeller,
    benefits: med.benefits || [],
    ingredients: med.ingredients || [],
    dosage: med.dosage,
    safety_info: med.safetyInfo || [],
    storage: med.storage
  };
}

export function getLocalMedicines(): Medicine[] {
  if (typeof window === 'undefined') {
    return staticMedicines;
  }
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(staticMedicines));
    return staticMedicines;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return staticMedicines;
  }
}

export function saveLocalMedicines(list: Medicine[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('meducil_medicines_updated'));
  }
}

export type ConnectionStatus = 'connected' | 'local';

export function useMedicines() {
  const [list, setList] = useState<Medicine[]>(() => {
    // Prevent SSR layout mismatch
    return staticMedicines;
  });
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('local');

  useEffect(() => {
    async function loadData() {
      // 1. If Supabase is not configured, load from localStorage
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured. Loading products from local storage.');
        setList(getLocalMedicines());
        setConnectionStatus('local');
        setLoading(false);
        return;
      }

      // 2. If Supabase is configured, attempt to load from live database
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const mapped = data.map(mapRowToMedicine);
          setList(mapped);
          setConnectionStatus('connected');
        } else {
          // If the table is empty, seed it with the default static medicines so it's not blank!
          console.log('Supabase table is empty. Seeding with default homeopathic products...');
          const rowsToInsert = staticMedicines.map(mapMedicineToRow);
          const { error: seedError } = await supabase.from('medicines').insert(rowsToInsert);
          if (seedError) {
            console.error('Failed to seed Supabase database:', seedError);
          }
          setList(staticMedicines);
          setConnectionStatus('connected');
        }
      } catch (e) {
        console.warn('Failed to load from Supabase database. Falling back to local storage cache:', e);
        setList(getLocalMedicines());
        setConnectionStatus('local');
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Listener for local changes sync (for fallback mode)
    const handleUpdate = () => {
      if (!isSupabaseConfigured() || connectionStatus === 'local') {
        setList(getLocalMedicines());
      }
    };

    window.addEventListener('meducil_medicines_updated', handleUpdate);
    return () => {
      window.removeEventListener('meducil_medicines_updated', handleUpdate);
    };
  }, [connectionStatus]);

  const addMedicine = async (med: Omit<Medicine, 'id' | 'rating' | 'reviews'> & { id?: string; rating?: number; reviews?: number }) => {
    const newMed: Medicine = {
      ...med,
      id: med.id || `med-${Date.now()}`,
      rating: med.rating || 5.0,
      reviews: med.reviews || 0,
      benefits: med.benefits || [],
      ingredients: med.ingredients || [],
      safetyInfo: med.safetyInfo || [],
    } as Medicine;

    if (connectionStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('medicines')
          .insert([mapMedicineToRow(newMed)]);

        if (error) throw error;
        
        // Optimistic UI update
        setList(prev => [newMed, ...prev]);
      } catch (e) {
        console.error('Failed to save to Supabase. Writing to local storage fallback instead:', e);
        const current = getLocalMedicines();
        const updated = [newMed, ...current];
        saveLocalMedicines(updated);
        setList(updated);
        setConnectionStatus('local');
      }
    } else {
      const current = getLocalMedicines();
      const updated = [newMed, ...current];
      saveLocalMedicines(updated);
      setList(updated);
    }
    return newMed;
  };

  const deleteMedicine = async (id: string) => {
    if (connectionStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('medicines')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setList(prev => prev.filter(m => m.id !== id));
      } catch (e) {
        console.error('Failed to delete from Supabase. Mutating local storage fallback instead:', e);
        const current = getLocalMedicines();
        const updated = current.filter(m => m.id !== id);
        saveLocalMedicines(updated);
        setList(updated);
        setConnectionStatus('local');
      }
    } else {
      const current = getLocalMedicines();
      const updated = current.filter(m => m.id !== id);
      saveLocalMedicines(updated);
      setList(updated);
    }
  };

  const updateMedicine = async (updatedMed: Medicine) => {
    if (connectionStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('medicines')
          .update(mapMedicineToRow(updatedMed))
          .eq('id', updatedMed.id);

        if (error) throw error;

        setList(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
      } catch (e) {
        console.error('Failed to update in Supabase. Mutating local storage fallback instead:', e);
        const current = getLocalMedicines();
        const updated = current.map(m => m.id === updatedMed.id ? updatedMed : m);
        saveLocalMedicines(updated);
        setList(updated);
        setConnectionStatus('local');
      }
    } else {
      const current = getLocalMedicines();
      const updated = current.map(m => m.id === updatedMed.id ? updatedMed : m);
      saveLocalMedicines(updated);
      setList(updated);
    }
  };

  return {
    medicines: list,
    loading,
    connectionStatus,
    addMedicine,
    deleteMedicine,
    updateMedicine,
  };
}
