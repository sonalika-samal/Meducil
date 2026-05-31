'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Tag } from 'lucide-react';

export function SpecialOffers() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Main Offer */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-gradient-to-br from-blue-800 to-blue-950 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-6">
                <Tag className="w-4 h-4" />
                <span>Special Bundle</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Immunity Booster Kit</h2>
              <p className="text-blue-100/90 mb-8 text-lg">
                Get all essential natural remedies to boost your family's immune system in one complete package.
              </p>
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-4xl font-bold text-amber-400">₹899</span>
                <span className="text-xl line-through text-blue-300/80">₹1299</span>
              </div>
              <Link href="/medicines">
                <Button variant="primary" className="bg-white hover:bg-slate-50 text-blue-950 border-none font-bold rounded-full px-8 shadow-lg shadow-white/10">
                  Shop Bundle Now
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Secondary Offers */}
          <div className="flex-1 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl p-8 text-slate-900 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2 text-slate-900">First Order Discount</h3>
                <p className="text-slate-800 mb-6 font-medium">Use code <span className="font-bold text-slate-900 bg-white/40 px-2 py-1 rounded">WELCOME20</span> at checkout</p>
                <Link href="/medicines">
                  <Button variant="primary" className="bg-white hover:bg-slate-50 text-slate-900 border-none rounded-full font-bold shadow-sm">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex-1 bg-gradient-to-br from-secondary-500 to-secondary-700 text-white rounded-3xl p-8 relative overflow-hidden group border-none shadow-sm"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Free Consultation?</h3>
                  <p className="text-secondary-100 text-sm max-w-xs">Buy products worth ₹2000 and get a free follow-up consultation with our experts.</p>
                </div>
                <div className="hidden sm:block">
                  <div className="w-16 h-16 bg-white text-secondary-600 rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                    Free
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
