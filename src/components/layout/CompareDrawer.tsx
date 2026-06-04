'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '@/lib/data/compareContext';
import { useCart } from '@/lib/data/cartContext';
import { Button } from '@/components/ui/Button';
import { X, GitCompare, ShoppingCart, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Drawer */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[40] w-[92%] max-w-2xl bg-slate-900/90 backdrop-blur-md text-white border border-slate-800 shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans"
        >
          {/* List of items being compared */}
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600/30 text-primary-400 border border-primary-500/20 rounded-xl shrink-0">
              <GitCompare className="w-5 h-5" />
            </div>
            
            <div className="flex items-center gap-2">
              {compareList.map((med) => (
                <div key={med.id} className="relative flex items-center bg-slate-800/70 border border-slate-700/50 rounded-xl p-1.5 pr-8 shrink-0">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-0.5 relative overflow-hidden">
                    <Image
                      src={med.image}
                      alt={med.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 ml-2 max-w-[80px] truncate">{med.name}</span>
                  <button
                    onClick={() => removeFromCompare(med.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-full transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {compareList.length < 4 && (
                <div className="dashed-border flex items-center justify-center w-8 h-8 border border-dashed border-slate-700 rounded-xl text-slate-500 font-bold text-xs select-none">
                  +
                </div>
              )}
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={clearCompare}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              className="rounded-xl h-10 px-5 bg-primary-600 hover:bg-primary-700 font-bold text-xs text-white"
            >
              Compare Now ({compareList.length}/4)
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-slate-200 shadow-2xl relative z-[10000] font-sans flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100">
                  <GitCompare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Compare Medicines</h3>
                  <p className="text-xs text-slate-500">Compare specs, dosages, and prices side-by-side.</p>
                </div>
              </div>

              {/* Side by side comparison table container */}
              <div className="overflow-x-auto flex-grow custom-scrollbar">
                <table className="w-full min-w-[600px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 px-3 font-extrabold text-slate-400 uppercase tracking-wider w-1/5">Product Info</th>
                      {compareList.map((med) => (
                        <th key={med.id} className="py-4 px-3 w-1/4">
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 p-2 flex items-center justify-center rounded-xl relative overflow-hidden shrink-0">
                              <Image
                                src={med.image}
                                alt={med.name}
                                width={64}
                                height={64}
                                className="object-contain"
                              />
                            </div>
                            <Link href={`/medicines/${med.id}`} onClick={() => setIsModalOpen(false)} className="hover:text-primary-600 hover:underline">
                              <span className="font-extrabold text-slate-800 line-clamp-2 block px-2">{med.name}</span>
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* Brand Row */}
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-500">Brand</td>
                      {compareList.map((med) => (
                        <td key={med.id} className="py-3 px-3 text-slate-700 text-center font-medium">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase">{med.brand}</span>
                        </td>
                      ))}
                    </tr>

                    {/* Price Row */}
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-500">Price</td>
                      {compareList.map((med) => (
                        <td key={med.id} className="py-3 px-3 text-center">
                          <span className="text-sm font-black text-slate-900">₹{med.price}</span>
                          {med.mrp > med.price && (
                            <span className="text-[10px] text-slate-400 line-through block">₹{med.mrp}</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Rating Row */}
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-500">Rating & Reviews</td>
                      {compareList.map((med) => (
                        <td key={med.id} className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-slate-800">{med.rating}</span>
                            <span className="text-slate-400 font-medium">({med.reviews})</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Form Row */}
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-500">Form</td>
                      {compareList.map((med) => (
                        <td key={med.id} className="py-3 px-3 text-slate-700 text-center font-medium">{med.form}</td>
                      ))}
                    </tr>

                    {/* Quantity Row */}
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-500">Quantity</td>
                      {compareList.map((med) => (
                        <td key={med.id} className="py-3 px-3 text-slate-700 text-center font-medium">{med.quantity}</td>
                      ))}
                    </tr>

                    {/* Potency Row */}
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-500">Potency</td>
                      {compareList.map((med) => (
                        <td key={med.id} className="py-3 px-3 text-slate-700 text-center font-medium">{med.potency || 'N/A'}</td>
                      ))}
                    </tr>

                    {/* Main Usage Row */}
                    <tr>
                      <td className="py-4 px-3 font-bold text-slate-500">Main Usage</td>
                      {compareList.map((med) => (
                        <td key={med.id} className="py-4 px-3 text-slate-600 text-center leading-relaxed font-medium">{med.mainUsage}</td>
                      ))}
                    </tr>

                    {/* Action Row */}
                    <tr className="border-t border-slate-100">
                      <td className="py-4 px-3 font-bold text-slate-500">Actions</td>
                      {compareList.map((med) => (
                        <td key={med.id} className="py-4 px-3 text-center">
                          <div className="flex flex-col gap-2 items-center justify-center max-w-[150px] mx-auto">
                            <Button
                              onClick={() => {
                                addToCart(med, 1);
                                setIsModalOpen(false);
                              }}
                              className="w-full justify-center h-8 text-[11px] rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add to Cart
                            </Button>
                            <button
                              onClick={() => removeFromCompare(med.id)}
                              className="text-[11px] text-slate-400 hover:text-red-500 font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 shrink-0">
                <Button
                  onClick={clearCompare}
                  variant="outline"
                  className="rounded-xl h-10 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs px-5"
                >
                  Clear Comparison
                </Button>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5"
                >
                  Close Window
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
