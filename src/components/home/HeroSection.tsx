'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { PhoneCall, Calendar } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-primary-50/50 -z-10" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary-50 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center rounded-full border border-primary-200 bg-white px-3 py-1 text-sm font-medium text-primary-800 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-secondary-500 mr-2"></span>
              Accepting New Patients
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Trusted Care For <br className="hidden lg:block" />
              <span className="text-primary-600">Better Health</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Natural Healing • Trusted Care • No Side Effects. Experience the power of holistic homoeopathy tailored to your unique health needs.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/book">
                <Button size="xl" className="w-full sm:w-auto shadow-xl shadow-primary-500/20">
                  <PhoneCall className="mr-2 h-5 w-5" />
                  Talk To Doctor
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="xl" className="w-full sm:w-auto bg-white">
                  Explore Services
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary-500" />
                <span>Instant Booking</span>
              </div>
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-400">
                      U{i}
                    </div>
                  ))}
                </div>
                <span>500+ Happy Patients</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
          >
            <div className="aspect-[4/3] rounded-3xl bg-slate-100 overflow-hidden shadow-2xl border border-white relative">
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-secondary-500 opacity-10"></div>
              <div className="flex items-center justify-center h-full w-full text-slate-400">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-primary-600 font-bold text-xl">Meducil</span>
                  </div>
                  <p>Premium Healthcare Visual Placeholder</p>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
            >
              <div className="bg-accent-100 text-accent-600 p-3 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
              <div>
                <p className="font-bold text-slate-900">4.9/5 Rating</p>
                <p className="text-xs text-slate-500">From verified patients</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
