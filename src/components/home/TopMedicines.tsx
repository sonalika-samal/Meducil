'use client';

import { motion } from 'framer-motion';
import { useMedicines } from '@/lib/data/medicineStore';
import { ProductCard } from '../medicines/ProductCard';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function TopMedicines() {
  const { medicines } = useMedicines();
  // Select best sellers or highest rated for the home page
  const topMedicines = medicines.filter(m => m.isBestSeller).slice(0, 4);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-red-100"
            >
              Top Rated
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Our Best-Selling Medicines
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600"
            >
              Discover our most popular homeopathic remedies, trusted by thousands of patients for effective, natural healing.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="hidden md:block"
          >
             <Link href="/medicines">
              <Button variant="outline" className="rounded-full px-6 group">
                View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topMedicines.map((medicine, index) => (
            <motion.div
              key={medicine.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard medicine={medicine} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/medicines">
            <Button variant="outline" className="rounded-full px-8 w-full">
              View All Medicines
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
