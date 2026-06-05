'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldPlus, Thermometer, Leaf, Activity, Zap, Pill, Heart, Droplets, Sparkles } from 'lucide-react';
import { categoriesData } from '@/lib/data/medicines';

// Mapping icons since they can't be stored in plain JSON/TS data easily without importing
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

export function CategoryGrid() {
  const [activeSystem, setActiveSystem] = useState<'homeopathy' | 'allopathy' | 'ayurvedic'>('homeopathy');

  return (
    <section className="py-16 bg-white relative">
      <div className="absolute inset-0 bg-slate-50/50 skew-y-2 transform -z-10"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-sans">Shop by Health Concern</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 font-sans">
            {activeSystem === 'homeopathy' 
              ? 'Explore our range of premium homeopathic medicines curated for specific health concerns.'
              : activeSystem === 'allopathy'
              ? 'Our selection of modern Allopathic medicines is coming soon. Stay tuned!'
              : 'Authentic Ayurvedic wellness products and traditional herbal remedies are coming soon.'}
          </p>

          {/* Premium Glassmorphic Tab Switcher */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:inline-flex p-1.5 bg-slate-100/85 backdrop-blur rounded-2xl border border-slate-200/50 shadow-inner max-w-full gap-1 sm:gap-0">
            <button 
              onClick={() => setActiveSystem('homeopathy')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border-none w-full sm:w-auto ${
                activeSystem === 'homeopathy' 
                  ? 'bg-white text-slate-900 shadow-md border border-slate-200/10' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-green-500" /> Homeopathy
            </button>
            <button 
              onClick={() => setActiveSystem('allopathy')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border-none w-full sm:w-auto ${
                activeSystem === 'allopathy' 
                  ? 'bg-white text-slate-900 shadow-md border border-slate-200/10' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-amber-500" /> Allopathy
              <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase leading-none">Soon</span>
            </button>
            <button 
              onClick={() => setActiveSystem('ayurvedic')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border-none w-full sm:w-auto ${
                activeSystem === 'ayurvedic' 
                  ? 'bg-white text-slate-900 shadow-md border border-slate-200/10' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Ayurvedic
              <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase leading-none">Soon</span>
            </button>
          </div>
        </div>
        
        {activeSystem === 'homeopathy' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 xl:gap-4">
            {categoriesData.map((category, index) => {
              const Icon = iconMap[category.id] || Leaf;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <Link href={`/medicines#${category.id}`} className="block h-full text-decoration-none">
                    <div className="group flex flex-col items-center p-4 xl:p-5 rounded-2xl border border-slate-100 hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white h-full justify-center">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 ${category.color || 'bg-slate-100 text-slate-600'} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                        <Icon className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-xs xl:text-sm font-bold text-slate-700 text-center group-hover:text-primary-600 transition-colors leading-tight min-h-[2.5rem] flex items-center justify-center">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : activeSystem === 'allopathy' ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-50/50 to-orange-50/20 rounded-3xl p-8 md:p-12 text-center border border-amber-100 max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-16 h-16 bg-amber-150 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-200/50">
              <Pill className="w-8 h-8 animate-bounce text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 font-sans">Allopathy (Modern Medicine)</h3>
            <p className="text-slate-600 leading-relaxed max-w-md mx-auto mb-6 font-sans text-sm">
              We will launch soon! We are establishing partnerships with verified pharmaceutical suppliers to offer you a catalog of safe, reliable, and authentic allopathic medicines.
            </p>
            <div className="inline-block bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
              Coming Soon
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-50/50 to-green-50/20 rounded-3xl p-8 md:p-12 text-center border border-emerald-100 max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-16 h-16 bg-emerald-150 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-200/50">
              <Leaf className="w-8 h-8 animate-pulse text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 font-sans">Ayurvedic Remedies</h3>
            <p className="text-slate-600 leading-relaxed max-w-md mx-auto mb-6 font-sans text-sm">
              Authentic traditional healing is coming soon! We will launch shortly with pure herbal capsules, classical Ayurvedic syrups, and general wellbeing tonics.
            </p>
            <div className="inline-block bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
              Coming Soon
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
