'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import Link from 'next/link';
import { PrescriptionCaptureModal } from '../ui/PrescriptionCaptureModal';

const slides = [
  {
    id: 1,
    title: "Natural Healing for Your Family",
    subtitle: "Discover our premium range of homoeopathic wellness products.",
    cta: "Shop Now",
    href: "/medicines",
    bgClass: "bg-primary-900",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80",
    theme: "dark"
  },
  {
    id: 2,
    title: "Flat 20% Off on Wellness Kits",
    subtitle: "Boost your immunity naturally. Limited time offer.",
    cta: "View Offers",
    href: "/medicines?category=Wellness",
    bgClass: "bg-secondary-600",
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=1200&q=80",
    theme: "dark"
  },
  {
    id: 3,
    title: "Express Shipping & Safe Transit",
    subtitle: "Doorstep delivery in 3 to 5 business days with premium potency-safe packaging.",
    cta: "Delivery Info",
    href: "/shipping",
    bgClass: "bg-accent-500",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
    theme: "dark"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [homeQuery, setHomeQuery] = useState('');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('Search medicines by name or health concern...');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 375) {
        setPlaceholderText('Search medicines...');
      } else if (window.innerWidth < 640) {
        setPlaceholderText('Search medicines or concerns...');
      } else {
        setPlaceholderText('Search medicines by name or health concern...');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrescriptionCapture = (base64: string, mimeType: string) => {
    sessionStorage.setItem('meducil_pending_prescription', base64);
    sessionStorage.setItem('meducil_pending_mime', mimeType);
    window.location.href = `/medicines?image-search=true`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-slate-900 pt-20">


      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Base Image */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `url(${slides[current].image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          />
          {/* Color Tint Overlay */}
          <div className={`absolute inset-0 opacity-40 ${slides[current].bgClass}`} />
          {/* Text Readability Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 tracking-tight min-h-[72px] sm:min-h-[80px] md:min-h-[96px] lg:min-h-[120px] xl:min-h-[144px] ${slides[current].theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              >
                {slides[current].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={`text-sm sm:text-base md:text-lg lg:text-xl mb-8 md:mb-10 min-h-[40px] sm:min-h-[48px] md:min-h-[56px] lg:min-h-[64px] ${slides[current].theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}
              >
                {slides[current].subtitle}
              </motion.p>
              
              {/* Spacer matching the search bar height (54px) + margin bottom (32px) = 86px */}
              <div className="h-[54px] mb-8" />

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Link href={slides[current].href}>
                  <Button 
                    size="xl" 
                    variant={slides[current].theme === 'dark' ? 'primary' : 'outline'}
                    className={slides[current].theme === 'light' ? 'bg-white text-slate-900 hover:bg-slate-50 border-white' : 'bg-accent-500 hover:bg-accent-600 text-white border-accent-500'}
                  >
                    {slides[current].cta}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Static Search Bar Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Invisible Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 tracking-tight opacity-0 select-none min-h-[72px] sm:min-h-[80px] md:min-h-[96px] lg:min-h-[120px] xl:min-h-[144px]">
              {slides[current].title}
            </h1>
            {/* Invisible Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 md:mb-10 opacity-0 select-none min-h-[40px] sm:min-h-[48px] md:min-h-[56px] lg:min-h-[64px]">
              {slides[current].subtitle}
            </p>
            
            {/* The actual interactive search bar */}
            <div className="relative max-w-md w-full mb-2 bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl flex items-center shadow-lg pointer-events-auto">
              <input
                type="text"
                placeholder={placeholderText}
                value={homeQuery}
                onChange={(e) => setHomeQuery(e.target.value)}
                className="bg-transparent text-white placeholder-white/75 text-[11px] sm:text-xs px-3 sm:px-4 py-2 w-full focus:outline-none border-none font-sans"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && homeQuery.trim()) {
                    window.location.href = `/medicines?search=${encodeURIComponent(homeQuery.trim())}`;
                  }
                }}
              />
              <button 
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer flex-shrink-0 mr-1 relative group"
                title="Search by prescription/label image"
              >
                <Camera className="w-4 h-4" />
                <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
                </span>
              </button>
              <Button
                onClick={() => {
                  if (homeQuery.trim()) {
                    window.location.href = `/medicines?search=${encodeURIComponent(homeQuery.trim())}`;
                  }
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl h-10 px-5 font-bold text-xs shrink-0 border-none cursor-pointer"
              >
                Search
              </Button>
            </div>

            {/* Feature Highlight Helper Text */}
            <div className="text-[11px] text-white/85 font-semibold font-sans flex items-center gap-2 mb-8 ml-2 pointer-events-auto select-none">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span>
                Tip: Click the camera icon to search by uploading a prescription or medicine label photo!
              </span>
            </div>

            {/* Invisible CTA Button to align center spacing perfectly */}
            <div className="opacity-0 select-none pointer-events-none">
              <Button 
                size="xl" 
                variant={slides[current].theme === 'dark' ? 'primary' : 'outline'}
                className={slides[current].theme === 'light' ? 'bg-white text-slate-900 hover:bg-slate-50 border-white' : 'bg-accent-500 hover:bg-accent-600 text-white border-accent-500'}
              >
                {slides[current].cta}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={prevSlide}
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${current === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
          />
        ))}
      </div>

      <PrescriptionCaptureModal 
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onCapture={handlePrescriptionCapture}
      />
    </div>
  );
}
