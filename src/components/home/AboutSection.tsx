'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Heart, Sparkles, ThumbsUp } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-6 border border-primary-100">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-bold tracking-widest uppercase">About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6 tracking-tight">
              A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Trusted Healthcare</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 text-lg space-y-6 max-w-3xl mx-auto text-center mb-16"
          >
            <p className="leading-relaxed">
              With over <strong className="text-slate-900 font-semibold">24 years of trusted experience</strong> in the field of homoeopathy, Aashutosh Homeo Clinic has established a strong reputation for compassionate care, ethical medical practices, and effective holistic treatment.
            </p>
            <p className="leading-relaxed">
              Led by <strong className="text-slate-900 font-semibold">Dr. Ganesh Kumar Das</strong>, the clinic has consistently focused on patient well-being and long-term wellness through personalized homoeopathic healthcare. Our dedication to maintaining high-quality healthcare standards is reflected in our <span className="font-semibold text-primary-600">ISO 9001:2008</span> and <span className="font-semibold text-primary-600">ISO 9001:2015</span> certifications, recognizing excellence in quality management and organized medical services.
            </p>
          </motion.div>

          {/* Core Highlights - 5 Horizontal Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-12 border-t border-slate-200"
          >
            {/* Card 1: Legacy */}
            <div className="flex flex-col items-center text-center space-y-4 bg-white p-7 rounded-3xl shadow-sm border border-slate-100 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-blue-100 group h-full">
              <div className="bg-blue-50 group-hover:bg-blue-100 p-4 rounded-full transition-colors duration-300">
                <Clock className="w-7 h-7 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">24+ Years Legacy</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Over two decades of clinical trust, compassionate care, and medical excellence in classical homoeopathy.</p>
              </div>
            </div>

            {/* Card 2: ISO Certified */}
            <div className="flex flex-col items-center text-center space-y-4 bg-white p-7 rounded-3xl shadow-sm border border-slate-100 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-green-100 group h-full">
              <div className="bg-green-50 group-hover:bg-green-100 p-4 rounded-full transition-colors duration-300">
                <ShieldCheck className="w-7 h-7 text-green-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">ISO Certified</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Recognized for maintaining international quality management standards and systematic clinical protocols.</p>
              </div>
            </div>

            {/* Card 3: Personalized Care */}
            <div className="flex flex-col items-center text-center space-y-4 bg-white p-7 rounded-3xl shadow-sm border border-slate-100 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-red-100 group h-full">
              <div className="bg-red-50 group-hover:bg-red-100 p-4 rounded-full transition-colors duration-300">
                <Heart className="w-7 h-7 text-red-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Personalized Care</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Every treatment plan is custom-tailored to suit your specific health condition and unique wellness goals.</p>
              </div>
            </div>

            {/* Card 4: Holistic Healing */}
            <div className="flex flex-col items-center text-center space-y-4 bg-white p-7 rounded-3xl shadow-sm border border-slate-100 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-purple-100 group h-full">
              <div className="bg-purple-50 group-hover:bg-purple-100 p-4 rounded-full transition-colors duration-300">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Holistic Healing</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Safe, natural, and side-effect-free solutions targeting root causes rather than just masking symptoms.</p>
              </div>
            </div>

            {/* Card 5: Secure Delivery */}
            <div className="flex flex-col items-center text-center space-y-4 bg-white p-7 rounded-3xl shadow-sm border border-slate-100 transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-orange-100 group h-full">
              <div className="bg-orange-50 group-hover:bg-orange-100 p-4 rounded-full transition-colors duration-300">
                <ThumbsUp className="w-7 h-7 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Secure Delivery</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Fast, direct doorstep delivery with robust packaging to preserve formulation integrity and potency.</p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}


