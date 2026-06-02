'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="bg-primary-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-semibold">How can we help?</h3>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 text-sm text-slate-600">
              <p>Welcome to Meducil! Do you have any questions about our homoeopathic remedies, wellness products, or order status?</p>
              <p>For assistance, please email us at <a href="mailto:sonalika.ctc29@gmail.com" className="text-primary-600 font-semibold hover:underline">sonalika.ctc29@gmail.com</a>.</p>
              <div className="pt-2 border-t border-slate-100">
                <a
                  href="https://wa.me/917846969508"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.449 4.793 1.451 5.485.002 9.948-4.41 9.952-9.873.001-2.647-1.026-5.136-2.892-7.005C16.536 1.858 14.053.83 11.411.83c-5.492 0-9.957 4.411-9.962 9.874-.002 1.848.483 3.655 1.405 5.265l-.982 3.585 3.738-.968zm11.387-4.915c-.273-.137-1.62-.8-1.872-.892-.252-.092-.437-.137-.62.137-.183.274-.708.892-.868 1.077-.16.185-.32.206-.593.069-.273-.137-1.155-.426-2.202-1.36-1.15-.99-1.92-2.213-2.146-2.6-.226-.386-.024-.595.113-.732.123-.122.273-.32.41-.48.137-.16.183-.274.273-.457.092-.183.046-.343-.023-.48-.069-.137-.62-1.492-.85-2.04-.224-.54-.471-.466-.62-.474-.15-.007-.323-.008-.497-.008-.174 0-.458.065-.697.32-.239.256-.913.892-.913 2.176 0 1.284.933 2.525 1.063 2.7.13.175 1.837 2.805 4.45 3.93.622.268 1.108.428 1.488.548.624.199 1.192.171 1.64.104.499-.074 1.62-.663 1.848-1.302.228-.64.228-1.189.16-1.302-.069-.113-.252-.18-.524-.317z" />
                  </svg>
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-600 hover:bg-primary-700 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
