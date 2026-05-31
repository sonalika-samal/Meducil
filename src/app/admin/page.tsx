'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  Video, 
  CheckCircle, 
  Search, 
  FileText, 
  Pill, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  ExternalLink, 
  Star, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle,
  Copy,
  Check,
  Terminal,
  Database,
  Package,
  Truck,
  User,
  Phone,
  MapPin,
  CreditCard,
  ClipboardList,
  Lock,
  Unlock,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useMedicines } from '@/lib/data/medicineStore';
import { Medicine } from '@/lib/data/medicines';
import { useOrders, Order } from '@/lib/data/orderStore';
import Image from 'next/image';
import Link from 'next/link';
import { getAllUsers, UserProfile } from '@/lib/data/userStore';
import { getAllCartEvents, CartEvent } from '@/lib/data/cartEventStore';
import { PlusCircle, MinusCircle, Trash2 as TrashIcon, ShieldCheck as ShieldIcon, Sparkles } from 'lucide-react';

// Mock data for bookings
const mockBookings = [
  { id: 'ORD-7281', name: 'Priya Sharma', duration: 20, amount: 200, status: 'confirmed', date: '2026-05-11', time: '10:00 AM' },
  { id: 'ORD-9102', name: 'Rahul Desai', duration: 30, amount: 300, status: 'completed', date: '2026-05-10', time: '02:30 PM' },
  { id: 'ORD-3345', name: 'Anita Verma', duration: 10, amount: 100, status: 'pending', date: '2026-05-12', time: '11:15 AM' },
];

const PRESET_IMAGES = [
  { label: 'Dilution Bottle', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80' },
  { label: 'Drops / Liquid', url: 'https://images.unsplash.com/photo-1550572017-edb799988a69?w=500&q=80' },
  { label: 'Tablets / Pills', url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80' },
];

const CATEGORIES = [
  "Cold, Cough & Allergy",
  "Wellness, OCD & Anxiety",
  "Beauty, Skin & Hair Care",
  "Fever & Acute Care",
  "Digestive & Liver Care",
  "Joint Pain & Rheumatism",
  "Diabetes Care",
  "Women's Wellness"
];

const BRANDS = ["SBL", "Dr. Reckeweg", "Wheezal", "Bakson", "Allen", "Schwabe India", "Bach Flower"];
const FORMS = ["Dilution", "Drops", "Tablets", "Tonic", "Biochemic Tablets", "Ointment", "Globales"];

const SQL_SCHEMA = `-- ==========================================
-- 1. MEDICINES TABLE & POLICIES
-- ==========================================
CREATE TABLE IF NOT EXISTS medicines (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  form VARCHAR(100) NOT NULL,
  quantity VARCHAR(100) NOT NULL,
  main_usage TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  mrp NUMERIC(10, 2) NOT NULL,
  image TEXT NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  potency VARCHAR(100),
  stock_status VARCHAR(50) DEFAULT 'In Stock',
  is_doctor_recommended BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  benefits TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  dosage TEXT,
  safety_info TEXT[] DEFAULT '{}',
  storage TEXT DEFAULT 'Store in a cool, dry place away from direct sunlight.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on medicines" ON medicines
  FOR SELECT USING (true);

CREATE POLICY "Allow public writes on medicines" ON medicines
  FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 2. ORDERS TABLE & POLICIES
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(100) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Shipped, Delivered, Cancelled
  payment_method VARCHAR(100) DEFAULT 'Cash on Delivery',
  tracking_number VARCHAR(100),
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow public updates on orders" ON orders
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public deletes on orders" ON orders
  FOR DELETE USING (true);

-- ==========================================
-- 3. USERS TABLE & POLICIES
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on users" ON users
  FOR SELECT USING (true);

-- ==========================================
-- 4. CART EVENTS TABLE & POLICIES
-- ==========================================
CREATE TABLE IF NOT EXISTS cart_events (
  id VARCHAR(100) PRIMARY KEY,
  user_identifier VARCHAR(255) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_brand VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  action VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE cart_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on cart_events" ON cart_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on cart_events" ON cart_events
  FOR SELECT USING (true);`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const { medicines, addMedicine, updateMedicine, deleteMedicine, connectionStatus } = useMedicines();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Analytics & Logs States
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [cartEvents, setCartEvents] = useState<CartEvent[]>([]);
  const [activeCustomerSubTab, setActiveCustomerSubTab] = useState<'profiles' | 'signups' | 'activity'>('profiles');

  useEffect(() => {
    if (isAuthenticated) {
      async function loadAnalytics() {
        try {
          const u = await getAllUsers();
          setRegisteredUsers(u);
          const e = await getAllCartEvents();
          setCartEvents(e);
        } catch (err) {
          console.error('Failed to load registered accounts or event logs:', err);
        }
      }
      loadAnalytics();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('meducil_admin_authenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'meducil2026';
    if (typeof window !== 'undefined') {
      const customPass = localStorage.getItem('meducil_admin_custom_password');
      if (customPass) {
        correctPassword = customPass;
      }
    }

    if (passwordInput === correctPassword) {
      sessionStorage.setItem('meducil_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Password. Access Denied.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('meducil_admin_authenticated');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Settings Password Form State
  const [settingsCurrentPassword, setSettingsCurrentPassword] = useState('');
  const [settingsNewPassword, setSettingsNewPassword] = useState('');
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState('');
  const [settingsPasswordError, setSettingsPasswordError] = useState('');
  const [settingsPasswordSuccess, setSettingsPasswordSuccess] = useState('');

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsPasswordError('');
    setSettingsPasswordSuccess('');

    let correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'meducil2026';
    if (typeof window !== 'undefined') {
      const customPass = localStorage.getItem('meducil_admin_custom_password');
      if (customPass) {
        correctPassword = customPass;
      }
    }

    if (settingsCurrentPassword !== correctPassword) {
      setSettingsPasswordError('The current password you entered is incorrect.');
      return;
    }

    if (settingsNewPassword.length < 6) {
      setSettingsPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (settingsNewPassword !== settingsConfirmPassword) {
      setSettingsPasswordError('New password and confirmation password do not match.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('meducil_admin_custom_password', settingsNewPassword);
    }

    setSettingsPasswordSuccess('Administrator password updated successfully!');
    setSettingsCurrentPassword('');
    setSettingsNewPassword('');
    setSettingsConfirmPassword('');
  };
  
  // Orders State
  const { 
    orders, 
    loading: ordersLoading, 
    updateOrderStatus, 
    deleteOrder, 
    connectionStatus: ordersConnectionStatus 
  } = useOrders();
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [addressCopied, setAddressCopied] = useState(false);

  const handleCopyAddressSlip = (order: Order) => {
    const text = `TO: ${order.customerName}
PHONE: ${order.phone}
DELIVERY ADDRESS: ${order.address}
METHOD: ${order.paymentMethod}
AMOUNT TO COLLECT: ₹${order.totalAmount}`;
    navigator.clipboard.writeText(text);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const handleStatusChange = async (id: string, status: Order['status'], currentTracking?: string | null) => {
    await updateOrderStatus(id, status, currentTracking);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };
  
  // Search & Filter State for Medicines
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Medicine | null>(null);
  
  // Setup Guide Modal State
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'SBL',
    category: 'Cold, Cough & Allergy',
    form: 'Dilution',
    quantity: '30ml',
    mainUsage: '',
    description: '',
    mrp: 120,
    price: 95,
    image: PRESET_IMAGES[0].url,
    potency: '30 CH',
    stockStatus: 'In Stock' as 'In Stock' | 'Out of Stock' | 'Few Left',
    isBestSeller: false,
    isDoctorRecommended: false,
    benefitsInput: '',
    ingredientsInput: '',
    dosage: '',
    safetyInfoInput: '',
    storage: 'Store in a cool, dry place away from direct sunlight.'
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'SBL',
      category: 'Cold, Cough & Allergy',
      form: 'Dilution',
      quantity: '30ml',
      mainUsage: '',
      description: '',
      mrp: 120,
      price: 95,
      image: PRESET_IMAGES[0].url,
      potency: '30 CH',
      stockStatus: 'In Stock',
      isBestSeller: false,
      isDoctorRecommended: false,
      benefitsInput: '',
      ingredientsInput: '',
      dosage: '',
      safetyInfoInput: '',
      storage: 'Store in a cool, dry place away from direct sunlight.'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (medicine: Medicine) => {
    setEditingProduct(medicine);
    setFormData({
      name: medicine.name,
      brand: medicine.brand,
      category: medicine.category,
      form: medicine.form,
      quantity: medicine.quantity,
      mainUsage: medicine.mainUsage,
      description: medicine.description,
      mrp: medicine.mrp,
      price: medicine.price,
      image: medicine.image,
      potency: medicine.potency || '30 CH',
      stockStatus: medicine.stockStatus,
      isBestSeller: !!medicine.isBestSeller,
      isDoctorRecommended: !!medicine.isDoctorRecommended,
      benefitsInput: medicine.benefits ? medicine.benefits.join('\n') : '',
      ingredientsInput: medicine.ingredients ? medicine.ingredients.join('\n') : '',
      dosage: medicine.dosage || '',
      safetyInfoInput: medicine.safetyInfo ? medicine.safetyInfo.join('\n') : '',
      storage: medicine.storage || 'Store in a cool, dry place away from direct sunlight.'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse list inputs (one item per line)
    const benefits = formData.benefitsInput.split('\n').map(item => item.trim()).filter(Boolean);
    const ingredients = formData.ingredientsInput.split('\n').map(item => item.trim()).filter(Boolean);
    const safetyInfo = formData.safetyInfoInput.split('\n').map(item => item.trim()).filter(Boolean);

    const productPayload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      form: formData.form,
      quantity: formData.quantity,
      mainUsage: formData.mainUsage,
      description: formData.description,
      mrp: Number(formData.mrp),
      price: Number(formData.price),
      image: formData.image,
      potency: formData.potency,
      stockStatus: formData.stockStatus,
      isBestSeller: formData.isBestSeller,
      isDoctorRecommended: formData.isDoctorRecommended,
      benefits,
      ingredients,
      dosage: formData.dosage,
      safetyInfo,
      storage: formData.storage
    };

    if (editingProduct) {
      updateMedicine({
        ...productPayload,
        id: editingProduct.id,
        rating: editingProduct.rating || 5.0,
        reviews: editingProduct.reviews || 0
      });
    } else {
      addMedicine(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to remove this product? This action cannot be undone.')) {
      deleteMedicine(id);
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter medicines
  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          med.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
                          med.mainUsage.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || med.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  interface CustomerProfile {
    name: string;
    phone: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    orderIds: string[];
  }

  // Aggregate orders by phone number to create customer profiles
  const aggregatedCustomers: CustomerProfile[] = [];
  orders.forEach(order => {
    const existing = aggregatedCustomers.find(c => c.phone.trim() === order.phone.trim());
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += order.totalAmount;
      if (!existing.orderIds.includes(order.id)) {
        existing.orderIds.push(order.id);
      }
    } else {
      aggregatedCustomers.push({
        name: order.customerName,
        phone: order.phone,
        address: order.address,
        totalOrders: 1,
        totalSpent: order.totalAmount,
        orderIds: [order.id]
      });
    }
  });

  // Filter customers by search term
  const filteredCustomers = aggregatedCustomers.filter(c => {
    return c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
           c.phone.includes(customerSearch) ||
           c.address.toLowerCase().includes(customerSearch.toLowerCase());
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 pt-24 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glowing accent backgrounds */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            {/* Lock Circle Icon */}
            <div className="w-16 h-16 bg-slate-700/50 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-600/50 shadow-inner">
              <Lock className="w-7 h-7 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Meducil Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-[260px] mx-auto leading-relaxed">
              Founder access key required. Enter password to view checkouts and inventory.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Administrator Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-slate-600 font-sans"
              />
            </div>

            {loginError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-start gap-2"
              >
                <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl h-11 bg-primary-600 hover:bg-primary-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/10 transition-transform text-sm font-sans"
            >
              Access Dashboard <Unlock className="w-4 h-4" />
            </Button>
          </form>

          {/* Secure indicator footer */}
          <div className="mt-8 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 z-10 relative">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Fulfillment Desk Potency Protected Security Protocol</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Admin Portal</h2>
        </div>
        <nav className="px-4 pb-6 space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Package className="w-5 h-5 mr-3" /> Manage Orders
          </button>
          <button 
            onClick={() => setActiveTab('medicines')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'medicines' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Pill className="w-5 h-5 mr-3" /> Manage Medicines
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> System Status
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'customers' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5 mr-3" /> Customers
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="w-5 h-5 mr-3" /> Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/10 mt-6 font-sans font-bold"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-400" /> Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 capitalize">
                {activeTab === 'medicines' ? 'Manage Medicines' : activeTab === 'orders' ? 'Manage Orders' : activeTab === 'customers' ? 'Customers' : activeTab}
              </h1>
              {(activeTab === 'medicines' || activeTab === 'orders') && (
                <button
                  onClick={() => setIsSetupGuideOpen(true)}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border transition-all ${
                    (activeTab === 'medicines' ? connectionStatus : ordersConnectionStatus) === 'connected' 
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 cursor-pointer shadow-sm shadow-green-500/5' 
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 cursor-pointer animate-pulse'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${(activeTab === 'medicines' ? connectionStatus : ordersConnectionStatus) === 'connected' ? 'bg-green-500' : 'bg-amber-500 animate-ping'}`}></span>
                  {(activeTab === 'medicines' ? connectionStatus : ordersConnectionStatus) === 'connected' ? 'Supabase Connected' : 'Local Mode (Setup Guide)'}
                </button>
              )}
            </div>
            <p className="text-slate-500 mt-1">
              {activeTab === 'medicines' 
                ? 'List new homeopathic formulations and manage active catalogs' 
                : activeTab === 'orders' 
                ? 'Track customer orders, print shipping slips, and assign courier tracking codes' 
                : activeTab === 'customers'
                ? 'View aggregated repeat-buyer profiles, lifetime value, and order frequencies'
                : 'Manage your clinic operations'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 self-end sm:self-auto">
            {activeTab === 'medicines' ? (
              <Button onClick={openAddModal} className="rounded-full bg-primary-600 hover:bg-primary-700 text-white px-5 shadow-md flex items-center gap-2">
                <Plus className="w-4 h-4" /> List Product
              </Button>
            ) : activeTab === 'orders' ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ) : activeTab === 'customers' ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search customers..." 
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
              Dr
            </div>
          </div>
        </div>

        {/* Manage Orders Tab View */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Stats Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Total Orders</h3>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">{orders.length}</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner">
                  <Package className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-amber-600">Pending Shipments</h3>
                  <p className="text-3xl font-extrabold text-amber-600 mt-1">
                    {orders.filter(o => o.status === 'Pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100 shadow-sm">
                  <span className="relative flex h-3 w-3 -mr-6 -mt-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <Truck className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-blue-600">In Transit</h3>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">
                    {orders.filter(o => o.status === 'Shipped').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                  <Truck className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-green-600">Delivered Orders</h3>
                  <p className="text-3xl font-extrabold text-green-600 mt-1">
                    {orders.filter(o => o.status === 'Delivered').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-100 shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filter and Table Panel */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm font-semibold text-slate-500 shrink-0">Filter Status:</span>
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => {
                    const isSelected = orderStatusFilter === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-slate-900 text-white shadow-sm' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900">
                  Customer Orders ({
                    orders.filter(o => {
                      const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                                            o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                                            o.phone.includes(orderSearch);
                      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
                      return matchesSearch && matchesStatus;
                    }).length
                  })
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fulfillment Desk</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30 text-slate-500 text-sm border-b border-slate-100">
                      <th className="px-6 py-4 font-semibold">Order ID</th>
                      <th className="px-6 py-4 font-semibold">Date & Time</th>
                      <th className="px-6 py-4 font-semibold">Recipient Info</th>
                      <th className="px-6 py-4 font-semibold">Items Count</th>
                      <th className="px-6 py-4 font-semibold">Total Amount</th>
                      <th className="px-6 py-4 font-semibold">Fulfillment Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          Loading orders...
                        </td>
                      </tr>
                    ) : orders.filter(o => {
                      const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                                            o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                                            o.phone.includes(orderSearch);
                      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
                      return matchesSearch && matchesStatus;
                    }).length > 0 ? (
                      orders
                        .filter(o => {
                          const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                                                o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                                                o.phone.includes(orderSearch);
                          const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((order) => {
                          return (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-900">
                                #{order.id.slice(-6).toUpperCase()}
                              </td>
                              <td className="px-6 py-4 text-slate-500">
                                {new Date(order.createdAt).toLocaleDateString(undefined, { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900">{order.customerName}</div>
                                <div className="text-xs text-slate-400">{order.phone}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-700 font-medium">
                                {order.items.reduce((acc, it) => acc + it.cartQuantity, 0)} items
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-950">
                                ₹{order.totalAmount}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${
                                  order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                  order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                  'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    order.status === 'Pending' ? 'bg-amber-500' :
                                    order.status === 'Shipped' ? 'bg-blue-500' :
                                    order.status === 'Delivered' ? 'bg-green-500' :
                                    'bg-red-500'
                                  }`}></span>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setTrackingNumberInput(order.trackingNumber || '');
                                    }}
                                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-slate-900/10 flex items-center gap-1.5"
                                  >
                                    Manage <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this order?')) {
                                        deleteOrder(order.id);
                                      }
                                    }}
                                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                          <p className="font-bold text-slate-700">No orders found</p>
                          <p className="text-xs text-slate-400 mt-1">There are no checkouts matching your filter at this time.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System Status Analytics Tab View */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-sans">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-slate-500 font-medium mb-2">Total Orders</h3>
              <p className="text-3xl font-extrabold text-slate-900">{orders.length}</p>
              <p className="text-sm text-slate-400 mt-2">Active customer checkouts</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-slate-500 font-medium mb-2">Active Formulations</h3>
              <p className="text-3xl font-extrabold text-slate-900">{medicines.length}</p>
              <p className="text-sm text-green-500 mt-2">Homeopathic catalog items</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-slate-500 font-medium mb-2">Total Revenue</h3>
              <p className="text-3xl font-extrabold text-slate-900">
                ₹{orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 mt-2">Fulfillment sales volume</p>
            </div>
          </div>
        )}

        {/* Medicines Dynamic Dashboard View */}
        {activeTab === 'medicines' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search products by name, brand, usage..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-11 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm font-semibold text-slate-500 shrink-0">Category:</span>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-full md:w-56"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medicines List Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Active Products ({filteredMedicines.length})</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Homoeopathic Catalog</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30 text-slate-500 text-sm border-b border-slate-100">
                      <th className="px-6 py-4 font-semibold">Image</th>
                      <th className="px-6 py-4 font-semibold">Product Name & Brand</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Form & Qty</th>
                      <th className="px-6 py-4 font-semibold">Price (INR)</th>
                      <th className="px-6 py-4 font-semibold">Status & Badges</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredMedicines.length > 0 ? (
                      filteredMedicines.map((medicine) => {
                        const discount = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);
                        return (
                          <tr key={medicine.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 shrink-0">
                              <div className="relative w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-1">
                                <Image 
                                  src={medicine.image} 
                                  alt={medicine.name}
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900 line-clamp-1">{medicine.name}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {medicine.brand}
                                </span>
                                {medicine.potency && <span className="text-slate-500 font-medium">({medicine.potency})</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {medicine.category}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-slate-700 font-medium">{medicine.form}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{medicine.quantity}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">₹{medicine.price}</div>
                              {medicine.mrp > medicine.price && (
                                <div className="text-xs text-slate-400 line-through">₹{medicine.mrp}</div>
                              )}
                              {discount > 0 && (
                                <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 rounded px-1 mt-1 inline-block">
                                  {discount}% OFF
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 space-y-1.5">
                              {/* Stock status */}
                              <div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  medicine.stockStatus === 'In Stock' ? 'bg-green-50 text-green-700 border border-green-100' :
                                  medicine.stockStatus === 'Few Left' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                  'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                  {medicine.stockStatus}
                                </span>
                              </div>
                              {/* Badges */}
                              <div className="flex flex-wrap gap-1">
                                {medicine.isBestSeller && (
                                  <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    Best Seller
                                  </span>
                                )}
                                {medicine.isDoctorRecommended && (
                                  <span className="bg-primary-50 text-primary-700 border border-primary-100 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    Recommended
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end items-center gap-2">
                                <Link href={`/medicines/${medicine.id}`} target="_blank" className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors" title="View live page">
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button 
                                  onClick={() => openEditModal(medicine)} 
                                  className="p-2 hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-lg transition-colors" 
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(medicine.id)} 
                                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" 
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          <div className="max-w-md mx-auto">
                            <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <p className="font-bold text-slate-700">No products found</p>
                            <p className="text-xs text-slate-400 mt-1">We couldn't find any products matching your search criteria. Try modifying filters or search query.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Customers Aggregated Ledger View */}
        {activeTab === 'customers' && (
          <div className="space-y-6 font-sans">
            {/* Premium sub-navigation toggle */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-md select-none">
              <button
                onClick={() => setActiveCustomerSubTab('profiles')}
                className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeCustomerSubTab === 'profiles' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/55'
                }`}
              >
                Guest Aggregations
              </button>
              <button
                onClick={() => setActiveCustomerSubTab('signups')}
                className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeCustomerSubTab === 'signups' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/55'
                }`}
              >
                Registered Users ({registeredUsers.length})
              </button>
              <button
                onClick={() => setActiveCustomerSubTab('activity')}
                className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeCustomerSubTab === 'activity' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/55'
                }`}
              >
                Cart Additions ({cartEvents.length})
              </button>
            </div>

            {/* Sub-tab: 1. Guest Aggregations */}
            {activeCustomerSubTab === 'profiles' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">
                    Aggregated Customer Profiles ({filteredCustomers.length})
                  </h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Database</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/30 text-slate-500 text-sm border-b border-slate-100">
                        <th className="px-6 py-4 font-semibold">Customer Details</th>
                        <th className="px-6 py-4 font-semibold">Contact Number</th>
                        <th className="px-6 py-4 font-semibold">Last Delivery Destination</th>
                        <th className="px-6 py-4 font-semibold">Total Orders Placed</th>
                        <th className="px-6 py-4 font-semibold">Lifetime Sales (CLV)</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((c) => {
                          return (
                            <tr key={c.phone} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                  <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none">
                                    {c.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  {c.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-600 font-mono">
                                {c.phone}
                              </td>
                              <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={c.address}>
                                {c.address}
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold rounded-full">
                                  {c.totalOrders} {c.totalOrders === 1 ? 'Order' : 'Orders'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-950">
                                ₹{c.totalSpent}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => {
                                    setOrderSearch(c.phone);
                                    setOrderStatusFilter('All');
                                    setActiveTab('orders');
                                  }}
                                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                                >
                                  View Orders <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <p className="font-bold text-slate-700">No customers found</p>
                            <p className="text-xs text-slate-400 mt-1">There are no repeat profiles matching your search query at this time.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab: 2. Registered Users */}
            {activeCustomerSubTab === 'signups' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">
                    Registered Accounts ({registeredUsers.length})
                  </h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Directory</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/30 text-slate-500 text-sm border-b border-slate-100">
                        <th className="px-6 py-4 font-semibold">User Details</th>
                        <th className="px-6 py-4 font-semibold">Email Address</th>
                        <th className="px-6 py-4 font-semibold">Contact Phone</th>
                        <th className="px-6 py-4 font-semibold">Registration Date</th>
                        <th className="px-6 py-4 font-semibold text-right">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {registeredUsers.length > 0 ? (
                        registeredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-50 border border-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none">
                                  {u.name.slice(0, 2).toUpperCase()}
                                </div>
                                {u.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-mono">
                              {u.email}
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-mono">
                              {u.phone}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {new Date(u.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="px-2.5 py-0.5 bg-green-50 border border-green-100 text-green-700 text-xs font-bold rounded-full">
                                Active Profile
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <p className="font-bold text-slate-700">No registered users</p>
                            <p className="text-xs text-slate-400 mt-1">No store visitors have registered user accounts at this time.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab: 3. Cart Activity Stream */}
            {activeCustomerSubTab === 'activity' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary-500" /> Live Storefront Activity Feed
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time trace of customer cart interactions, additions, and updates.</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">Audits Stream</span>
                </div>

                {cartEvents.length > 0 ? (
                  <div className="relative pl-6 border-l border-slate-200/80 space-y-6">
                    {cartEvents.map((e) => {
                      const isAdd = e.action === 'Add to Cart' || e.action === 'Increase Quantity';
                      const isClear = e.action === 'Clear Cart';
                      
                      return (
                        <div key={e.id} className="relative group">
                          {/* Chronological Dot Indicator */}
                          <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                            isAdd ? 'bg-green-500' : isClear ? 'bg-amber-500' : 'bg-red-500'
                          }`}>
                            {isAdd ? (
                              <PlusCircle className="w-2.5 h-2.5 text-white" />
                            ) : isClear ? (
                              <MinusCircle className="w-2.5 h-2.5 text-white" />
                            ) : (
                              <MinusCircle className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>

                          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex flex-wrap justify-between items-start gap-2">
                              <div>
                                <span className="font-bold text-slate-900 hover:text-primary-600 transition-colors cursor-pointer text-xs">
                                  {e.userIdentifier}
                                </span>
                                <span className={`text-[10px] font-bold ml-2 px-2 py-0.5 rounded-full ${
                                  isAdd ? 'bg-green-50 text-green-700 border border-green-100' :
                                  isClear ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                  'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                  {e.action}
                                </span>
                                
                                <p className="text-xs text-slate-600 mt-2 font-medium">
                                  {e.itemName !== 'Multiple Items' ? (
                                    <>
                                      Interacted with <span className="text-slate-900 font-bold">{e.itemName}</span> ({e.itemBrand}) • <span className="text-slate-500">Qty: {e.quantity}</span>
                                    </>
                                  ) : (
                                    <>
                                      Cleared entire shopping cart. Removed {e.quantity} items.
                                    </>
                                  )}
                                </p>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono font-bold">
                                {new Date(e.createdAt).toLocaleTimeString(undefined, {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500">
                    <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="font-bold text-slate-700">No active interactions</p>
                    <p className="text-xs text-slate-400 mt-1">Activity feed is empty. Cart interactions appear automatically in real-time.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* Settings Tab View */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 space-y-6 font-sans">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-600" /> Administrator Security Settings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize your founder login keys. Changed credentials persist locally on this browser.
              </p>
            </div>

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">Current Password</label>
                <input
                  type="password"
                  required
                  value={settingsCurrentPassword}
                  onChange={(e) => setSettingsCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">New Password (Min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={settingsNewPassword}
                    onChange={(e) => setSettingsNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={settingsConfirmPassword}
                    onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                    placeholder="Confirm new password..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {settingsPasswordError && (
                <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-xs font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{settingsPasswordError}</span>
                </div>
              )}

              {settingsPasswordSuccess && (
                <div className="p-3.5 bg-green-50 text-green-700 border border-green-100 rounded-2xl text-xs font-bold flex items-start gap-2">
                  <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-green-600" />
                  <span>{settingsPasswordSuccess}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 shadow-md shadow-slate-900/10 text-xs flex items-center gap-1.5 transition-transform"
                >
                  <Lock className="w-3.5 h-3.5" /> Change Password
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Setup Guide Modal */}
      <AnimatePresence>
        {isSetupGuideOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSetupGuideOpen(false)}
              className="absolute inset-0 bg-slate-900"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative z-10 overflow-y-auto max-h-[90vh] border border-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Supabase Connection Guide</h2>
                    <p className="text-xs text-slate-500">How to sync your product catalog to the live cloud database</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSetupGuideOpen(false)}
                  className="w-8 h-8 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6 text-sm text-slate-600">
                {/* Connection status display */}
                <div className={`p-4 rounded-2xl border ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-50 border-green-100 text-green-800' 
                    : 'bg-amber-50 border-amber-100 text-amber-800'
                }`}>
                  <h4 className="font-bold flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-amber-500 animate-ping'}`}></span>
                    Current Status: {connectionStatus === 'connected' ? 'Supabase Connected' : 'Local Sandbox Mode'}
                  </h4>
                  <p className="text-xs">
                    {connectionStatus === 'connected' 
                      ? 'Your products are fully syncing in real-time to your cloud PostgreSQL database.' 
                      : 'You are currently in local sandbox mode. Products are saved only in your browser. Follow these steps to connect your Supabase database.'}
                  </p>
                </div>

                {/* Step 1 */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2"><span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs shrink-0">1</span> Run SQL Schema in Supabase</h4>
                  <p className="text-xs text-slate-500">Go to your **Supabase Project Dashboard &rarr; SQL Editor &rarr; New Query**, paste the code below, and click **Run** to create the `medicines` table and set security policies:</p>
                  
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs overflow-x-auto font-mono max-h-48 border border-slate-800 custom-scrollbar leading-relaxed">
                      {SQL_SCHEMA}
                    </pre>
                    <button 
                      onClick={copySql}
                      className="absolute right-3 top-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                      title="Copy SQL Schema"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2"><span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs shrink-0">2</span> Add Environment Variables</h4>
                  <p className="text-xs text-slate-500">Create a file named `.env.local` in your project root directory (next to `package.json`) and insert your Supabase API credentials:</p>
                  
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono border border-slate-800 leading-relaxed">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co<br/>
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_api_key
                  </pre>
                  
                  <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <Terminal className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <span>**Important:** After adding `.env.local`, you must **restart your local server** (`Ctrl+C` and then run `npm run dev`) for the variables to load.</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-4 flex justify-end">
                <Button onClick={() => setIsSetupGuideOpen(false)} className="rounded-xl px-6 bg-slate-900 text-white hover:bg-slate-800">
                  Got It
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Overlay Form Modal (Drawer-style) for Adding / Editing Medicines */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900"
            />

            {/* Modal Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingProduct ? 'Edit Product Details' : 'List New Homeopathic Product'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingProduct ? `Modify catalog properties for ${editingProduct.name}` : 'Fill in the details to list a medicine without coding'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-10 h-10 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Scrollable Area */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Section: Essential details */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">1. Core Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Product Name *</label>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Allium Cepa Dilution"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Manufacturer / Brand *</label>
                      <select 
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Category (Health Concern) *</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Form / Formulation *</label>
                      <select 
                        value={formData.form}
                        onChange={(e) => setFormData({...formData, form: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Quantity (e.g. 30ml, 25g) *</label>
                      <input 
                        type="text"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        placeholder="e.g. 30ml"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Potency (optional, e.g. 30 CH, 6X)</label>
                      <input 
                        type="text"
                        value={formData.potency}
                        onChange={(e) => setFormData({...formData, potency: e.target.value})}
                        placeholder="e.g. 30 CH"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Main Usage Summary *</label>
                    <input 
                      type="text"
                      required
                      value={formData.mainUsage}
                      onChange={(e) => setFormData({...formData, mainUsage: e.target.value})}
                      placeholder="e.g. Relief from dry cough and sneezing"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Description *</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter detailed description of the homeopathic medicine, its uses and historical context..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-sans"
                    />
                  </div>
                </div>

                {/* Pricing and Stock details */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">2. Pricing, Inventory & Status</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">MRP (INR) *</label>
                      <input 
                        type="number"
                        required
                        min={1}
                        value={formData.mrp}
                        onChange={(e) => setFormData({...formData, mrp: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Discounted Price (INR) *</label>
                      <input 
                        type="number"
                        required
                        min={1}
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Stock Availability *</label>
                      <select 
                        value={formData.stockStatus}
                        onChange={(e) => setFormData({...formData, stockStatus: e.target.value as any})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Few Left">Few Left</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* Toggle markers */}
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700">
                      <input 
                        type="checkbox"
                        checked={formData.isBestSeller}
                        onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      Add "Best Seller" Badge
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700">
                      <input 
                        type="checkbox"
                        checked={formData.isDoctorRecommended}
                        onChange={(e) => setFormData({...formData, isDoctorRecommended: e.target.checked})}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      Add "Doctor Recommended" Badge
                    </label>
                  </div>
                </div>

                {/* Preset image select */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">3. Product Image</h3>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Select Image Formulation Preset</label>
                    <div className="grid grid-cols-3 gap-3">
                      {PRESET_IMAGES.map((img) => {
                        const isSelected = formData.image === img.url;
                        return (
                          <div 
                            key={img.label}
                            onClick={() => setFormData({...formData, image: img.url})}
                            className={`p-3 rounded-xl border bg-white flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-all ${
                              isSelected ? 'border-primary-600 ring-2 ring-primary-500/20' : 'border-slate-200'
                            }`}
                          >
                            <div className="relative w-12 h-12 mb-1.5 flex items-center justify-center p-1 bg-slate-50 rounded-lg border border-slate-100">
                              <Image 
                                src={img.url} 
                                alt={img.label}
                                width={36}
                                height={36}
                                className="object-contain"
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 text-center">{img.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Or Paste Custom Image URL</label>
                    <input 
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://images.unsplash.com/photo-xxx"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Additional / Usage fields */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900">4. Detailed Usage & Clinical Data</h3>
                    <span className="text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100 px-1.5 py-0.5 rounded uppercase">Code-Free Lists</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Key Benefits (one benefit per line)</label>
                      <textarea 
                        rows={3}
                        value={formData.benefitsInput}
                        onChange={(e) => setFormData({...formData, benefitsInput: e.target.value})}
                        placeholder="e.g.&#10;Gentle relief from allergy sneezing&#10;Nourishes mucus lining&#10;Safe for all age groups"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Active Ingredients (one ingredient per line)</label>
                      <textarea 
                        rows={2}
                        value={formData.ingredientsInput}
                        onChange={(e) => setFormData({...formData, ingredientsInput: e.target.value})}
                        placeholder="e.g.&#10;Allium Cepa 30 CH&#10;Alcohol Content: 90% v/v"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 block">Dosage Recommendations</label>
                        <input 
                          type="text"
                          value={formData.dosage}
                          onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                          placeholder="e.g. 5 drops in a tablespoon of water 3 times a day."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 block">Storage Directions</label>
                        <input 
                          type="text"
                          value={formData.storage}
                          onChange={(e) => setFormData({...formData, storage: e.target.value})}
                          placeholder="e.g. Store in a cool dry place."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Safety Information (one guideline per line)</label>
                      <textarea 
                        rows={3}
                        value={formData.safetyInfoInput}
                        onChange={(e) => setFormData({...formData, safetyInfoInput: e.target.value})}
                        placeholder="e.g.&#10;Keep out of reach of children&#10;Read the label carefully before use&#10;Avoid any strong smell in mouth during medication"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-sans"
                      />
                    </div>
                  </div>
                </div>

              </form>

              {/* Action buttons footer */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-5 border-slate-200 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleFormSubmit}
                  className="rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-6 shadow-md shadow-primary-500/10"
                >
                  {editingProduct ? 'Save Changes' : 'List Product'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Manager Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans">Manage Order #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-sans">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {/* 1. Recipient shipping address slip block */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-sans">
                      <MapPin className="w-3.5 h-3.5" /> Shipping Address Slip
                    </h4>
                    <button
                      onClick={() => handleCopyAddressSlip(selectedOrder)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all text-slate-700 font-sans"
                    >
                      {addressCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" /> Copied Slip!
                        </>
                      ) : (
                        <>
                          <ClipboardList className="w-3.5 h-3.5" /> Copy Address Slip
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-xs font-mono bg-white p-3.5 rounded-xl border border-slate-100 leading-relaxed text-slate-700 select-all">
                    <strong>TO:</strong> {selectedOrder.customerName}<br/>
                    <strong>PHONE:</strong> {selectedOrder.phone}<br/>
                    <strong>ADDRESS:</strong> {selectedOrder.address}<br/>
                    <strong>PAYMENT:</strong> {selectedOrder.paymentMethod}<br/>
                    <strong>GRAND TOTAL:</strong> ₹{selectedOrder.totalAmount}
                  </div>
                </div>

                {/* 2. Order status controls */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-sans">
                    <Truck className="w-3.5 h-3.5" /> Fulfillment & Tracking
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { status: 'Pending' as const, label: '🟡 Pending', desc: 'Awaiting dispatch' },
                      { status: 'Shipped' as const, label: '🔵 Shipped', desc: 'In transit' },
                      { status: 'Delivered' as const, label: '🟢 Delivered', desc: 'Arrived at door' },
                      { status: 'Cancelled' as const, label: '🔴 Cancelled', desc: 'Order voided' }
                    ].map((st) => {
                      const isActive = selectedOrder.status === st.status;
                      return (
                        <button
                          key={st.status}
                          type="button"
                          onClick={() => handleStatusChange(selectedOrder.id, st.status, selectedOrder.trackingNumber)}
                          className={`p-3 rounded-xl border text-left transition-all font-sans ${
                            isActive 
                              ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                              : 'bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="font-bold text-xs">{st.label}</div>
                          <div className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>{st.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await handleStatusChange(selectedOrder.id, selectedOrder.status, trackingNumberInput || null);
                      alert('Tracking details saved!');
                    }}
                    className="space-y-2 pt-2"
                  >
                    <label className="text-xs font-bold text-slate-600 block font-sans">Courier Tracking Number</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. BD-82910-DEL"
                        value={trackingNumberInput}
                        onChange={(e) => setTrackingNumberInput(e.target.value)}
                        className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-sans"
                      />
                      <Button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-4 text-xs shrink-0 font-sans"
                      >
                        Save Tracking
                      </Button>
                    </div>
                  </form>
                </div>

                {/* 3. Items purchased list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Items Ordered ({selectedOrder.items.length})</h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4">
                        <div className="flex gap-3 min-w-0">
                          <div className="relative w-10 h-10 bg-white rounded-lg border border-slate-100 p-1 flex items-center justify-center shrink-0">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 line-clamp-1 font-sans">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-sans">{item.brand} • {item.form} • Qty: {item.cartQuantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-950 text-xs shrink-0 pl-4 font-sans">₹{item.price * item.cartQuantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Payment method and Grand total */}
                <div className="border-t border-slate-100 pt-4 flex flex-col items-end space-y-1.5 text-xs text-slate-500 font-sans">
                  <div className="flex justify-between w-full max-w-[240px]">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-[240px] text-sm font-bold text-slate-950 border-t border-slate-100 pt-2">
                    <span>Grand Total:</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-end bg-slate-50">
                <Button 
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl px-6 bg-slate-900 text-white hover:bg-slate-800 font-sans"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
