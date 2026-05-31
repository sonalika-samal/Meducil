'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, PhoneCall, Stethoscope, ChevronDown, Search, ShoppingCart, User, LogOut, Mail, Phone, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/data/cartContext';
import { getCurrentUser, logoutUser, signUpUser, signInUser, UserProfile } from '@/lib/data/userStore';

export function Header() {
  const { setCartOpen, getCartCount, addToCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [medicinesDropdownOpen, setMedicinesDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Auth States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Auth Form State
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial load
    setUser(getCurrentUser());

    // Listen for auth state changes
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('meducil_auth_change', handleAuthChange);

    // Listen for global open auth trigger
    const handleOpenAuth = (e: any) => {
      if (e.detail && e.detail.mode) {
        setAuthMode(e.detail.mode);
      } else {
        setAuthMode('signup');
      }
      setIsAuthModalOpen(true);
    };
    window.addEventListener('meducil_open_auth', handleOpenAuth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('meducil_auth_change', handleAuthChange);
      window.removeEventListener('meducil_open_auth', handleOpenAuth);
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      if (authMode === 'signup') {
        if (!authForm.name.trim() || !authForm.email.trim() || !authForm.phone.trim() || !authForm.password.trim()) {
          setAuthError('All fields are required');
          return;
        }
        if (authForm.password.length < 6) {
          setAuthError('Password must be at least 6 characters');
          return;
        }
        await signUpUser(authForm.name, authForm.email, authForm.phone, authForm.password);
        setAuthSuccess('Account registered successfully!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setAuthForm({ name: '', email: '', phone: '', password: '' });
          
          // Complete pending cart addition if present
          const pending = localStorage.getItem('meducil_pending_cart_item');
          if (pending) {
            try {
              const { medicine, quantity } = JSON.parse(pending);
              addToCart(medicine, quantity);
              localStorage.removeItem('meducil_pending_cart_item');
            } catch (err) {
              console.error('Failed to add pending cart item:', err);
            }
          }
        }, 1500);
      } else {
        if (!authForm.email.trim() || !authForm.password.trim()) {
          setAuthError('Email and Password are required');
          return;
        }
        await signInUser(authForm.email, authForm.password);
        setAuthSuccess('Welcome back!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setAuthForm({ name: '', email: '', phone: '', password: '' });

          // Complete pending cart addition if present
          const pending = localStorage.getItem('meducil_pending_cart_item');
          if (pending) {
            try {
              const { medicine, quantity } = JSON.parse(pending);
              addToCart(medicine, quantity);
              localStorage.removeItem('meducil_pending_cart_item');
            } catch (err) {
              console.error('Failed to add pending cart item:', err);
            }
          }
        }, 1500);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Medicines', href: '/medicines', hasDropdown: true },
    { name: 'Shipping & Delivery', href: '/shipping' },
    { name: 'Contact', href: '/contact' },
  ];

  const medicineCategories = [
    { name: 'Wellness', href: '/medicines?category=Wellness' },
    { name: 'Cold & Cough', href: '/medicines?category=Cold & Cough' },
    { name: 'Gastric', href: '/medicines?category=Gastric' },
    { name: 'Pain Relief', href: '/medicines?category=Pain Relief' },
    { name: 'Skin Care', href: '/medicines?category=Skin Care' },
    { name: "Women's Health", href: "/medicines?category=Women's Health" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center select-none shrink-0">
          <div className="relative h-16 w-52 overflow-hidden select-none shrink-0 -my-3">
            <Image
              src="/logo-main.png"
              alt="Meducil Logo"
              fill
              className="object-contain transition-all duration-300"
              style={{
                filter: pathname === '/' && !isScrolled ? 'brightness(0) invert(1)' : 'none',
                transform: 'scale(1.95)',
              }}
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.hasDropdown && setMedicinesDropdownOpen(true)}
              onMouseLeave={() => link.hasDropdown && setMedicinesDropdownOpen(false)}
            >
              <Link
                href={link.href}
                className={`flex items-center text-sm font-medium transition-colors py-2 ${
                  pathname === link.href || (link.hasDropdown && pathname.startsWith('/medicines'))
                    ? 'text-primary-600 font-bold'
                    : pathname === '/' && !isScrolled 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-slate-600 hover:text-primary-600'
                }`}
              >
                {link.name}
                {link.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
              </Link>
              
              {link.hasDropdown && (
                <AnimatePresence>
                  {medicinesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="py-2">
                        {medicineCategories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          <div className={`flex items-center space-x-4 transition-colors duration-300 ${
            pathname === '/' && !isScrolled ? 'text-white/80' : 'text-slate-600'
          }`}>
            <button className="hover:text-primary-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {/* User Account trigger */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans shadow transition-all select-none ${
                    pathname === '/' && !isScrolled 
                      ? 'bg-white text-slate-900 hover:bg-slate-100 border border-white' 
                      : 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                  title={user.name}
                >
                  {user.name.slice(0, 2).toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="hover:text-primary-600 transition-colors"
                  title="Sign In"
                >
                  <User className="h-5 w-5" />
                </button>
              )}

              {/* User settings Dropdown */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-slate-700"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{user?.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono line-clamp-1">{user?.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono line-clamp-1">{user?.phone}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors py-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" /> Log Out Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setCartOpen(true)} className="relative hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
          <Link href="/medicines">
            <Button variant="primary" className="rounded-full shadow-lg shadow-primary-500/30">
              Shop Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 transition-colors duration-300 ${
            pathname === '/' && !isScrolled ? 'text-white' : 'text-slate-600'
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden border-t border-slate-100"
          >
            <div className="flex flex-col p-4 space-y-4">
              {user && (
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
                  <div className="w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 ml-auto hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col">
                  <Link
                    href={link.href}
                    onClick={() => !link.hasDropdown && setMobileMenuOpen(false)}
                    className={`p-3 rounded-xl text-base font-medium flex justify-between items-center ${
                      pathname === link.href || (link.hasDropdown && pathname.startsWith('/medicines'))
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown className="h-5 w-5" />}
                  </Link>
                  {link.hasDropdown && (
                    <div className="pl-6 pr-4 py-2 space-y-2 border-l-2 border-primary-100 ml-4 mt-1">
                      {medicineCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 text-sm text-slate-500 hover:text-primary-600"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2">
                {!user && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAuthMode('login'); setIsAuthModalOpen(true); }}
                    className="flex items-center text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Sign In / Register
                  </button>
                )}
                <button onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }} className="flex items-center text-slate-600 relative">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 right-8 bg-accent-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </button>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link href="/medicines" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* Stunning Glassmorphic Login/Signup Modal (Rendered outside the header container to avoid blur inheritance) */}
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative z-[10000] font-sans"
          >
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {authMode === 'login' ? 'Welcome to Meducil' : 'Create User Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'login' 
                  ? 'Log in to access instant shipping and orders tracker' 
                  : 'Sign up to unlock 1-click guest checkouts'}
              </p>
            </div>

            {/* Toggle tabs */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      placeholder="9899001122"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-[11px] font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-[11px] font-bold flex items-center justify-center">
                  <span>{authSuccess}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs shadow mt-4 transition-all"
              >
                {authMode === 'signup' ? 'Register Profile' : 'Access Account'}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
);
}

