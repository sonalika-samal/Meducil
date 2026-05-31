'use client';

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
  return (
    <section className="py-16 bg-white relative">
      <div className="absolute inset-0 bg-slate-50/50 skew-y-2 transform -z-10"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Shop by Health Concern</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Explore our range of premium homeopathic medicines curated for specific health needs.</p>
        </div>
        
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
                <Link href={`/medicines#${category.id}`} className="block h-full">
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
      </div>
    </section>
  );
}
