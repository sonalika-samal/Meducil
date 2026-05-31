'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { categoriesData } from '@/lib/data/medicines';
import { useMedicines } from '@/lib/data/medicineStore';
import { ProductCard } from '@/components/medicines/ProductCard';
import { ShieldPlus, Thermometer, Leaf, Activity, Zap, Pill, Heart, Droplets, Sparkles, Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, any> = {
  "cold-cough-allergy": ShieldPlus,
  "wellness-ocd-anxiety": Leaf,
  "beauty-skin-hair-care": Sparkles,
  "fever-acute-care": Thermometer,
  "digestive-liver-care": Activity,
  "joint-pain-rheumatism": Zap,
  "diabetes-care": Droplets,
  "womens-wellness": Heart,
};

export default function MedicinesClient() {
  const { medicines } = useMedicines();
  const [activeCategory, setActiveCategory] = useState<string>(categoriesData[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = categoriesData.map(c => document.getElementById(c.id));
      let currentActive = categoriesData[0].id;
      
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // If section is near the top of the viewport
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentActive = section.id;
            break;
          }
        }
      }
      setActiveCategory(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sticky Sidebar Navigation */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-28">
          
          <div className="mb-6 relative">
            <input 
              type="text" 
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Categories</h2>
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
            {categoriesData.map(category => {
              const Icon = iconMap[category.id] || Leaf;
              const isActive = activeCategory === category.id;
              
              return (
                <Link
                  key={category.id}
                  href={`#${category.id}`}
                  onClick={(e) => {
                    // Let default anchor click happen for scroll, just update state early
                    setActiveCategory(category.id);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' 
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-slate-400'}`} />
                  {category.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-2 text-green-700 font-bold">
              <ShieldPlus className="w-5 h-5" />
              100% Authentic
            </div>
            <p className="text-xs text-green-600/80">Directly sourced from trusted homeopathic manufacturers.</p>
          </div>
        </div>
      </div>

      {/* Main Content - Category Sections */}
      <div className="flex-grow">
        {categoriesData.map((category, index) => {
          const categoryMedicines = medicines.filter(m => 
            m.category === category.name && 
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (categoryMedicines.length === 0 && searchQuery) return null;

          const Icon = iconMap[category.id] || Leaf;

          return (
            <motion.section 
              key={category.id}
              id={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="mb-16 scroll-mt-28"
            >
              {/* Category Banner / Header */}
              <div className={`rounded-2xl p-6 md:p-8 mb-8 flex items-center justify-between border ${
                index % 2 === 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
              }`}>
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Icon className={`w-5 h-5 ${index % 2 === 0 ? 'text-red-500' : 'text-green-500'}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
                  </div>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed">{category.description}</p>
                </div>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-3xl font-black text-slate-900/10">{categoryMedicines.length}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Products</span>
                </div>
              </div>

              {categoryMedicines.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {categoryMedicines.map((medicine) => (
                    <ProductCard key={medicine.id} medicine={medicine} />
                  ))}
                </div>
              ) : (
                 <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
                    <p className="text-slate-600">We are adding premium products to this category.</p>
                 </div>
              )}
              
              {categoryMedicines.length > 0 && (
                <div className="mt-8 text-center">
                  <button className="text-primary-600 font-semibold text-sm hover:text-primary-700 flex items-center justify-center mx-auto group">
                    Explore More in {category.name} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
