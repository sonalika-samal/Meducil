'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Medicine } from './medicines';
import { getLocalMedicines, saveLocalMedicines } from './medicineStore';

export interface Review {
  id: string;
  medicineId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const LOCAL_REVIEWS_KEY = 'meducil_customer_reviews';

// Default seeded reviews for static medicines when running locally
const SEED_REVIEWS: Review[] = [
  {
    id: 'seed-rev-1',
    medicineId: 'cca-1',
    name: 'Amit Patel',
    rating: 5,
    comment: 'Excellent remedy for allergic runny nose. Showed results within a day! Highly recommend it.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'seed-rev-2',
    medicineId: 'cca-1',
    name: 'Sarah Jones',
    rating: 4,
    comment: 'Very helpful for mild sneezing and dust allergies. Safe with no drowsiness.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'seed-rev-3',
    medicineId: 'dig-1',
    name: 'Rajesh Sharma',
    rating: 5,
    comment: 'Highly effective for acidity and indigestion. A must-have in every home.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function getLocalReviews(): Review[] {
  if (typeof window === 'undefined') {
    return SEED_REVIEWS;
  }
  const stored = localStorage.getItem(LOCAL_REVIEWS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return SEED_REVIEWS;
  }
}

export function saveLocalReviews(reviews: Review[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  }
}

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      const allLocal = getLocalReviews();
      const filtered = allLocal.filter((r) => r.medicineId === productId);
      // Sort newest first
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(filtered);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('medicine_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setReviews(
          data.map((row: any) => ({
            id: row.id,
            medicineId: row.medicine_id,
            name: row.name,
            rating: Number(row.rating),
            comment: row.comment,
            createdAt: row.created_at
          }))
        );
      } else {
        // Fallback to seeds if empty in Supabase
        const allLocal = getLocalReviews();
        const filtered = allLocal.filter((r) => r.medicineId === productId);
        setReviews(filtered);
      }
    } catch (e) {
      console.error('Failed to fetch reviews from Supabase:', e);
      const allLocal = getLocalReviews();
      const filtered = allLocal.filter((r) => r.medicineId === productId);
      setReviews(filtered);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    refetch: fetchReviews
  };
}

export async function submitReview(
  productId: string,
  name: string,
  rating: number,
  comment: string
): Promise<Review> {
  const newReview: Review = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rev-${Date.now()}`,
    medicineId: productId,
    name,
    rating,
    comment,
    createdAt: new Date().toISOString()
  };

  // 1. Save review to appropriate data store
  let savedToDb = false;
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          id: newReview.id,
          medicine_id: newReview.medicineId,
          name: newReview.name,
          rating: newReview.rating,
          comment: newReview.comment,
          created_at: newReview.createdAt
        }
      ]);
      if (!error) {
        savedToDb = true;
      } else {
        console.error('Supabase review insert error:', error);
      }
    } catch (e) {
      console.error('Error saving review to Supabase:', e);
    }
  }

  // Always back up/write to local reviews list to ensure consistency
  const allLocal = getLocalReviews();
  saveLocalReviews([newReview, ...allLocal]);

  // 2. Recalculate medicine rating and reviews count
  // First, get all reviews for this product to compute average
  let productReviews: Review[] = [];
  if (isSupabaseConfigured() && savedToDb) {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('rating')
        .eq('medicine_id', productId);
      if (data) {
        productReviews = data.map((r: any) => ({ rating: r.rating } as Review));
      }
    } catch (e) {
      console.error('Failed to get ratings from database, recalculating locally:', e);
    }
  }

  if (productReviews.length === 0) {
    // Recalculate locally
    productReviews = getLocalReviews().filter((r) => r.medicineId === productId);
  }

  const reviewCount = productReviews.length;
  const averageRating =
    reviewCount > 0
      ? Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : rating;

  // 3. Update the medicines table with new stats
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('medicines')
        .update({
          rating: averageRating,
          reviews: reviewCount
        })
        .eq('id', productId);
    } catch (e) {
      console.error('Failed to update medicine rating in Supabase:', e);
    }
  }

  // Update in local storage medicines list as well
  const localMeds = getLocalMedicines();
  const updatedMeds = localMeds.map((med) => {
    if (med.id === productId) {
      return {
        ...med,
        rating: averageRating,
        reviews: reviewCount
      };
    }
    return med;
  });
  saveLocalMedicines(updatedMeds);

  // Dispatch global event so components can reload the updated medicine data
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('meducil_medicines_updated'));
  }

  return newReview;
}
