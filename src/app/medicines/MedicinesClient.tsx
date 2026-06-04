'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { categoriesData } from '@/lib/data/medicines';
import { useMedicines } from '@/lib/data/medicineStore';
import { ProductCard } from '@/components/medicines/ProductCard';
import { ShieldPlus, Thermometer, Leaf, Activity, Zap, Pill, Heart, Droplets, Sparkles, Search, SlidersHorizontal, ArrowRight, Camera } from 'lucide-react';
import Link from 'next/link';

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

export default function MedicinesClient() {
  const { medicines } = useMedicines();
  const [activeCategory, setActiveCategory] = useState<string>(categoriesData[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchParams = useSearchParams();
  const systemParam = searchParams.get('system');
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const [activeSystem, setActiveSystem] = useState<string>('Homeopathy');

  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageSuggestions, setImageSuggestions] = useState<Array<{ name: string; reason: string }> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeImageBase64 = async (base64: string, mimeType: string) => {
    setIsAnalyzingImage(true);
    setImageSuggestions(null);
    try {
      const response = await fetch('/api/search/prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          mimeType: mimeType,
        }),
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setImageSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Image analysis failed:', err);
      setImageSuggestions([]);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      analyzeImageBase64(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const isImageSearch = searchParams.get('image-search');
    if (isImageSearch === 'true') {
      const pendingImage = sessionStorage.getItem('meducil_pending_prescription');
      const pendingMime = sessionStorage.getItem('meducil_pending_mime');
      if (pendingImage && pendingMime) {
        sessionStorage.removeItem('meducil_pending_prescription');
        sessionStorage.removeItem('meducil_pending_mime');
        analyzeImageBase64(pendingImage, pendingMime);
      }
    }
  }, [searchParams]);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<{
    correctedQuery: string;
    matchedMedicines: string[];
    matchedCategories: string[];
    explanation: string;
  } | null>(null);
  const [isAiEnabled, setIsAiEnabled] = useState(true);

  useEffect(() => {
    if (!isAiEnabled || !searchQuery.trim()) {
      setAiSearchResults(null);
      setIsAiLoading(false);
      return;
    }

    setIsAiLoading(true);
    const queryToSearch = searchQuery.trim();

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/search/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: queryToSearch }),
        });

        if (!response.ok) throw new Error('AI search API error');
        
        const data = await response.json();
        setAiSearchResults(data);
      } catch (err) {
        console.error('Fuzzy AI search failed:', err);
        setAiSearchResults(null);
      } finally {
        setIsAiLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isAiEnabled]);

  useEffect(() => {
    if (systemParam && ['Homeopathy', 'Yellowpathy', 'Ayurvedic'].includes(systemParam)) {
      setActiveSystem(systemParam);
    }
  }, [systemParam]);

  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  // Handle scroll spy
  useEffect(() => {
    if (activeSystem !== 'Homeopathy') return;

    const handleScroll = () => {
      const sections = categoriesData.map(c => document.getElementById(c.id));
      let currentActive = categoriesData[0].id;
      
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // If section is near the top of the viewport
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentActive = section.id;
            break;
          }
        }
      }
      setActiveCategory(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSystem]);

  return (
    <div className="flex flex-col gap-8">
      {/* Hidden File Input for Prescription Scanning */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange} 
      />

      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* System Selector Tab Bar */}
        <div className="inline-flex p-1.5 bg-white/90 backdrop-blur rounded-2xl border border-slate-200/60 shadow-sm max-w-full">
          <button 
            onClick={() => setActiveSystem('Homeopathy')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer border-none ${
              activeSystem === 'Homeopathy' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 bg-transparent'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-green-500" /> Homeopathy
          </button>
          <button 
            onClick={() => setActiveSystem('Yellowpathy')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer border-none ${
              activeSystem === 'Yellowpathy' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 bg-transparent'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-amber-500" /> Yellowpathy
            <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase leading-none">Soon</span>
          </button>
          <button 
            onClick={() => setActiveSystem('Ayurvedic')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer border-none ${
              activeSystem === 'Ayurvedic' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 bg-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Ayurvedic
            <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase leading-none">Soon</span>
          </button>
        </div>

        {/* Global Medicine Search Input */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search all medicines or concerns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs font-sans transition-all shadow-sm"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <button 
            onClick={triggerFileSelect}
            className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all border-none bg-transparent cursor-pointer"
            title="Search by prescription/label image"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeSystem === 'Homeopathy' ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Sidebar Navigation */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-28">
              
              <div className="mb-6 relative">
                <input 
                  type="text" 
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <button 
                  onClick={triggerFileSelect}
                  className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all border-none bg-transparent cursor-pointer"
                  title="Search by prescription/label image"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Categories</h2>
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              </div>

              <nav className="flex flex-col gap-1 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                {categoriesData.map(category => {
                  const Icon = iconMap[category.id] || Leaf;
                  const isActive = activeCategory === category.id;
                  
                  return (
                    <Link
                      key={category.id}
                      href={`#${category.id}`}
                      onClick={(e) => {
                        setActiveCategory(category.id);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' 
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-slate-400'}`} />
                      {category.name}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-2 text-green-700 font-bold">
                  <ShieldPlus className="w-5 h-5" />
                  100% Authentic
                </div>
                <p className="text-xs text-green-600/80">Directly sourced from trusted homeopathic manufacturers.</p>
              </div>
            </div>
          </div>

          {/* Main Content - Category Sections */}
          <div className="flex-grow">
            {/* Image Suggestions Panel */}
            {(isAnalyzingImage || imageSuggestions) && (
              <div className="mb-8 p-6 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-lg relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/30 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isAnalyzingImage ? 'bg-primary-50 text-primary-600 animate-pulse' : 'bg-primary-100 text-primary-600'
                  }`}>
                    <Camera className={`w-6 h-6 ${isAnalyzingImage ? 'animate-bounce' : ''}`} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                      Prescription & Label Matches
                      {isAnalyzingImage && (
                        <span className="text-[10px] font-normal text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full animate-pulse">
                          Scanning...
                        </span>
                      )}
                    </h3>
                    
                    {isAnalyzingImage ? (
                      <p className="text-xs text-slate-500 font-sans mt-1">
                        Analyzing your uploaded image to identify matching products in our store...
                      </p>
                    ) : imageSuggestions && imageSuggestions.length > 0 ? (
                      <div>
                        <p className="text-xs text-slate-600 font-sans mt-1 mb-3">
                          The following matches were found. Click any recommendation to search:
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {imageSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSearchQuery(suggestion.name);
                              }}
                              className="px-4 py-2 bg-white/80 hover:bg-primary-50 border border-slate-200 hover:border-primary-200 text-slate-700 hover:text-primary-700 rounded-xl text-xs font-bold font-sans flex flex-col items-start text-left shadow-sm hover:shadow transition-all cursor-pointer"
                            >
                              <span>{suggestion.name}</span>
                              <span className="text-[9px] text-slate-400 font-normal mt-0.5">{suggestion.reason}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-slate-600 font-sans mt-1">
                          Could not identify any matching medicine names or symptoms from this image.
                        </p>
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                          Please ensure the photo is clear and legible.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => {
                      setImageSuggestions(null);
                      setIsAnalyzingImage(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all border-none bg-transparent cursor-pointer self-start"
                    title="Dismiss suggestions"
                  >
                    <span className="text-lg leading-none font-bold">&times;</span>
                  </button>
                </div>
              </div>
            )}

            {/* Smart Search Correction (Google Did-You-Mean Style) */}
            {searchQuery.trim() && (
              <div className="mb-6 font-sans">
                {isAiLoading ? (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 px-1 animate-pulse">
                    <div className="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                    Searching...
                  </div>
                ) : (
                  isAiEnabled && aiSearchResults && aiSearchResults.correctedQuery && 
                  aiSearchResults.correctedQuery.toLowerCase() !== searchQuery.toLowerCase().trim() && (
                    <div className="text-xs text-slate-500 bg-slate-50 border border-slate-150 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
                      <span>
                        Showing results for <strong className="text-slate-800 italic">"{aiSearchResults.correctedQuery}"</strong>. 
                        {' '}Search instead for <button 
                          onClick={() => {
                            setIsAiEnabled(false);
                          }}
                          className="text-primary-600 hover:text-primary-700 underline font-bold bg-transparent border-none p-0 cursor-pointer inline ml-1"
                        >
                          "{searchQuery}"
                        </button>.
                      </span>
                    </div>
                  )
                )}

                {/* Status indicator when Smart search is disabled */}
                {!isAiEnabled && (
                  <div className="text-[10px] text-slate-400 px-1 mt-1 flex items-center gap-1.5">
                    <span>Direct search matches active.</span>
                    <button 
                      onClick={() => setIsAiEnabled(true)}
                      className="text-primary-600 hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
                    >
                      Enable smart search
                    </button>
                  </div>
                )}
              </div>
            )}

            {categoriesData.map((category, index) => {
              const categoryMedicines = medicines.filter(m => {
                const matchesSystem = (m.system || 'Homeopathy') === 'Homeopathy';
                const matchesCategory = m.categories 
                  ? m.categories.includes(category.name) 
                  : m.category === category.name;
                
                let matchesSearch = false;
                
                if (isAiEnabled && aiSearchResults && searchQuery.trim()) {
                  // AI matching logic:
                  // 1. Match names returned by Gemini
                  const matchesAiName = aiSearchResults.matchedMedicines.some(
                    name => name.toLowerCase() === m.name.toLowerCase()
                  );
                  
                  // 2. Match categories returned by Gemini
                  const matchesAiCategory = aiSearchResults.matchedCategories.some(
                    catName => m.categories 
                      ? m.categories.map(c => c.toLowerCase()).includes(catName.toLowerCase())
                      : m.category.toLowerCase() === catName.toLowerCase()
                  );
                  
                  // 3. Fallback to standard substring matches on name/usage/description
                  const matchesBasicName = m.name.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesUsage = m.mainUsage ? m.mainUsage.toLowerCase().includes(searchQuery.toLowerCase()) : false;
                  
                  matchesSearch = matchesAiName || matchesAiCategory || matchesBasicName || matchesUsage;
                } else {
                  // Standard search matching
                  const matchesBasicName = m.name.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesUsage = m.mainUsage ? m.mainUsage.toLowerCase().includes(searchQuery.toLowerCase()) : false;
                  const matchesBrand = m.brand ? m.brand.toLowerCase().includes(searchQuery.toLowerCase()) : false;
                  matchesSearch = matchesBasicName || matchesUsage || matchesBrand;
                }

                return matchesSystem && matchesCategory && matchesSearch;
              });

              if (categoryMedicines.length === 0 && searchQuery) return null;

              const Icon = iconMap[category.id] || Leaf;

              return (
                <motion.section 
                  key={category.id}
                  id={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.1 }}
                  className="mb-16 scroll-mt-28"
                >
                  {/* Category Banner / Header */}
                  <div className={`rounded-2xl p-6 md:p-8 mb-8 flex items-center justify-between border ${
                    index % 2 === 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                  }`}>
                    <div className="max-w-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <Icon className={`w-5 h-5 ${index % 2 === 0 ? 'text-red-500' : 'text-green-500'}`} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
                      </div>
                      <p className="text-slate-600 mt-2 text-sm leading-relaxed">{category.description}</p>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-3xl font-black text-slate-900/10">{categoryMedicines.length}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Products</span>
                    </div>
                  </div>

                  {categoryMedicines.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                      {categoryMedicines.map((medicine) => (
                        <ProductCard key={medicine.id} medicine={medicine} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">Coming Soon</h3>
                      <p className="text-slate-600 font-sans text-sm">We are adding premium products to this category.</p>
                    </div>
                  )}
                  
                  {categoryMedicines.length > 0 && (
                    <div className="mt-8 text-center">
                      <button className="text-primary-600 font-semibold text-sm hover:text-primary-700 flex items-center justify-center mx-auto group border-none bg-transparent cursor-pointer">
                        Explore More in {category.name} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </motion.section>
              );
            })}
          </div>
        </div>
      ) : (
        /* Coming Soon Panel */
        <div className="py-16 md:py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-4xl mx-auto w-full">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner border ${
            activeSystem === 'Yellowpathy' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {activeSystem === 'Yellowpathy' ? (
              <Pill className="w-8 h-8 animate-bounce text-amber-500" />
            ) : (
              <Leaf className="w-8 h-8 animate-pulse text-emerald-500" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3 font-sans">
            {activeSystem} Section Coming Soon
          </h2>
          <p className="text-slate-500 max-w-md mb-8 leading-relaxed font-sans text-sm">
            We are working diligently to launch our new range of premium {activeSystem === 'Yellowpathy' ? 'Allopathic (Modern)' : 'Ayurvedic (Traditional)'} wellness products. We partner directly with verified manufacturers to ensure the highest standard of quality and safety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
            <a 
              href="https://wa.me/917846969508" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition-all gap-2 text-decoration-none"
            >
              Consult with Doctor
            </a>
            <button 
              onClick={() => setActiveSystem('Homeopathy')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all border-none cursor-pointer"
            >
              Back to Homeopathy Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
