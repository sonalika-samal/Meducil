'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, MapPin, Phone, Mail, Globe, Calendar, ArrowRight } from 'lucide-react';

export function DoctorSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden border-t border-slate-100">
      {/* Background visual accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent-100/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 max-w-6xl mx-auto">
          
          {/* Image & Badge Column */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-5/12 xl:w-4/12 relative shrink-0"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] w-full max-w-sm mx-auto lg:max-w-none border-4 border-white bg-slate-100">
              <Image 
                src="/dr-ganesh.png"
                alt="Dr. Ganesh Kumar Das"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
              
              {/* Doctor Quick Tag in overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20">
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block mb-1">Chief Consultant</span>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">Dr. Ganesh Kumar Das</h3>
                  <p className="text-slate-500 text-xs font-semibold mt-1">Regd. No. 35792547/4340 (RMP)</p>
                </div>
              </div>
            </div>
            
            {/* Experience Floating Badge */}
            <div className="absolute -top-6 -right-4 md:-right-6 bg-gradient-to-br from-accent-500 to-accent-600 text-white p-4 rounded-full shadow-2xl flex flex-col items-center justify-center w-28 h-28 z-10 border-4 border-white animate-bounce-slow">
              <span className="text-3xl font-black leading-none">24+</span>
              <span className="text-[10px] font-bold text-center mt-1 uppercase tracking-wider leading-tight">Years<br/>Exp</span>
            </div>
          </motion.div>

          {/* Content & Details Column */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-7/12 xl:w-8/12 space-y-8"
          >
            {/* Introduction */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-accent-50 text-accent-700 px-4 py-2 rounded-full border border-accent-100">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest uppercase">Lead Practitioner</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Compassionate Holistic Care by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Dr. Ganesh Kumar Das</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                With a stellar record spanning more than <strong className="text-slate-900 font-semibold">24 years</strong>, Dr. Ganesh Kumar Das has pioneered customized homoeopathic healthcare. His approach integrates deep-rooted classical homoeopathy with specialized magnetotherapy and modern diagnostic awareness, resulting in high treatment success rates and sustained health transformations.
              </p>
            </div>

            {/* Qualifications Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-5">
              <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-500" /> Professional Credentials
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-primary-100 transition-colors">
                  <div className="bg-primary-50 p-2.5 rounded-lg mr-3.5 shrink-0 mt-0.5">
                    <Award className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 text-sm">Medical Degrees</span>
                    <span className="text-slate-600 text-xs mt-0.5 block leading-relaxed font-medium">B.H.M.S. • M.T. (P.G.) (Magnetotherapy) Trivendrum</span>
                  </div>
                </li>
                <li className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-primary-100 transition-colors">
                  <div className="bg-primary-50 p-2.5 rounded-lg mr-3.5 shrink-0 mt-0.5">
                    <Award className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 text-sm">Registered Practice</span>
                    <span className="text-slate-600 text-xs mt-0.5 block leading-relaxed font-medium">R.M.P. (Patna)</span>
                  </div>
                </li>
                <li className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-accent-100 transition-colors md:col-span-2">
                  <div className="bg-accent-50 p-2.5 rounded-lg mr-3.5 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 text-sm">Association Membership</span>
                    <span className="text-slate-600 text-xs mt-0.5 block leading-relaxed font-medium">Chief Active Member of the A.I.I.H. Association (South India)</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Direct Contact Grid */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Connect Directly</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="mailto:dr.ganesh.kumar34@gmail.com" 
                  className="flex items-center p-4 bg-white hover:bg-blue-50/40 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all hover:shadow-sm duration-300 group"
                >
                  <div className="bg-blue-50 group-hover:bg-blue-100 p-3 rounded-xl mr-4 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-slate-400">Email Address</span>
                    <span className="block text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">dr.ganesh.kumar34@gmail.com</span>
                  </div>
                </a>

                <a 
                  href="tel:+919430062740" 
                  className="flex items-center p-4 bg-white hover:bg-green-50/40 rounded-2xl border border-slate-200 hover:border-green-200 transition-all hover:shadow-sm duration-300 group"
                >
                  <div className="bg-green-50 group-hover:bg-green-100 p-3 rounded-xl mr-4 transition-colors">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-400">Phone Contact</span>
                    <span className="block text-sm font-bold text-slate-700 group-hover:text-green-600 transition-colors">(+91) 9430062740</span>
                  </div>
                </a>

                <div 
                  className="flex items-center p-4 bg-white rounded-2xl border border-slate-200"
                >
                  <div className="bg-orange-50 p-3 rounded-xl mr-4">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-400">Clinic Location</span>
                    <span className="block text-sm font-bold text-slate-700">Keoti-Ranway, DBG, Bihar</span>
                  </div>
                </div>

                <a 
                  href="https://aashutosh-homoeo-clinic.business.site" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-4 bg-white hover:bg-purple-50/40 rounded-2xl border border-slate-200 hover:border-purple-200 transition-all hover:shadow-sm duration-300 group"
                >
                  <div className="bg-purple-50 group-hover:bg-purple-100 p-3 rounded-xl mr-4 transition-colors">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-slate-400">Business Site</span>
                    <span className="block text-sm font-bold text-slate-700 truncate group-hover:text-purple-600 transition-colors">aashutosh-homoeo-clinic.site</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Booking CTA */}
            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/book" 
                className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5 duration-150 group"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Consultation with Dr. Ganesh
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
