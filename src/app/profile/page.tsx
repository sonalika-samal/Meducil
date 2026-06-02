'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '@/lib/data/orderStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getCurrentUser, logoutUser, updateUserProfile, updateUserPassword, UserProfile } from '@/lib/data/userStore';
import { 
  User, Lock, ShieldAlert, ShoppingBag, LogOut, CheckCircle, AlertCircle, Edit3, Key, Phone, Save, Mail, Truck, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { orders, loading: ordersLoading } = useOrders();
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [expandedTrackingOrderId, setExpandedTrackingOrderId] = useState<string | null>(null);

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Edit Form State
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Load current user
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        phone: currentUser.phone
      });
    }

    // Listen to changes in auth
    const handleAuth = () => {
      const u = getCurrentUser();
      setUser(u);
      if (u) {
        setProfileForm({ name: u.name, phone: u.phone });
      }
    };
    window.addEventListener('meducil_auth_change', handleAuth);
    return () => window.removeEventListener('meducil_auth_change', handleAuth);
  }, []);



  // Auth Open Trigger Helper
  const triggerLogin = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('meducil_open_auth', { detail: { mode: 'login' } }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileError('');
    setProfileSuccess('');

    if (!profileForm.name.trim()) {
      setProfileError('Username / Full Name cannot be blank');
      return;
    }
    if (!profileForm.phone.trim()) {
      setProfileError('Phone number cannot be blank');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const updated = await updateUserProfile(user.id, profileForm.name, profileForm.phone);
      setUser(updated);
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile details');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.newPassword.trim()) {
      setPasswordError('New password is required');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateUserPassword(user.id, passwordForm.newPassword);
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update user password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  // Filter orders by current user's phone number
  const myOrders = user ? orders.filter(o => o.phone.trim() === user.phone.trim()) : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-200 text-slate-400">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Access Restricted</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              Please log in to view your order logs and edit your profile parameters.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={triggerLogin} className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 h-12 shadow-lg">
              Sign In to Account
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="rounded-full border-slate-200 hover:bg-slate-100 font-bold px-8 h-12">
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16 font-sans">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold font-sans shadow-md">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, {user.name}!</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Account Registered: {new Date(user.createdAt).toDateString()}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="rounded-full h-10 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold shrink-0 self-start md:self-center"
          >
            <LogOut className="w-4 h-4 mr-2" /> Log Out
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: PROFILE CONFIG */}
          <div className="space-y-8">
            
            {/* Edit Profile Details */}
            <Card className="rounded-3xl border-slate-100 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-900 p-5 text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary-400" />
                <h3 className="font-bold text-sm">Profile Details</h3>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Username / Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contact Phone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address (Primary)</label>
                    <div className="relative">
                      <input
                        type="email"
                        readOnly
                        value={user.email}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-mono select-all cursor-not-allowed"
                        title="Email address cannot be changed"
                      />
                    </div>
                  </div>

                  {profileError && (
                    <div className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-xl text-[10px] font-bold flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{profileError}</span>
                    </div>
                  )}

                  {profileSuccess && (
                    <div className="p-3 bg-green-50 border border-green-150 text-green-700 rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span>{profileSuccess}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs shadow-md mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                    <Save className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="rounded-3xl border-slate-100 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-900 p-5 text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-primary-400" />
                <h3 className="font-bold text-sm">Security & Password</h3>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Verify new password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                    />
                  </div>

                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-xl text-[10px] font-bold flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-3 bg-green-50 border border-green-150 text-green-700 rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs shadow-md mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    <Lock className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN: HISTORY */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-900 text-white p-5 rounded-3xl flex items-center gap-2.5 shadow-sm">
              <ShoppingBag className="w-5 h-5 text-primary-400" />
              <h3 className="font-bold text-sm">Medicine Purchase Logs ({myOrders.length})</h3>
            </div>

            {/* List Panels */}
            <div className="min-h-[400px]">
              
              <div className="space-y-4">
                {ordersLoading ? (
                  <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
                    <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-slate-400 mt-3 font-medium">Loading your medicine logs...</p>
                  </div>
                ) : myOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-150 p-12 text-center space-y-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto shadow-inner">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">No Orders Logged</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                        You haven't made any medicine purchases under this profile phone number yet.
                      </p>
                    </div>
                    <Button onClick={() => router.push('/medicines')} className="rounded-full bg-primary-600 text-white hover:bg-primary-700 text-xs px-6 h-9 font-bold">
                      Browse Medicines
                    </Button>
                  </div>
                ) : (
                  myOrders.map((order) => (
                    <Card key={order.id} className="rounded-3xl border-slate-100 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
                      {/* Order card header */}
                      <div className="bg-slate-50 border-b border-slate-100 p-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-mono text-slate-400 text-[10px] block uppercase font-bold">Transaction ID</span>
                          <span className="font-bold text-slate-900 uppercase">ORD-{order.id.slice(-6)}</span>
                        </div>
                        <div>
                          <span className="font-mono text-slate-400 text-[10px] block uppercase font-bold">Date Placed</span>
                          <span className="font-semibold text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="font-mono text-slate-400 text-[10px] block uppercase font-bold">Payment Status</span>
                          <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="font-mono text-slate-400 text-[10px] block uppercase font-bold">Order Total</span>
                          <span className="font-black text-slate-950">₹{order.totalAmount}</span>
                        </div>
                        <div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-150' :
                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-150' :
                            order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-150' :
                            'bg-amber-50 text-amber-700 border border-amber-150'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Products List */}
                      <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Items summary</span>
                          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20">
                            {order.items && order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-3.5 text-xs">
                                <div className="flex gap-3 min-w-0">
                                  <div className="relative w-8 h-8 bg-white border border-slate-100 p-1 flex items-center justify-center rounded shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-semibold text-slate-800 block truncate">{item.name}</span>
                                    <span className="text-[10px] text-slate-400">{item.brand} • {item.form} • Qty: {item.cartQuantity}</span>
                                  </div>
                                </div>
                                <span className="font-bold text-slate-950 pl-3">₹{item.price * item.cartQuantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Destination */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                          <div>
                            <span className="font-bold text-slate-800 block mb-0.5">Shipping Destination</span>
                            <span className="leading-relaxed">{order.address}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className="bg-primary-50/50 border border-primary-100/50 rounded-2xl p-3 flex flex-col justify-center">
                              <span className="font-bold text-primary-900 block mb-0.5">Express Tracking Active</span>
                              <span className="font-mono text-xs text-primary-950 font-bold select-all">{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>

                        {/* Track Order Expandable Section */}
                        <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => setExpandedTrackingOrderId(expandedTrackingOrderId === order.id ? null : order.id)}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 font-sans"
                            >
                              <Truck className="w-3.5 h-3.5" /> 
                              {expandedTrackingOrderId === order.id ? 'Hide Tracking Details' : 'Track Order'}
                            </button>
                          </div>

                          <AnimatePresence>
                            {expandedTrackingOrderId === order.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                                  {/* Progress Visualizer */}
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-sans">Delivery Milestone</span>
                                    <div className="flex items-center justify-between relative pt-2 pb-6 px-1">
                                      {/* Bar */}
                                      <div className="absolute left-0 right-0 top-[26px] h-1.5 bg-slate-200 rounded-full z-0">
                                        <div 
                                          className="h-full bg-primary-600 rounded-full transition-all duration-500"
                                          style={{ 
                                            width: 
                                              order.status === 'Pending' ? '0%' :
                                              order.status === 'Shipped' ? '50%' :
                                              order.status === 'Delivered' ? '100%' : '0%'
                                          }}
                                        />
                                      </div>
                                      
                                      {/* Steps */}
                                      {[
                                        { label: 'Ordered', status: 'Pending' },
                                        { label: 'Shipped', status: 'Shipped' },
                                        { label: 'Delivered', status: 'Delivered' }
                                      ].map((step, idx) => {
                                        const isCompleted = 
                                          (step.status === 'Pending') ||
                                          (step.status === 'Shipped' && (order.status === 'Shipped' || order.status === 'Delivered')) ||
                                          (step.status === 'Delivered' && order.status === 'Delivered');
                                        const isActive = order.status === step.status;
                                        
                                        return (
                                          <div key={idx} className="flex flex-col items-center z-10 relative">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 font-bold text-[10px] transition-all duration-300 ${
                                              isActive 
                                                ? 'bg-slate-900 border-slate-900 text-white scale-110 shadow-md shadow-slate-950/15'
                                                : isCompleted
                                                ? 'bg-primary-600 border-primary-600 text-white'
                                                : 'bg-white border-slate-200 text-slate-400'
                                            }`}>
                                              {isCompleted ? '✓' : idx + 1}
                                            </div>
                                            <span className={`text-[10px] font-bold mt-1.5 absolute top-7 whitespace-nowrap font-sans ${
                                              isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400'
                                            }`}>
                                              {step.label}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Tracking Information Display */}
                                  {order.trackingNumber || order.courierName ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60">
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div>
                                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-sans">Courier Partner</span>
                                            <span className="font-bold text-slate-800 font-sans">{order.courierName || 'Standard Delivery'}</span>
                                          </div>
                                          <div>
                                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-sans">Tracking Number</span>
                                            <span className="font-mono font-bold text-slate-900 select-all bg-white px-2 py-0.5 rounded border border-slate-100 inline-block">{order.trackingNumber || 'N/A'}</span>
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-sans">Shipment Status</span>
                                          <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5 font-sans">
                                            <span className={`w-2 h-2 rounded-full ${
                                              order.status === 'Pending' ? 'bg-amber-500' :
                                              order.status === 'Shipped' ? 'bg-blue-500' :
                                              order.status === 'Delivered' ? 'bg-green-500' : 'bg-red-500'
                                            }`}></span>
                                            {order.status === 'Pending' && 'Preparing your package for courier dispatch'}
                                            {order.status === 'Shipped' && 'Package handed over to courier partner'}
                                            {order.status === 'Delivered' && 'Package delivered successfully'}
                                            {order.status === 'Cancelled' && 'This shipment order has been cancelled'}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center md:justify-end">
                                        {order.trackingUrl ? (
                                          <a
                                            href={order.trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full md:w-auto px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary-600/10 flex items-center justify-center gap-2 font-sans"
                                          >
                                            Track Shipment <ExternalLink className="w-3.5 h-3.5" />
                                          </a>
                                        ) : (
                                          <div className="text-[11px] text-slate-400 italic font-sans">
                                            Live mapping url not configured. Contact support for assistance.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3 text-xs text-amber-800">
                                      <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                                      <div className="space-y-1 font-sans">
                                        <p className="font-bold text-amber-900">Tracking details pending dispatch</p>
                                        <p className="text-amber-800/90 leading-relaxed">
                                          Tracking details will be available once your order is dispatched.
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
