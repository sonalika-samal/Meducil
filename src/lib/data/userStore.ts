'use client';

import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const USERS_LOCAL_KEY = 'meducil_registered_users';
const LOGGED_IN_USER_KEY = 'meducil_logged_in_user';

export function getLocalUsers(): any[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_LOCAL_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveLocalUsers(users: any[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_LOCAL_KEY, JSON.stringify(users));
  }
}

export async function signUpUser(name: string, email: string, phone: string, password: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();

  // Check if email already exists locally first to prevent duplicates
  const local = getLocalUsers();
  const existsLocally = local.some((u: any) => u.email.trim().toLowerCase() === cleanEmail);
  if (existsLocally) {
    throw new Error('An account with this email address already exists');
  }

  const newUser = {
    id: `USR-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      // Check if email already exists in Supabase
      const { data: existingCloud } = await supabase
        .from('users')
        .select('id')
        .eq('email', cleanEmail);

      if (existingCloud && existingCloud.length > 0) {
        throw new Error('An account with this email address already exists');
      }

      const { error } = await supabase
        .from('users')
        .insert([{
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          password: password,
          created_at: newUser.createdAt
        }]);

      if (error) throw error;
    } catch (e: any) {
      if (e.message === 'An account with this email address already exists') {
        throw e;
      }
      console.warn('Failed to insert user to Supabase. Writing to local storage fallback instead:', e);
      saveLocalUsers([...local, { ...newUser, password }]);
    }
  } else {
    saveLocalUsers([...local, { ...newUser, password }]);
  }

  // Set as logged in
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new Event('meducil_auth_change'));
  }

  return newUser;
}

export async function signInUser(email: string, password: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail);

      if (error) throw error;

      if (data && data.length > 0) {
        const record = data[0];
        if (record.password === password) {
          const profile: UserProfile = {
            id: record.id,
            name: record.name,
            email: record.email,
            phone: record.phone,
            createdAt: record.created_at
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(profile));
            window.dispatchEvent(new Event('meducil_auth_change'));
          }
          return profile;
        } else {
          throw new Error('Invalid email or password');
        }
      }
    } catch (e: any) {
      console.warn('Supabase query failed or user not found. Checking local storage fallback:', e);
      if (e.message === 'Invalid email or password') {
        throw e;
      }
    }
  }

  // Local fallback
  const local = getLocalUsers();
  const found = local.find((u: any) => u.email.trim().toLowerCase() === cleanEmail);
  if (found) {
    if (found.password === password) {
      const profile: UserProfile = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        createdAt: found.createdAt
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(profile));
        window.dispatchEvent(new Event('meducil_auth_change'));
      }
      return profile;
    } else {
      throw new Error('Invalid email or password');
    }
  }

  throw new Error('No user account found with this email address');
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LOGGED_IN_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    window.dispatchEvent(new Event('meducil_auth_change'));
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, created_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          createdAt: r.created_at
        }));
      }
    } catch (e) {
      console.warn('Failed to query users from Supabase. Falling back to local storage cache:', e);
    }
  }

  // Local fallback
  const local = getLocalUsers();
  return local.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    createdAt: u.createdAt
  })).reverse();
}
