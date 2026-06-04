'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Medicine } from '@/lib/data/medicines';
import { useMedicines } from '@/lib/data/medicineStore';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Star, Heart, Share2, ShieldCheck, CheckCircle2, ChevronRight, Zap, ArrowLeft, Pill } from 'lucide-react';
import { ProductCard } from '@/components/medicines/ProductCard';
import Link from 'next/link';
import { useCart } from '@/lib/data/cartContext';

export default function ProductDetailClient({ productId }: { productId: string }) {
  const { medicines, loading } = useMedicines();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const medicine = medicines.find(m => m.id === productId);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-12 my-8 border border-slate-100">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading medicine details...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-100 my-8 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm animate-bounce">
          <Pill className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Medicine Not Found</h2>
        <p className="text-slate-500 max-w-md mb-8">
          The medicine you are looking for does not exist, or has been removed by the administrator.
        </p>
        <Link href="/medicines">
          <Button className="rounded-full px-8 bg-primary-600 text-white hover:bg-primary-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const discountPercentage = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);
  
  // Related Products
  const relatedProducts = medicines
    .filter(m => {
      const mCats = m.categories || [m.category || ''];
      const medCats = medicine.categories || [medicine.category || ''];
      const hasOverlap = mCats.some(c => medCats.includes(c));
      return hasOverlap && m.id !== medicine.id;
    })
    .slice(0, 4);

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-slate-500 mb-8 mt-4">
        <span>Home</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Medicines</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-slate-900 font-medium">
          {medicine.categories && medicine.categories.length > 0 
            ? medicine.categories.join(', ') 
            : medicine.category}
        </span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-primary-600 font-medium line-clamp-1">{medicine.name}</span>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Image Gallery (Simplified for now) */}
        <div className="relative h-[400px] md:h-[500px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 p-8 flex items-center justify-center group">
          <Image
            src={medicine.image}
            alt={medicine.name}
            fill
            className="object-contain p-12 group-hover:scale-110 transition-transform duration-700 cursor-zoom-in"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-6 left-6 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-bold text-sm border border-red-200 shadow-sm">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-primary-100">
              {medicine.brand}
            </span>
            {medicine.isBestSeller && (
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-md text-xs font-bold flex items-center border border-orange-100">
                <Zap className="w-3 h-3 mr-1 fill-current" /> Best Seller
              </span>
            )}
            {medicine.isDoctorRecommended && (
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs font-bold flex items-center border border-green-100">
                <ShieldCheck className="w-3 h-3 mr-1" /> Recommended
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{medicine.name}</h1>
          <p className="text-lg text-slate-600 mb-4">{medicine.mainUsage}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-sm font-medium bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg border border-yellow-200">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1.5" />
              {medicine.rating} <span className="text-yellow-600/70 ml-1.5">({medicine.reviews} reviews)</span>
            </div>
            <div className={`text-sm font-bold flex items-center ${
              medicine.stockStatus === 'In Stock' ? 'text-green-600' : 'text-red-500'
            }`}>
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {medicine.stockStatus}
            </div>
          </div>

          <div className="flex gap-4 mb-6 text-sm">
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2">
              <span className="text-slate-500 block mb-1">Form</span>
              <span className="font-semibold text-slate-900">{medicine.form}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2">
              <span className="text-slate-500 block mb-1">Quantity</span>
              <span className="font-semibold text-slate-900">{medicine.quantity}</span>
            </div>
            {medicine.potency && (
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2">
                <span className="text-slate-500 block mb-1">Potency</span>
                <span className="font-semibold text-slate-900">{medicine.potency}</span>
              </div>
            )}
          </div>

          <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-bold text-slate-900">₹{medicine.price}</span>
              {medicine.mrp > medicine.price && (
                <span className="text-xl text-slate-400 line-through mb-1">₹{medicine.mrp}</span>
              )}
            </div>
            <p className="text-xs text-slate-500">Inclusive of all taxes</p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-slate-200 rounded-xl h-12 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-l-xl transition-colors"
              >-</button>
              <div className="w-12 h-full flex items-center justify-center font-bold text-slate-900 border-x border-slate-200">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-r-xl transition-colors"
              >+</button>
            </div>
            <Button 
              onClick={() => addToCart(medicine, quantity)}
              variant="outline" 
              className="h-12 px-6 flex-grow rounded-xl border-slate-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button 
              onClick={() => addToCart(medicine, quantity)}
              variant="primary" 
              className="h-12 px-8 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
            >
              Buy Now
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
            <button className="flex items-center text-sm font-medium text-slate-500 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5 mr-2" /> Add to Wishlist
            </button>
            <button className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-500 transition-colors">
              <Share2 className="w-5 h-5 mr-2" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="mb-20">
        <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto custom-scrollbar pb-1">
          {['description', 'benefits', 'ingredients', 'dosage & safety', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-bold pb-4 capitalize whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[200px] text-slate-600 leading-relaxed max-w-4xl">
          {activeTab === 'description' && (
            <div>
              <p className="mb-4">{medicine.description}</p>
              <p>Homeopathic medicines are highly diluted natural substances that stimulate the body's self-healing mechanisms. They are safe, non-toxic, and traditionally used to treat a variety of acute and chronic conditions.</p>
            </div>
          )}
          {activeTab === 'benefits' && (
            <ul className="list-disc pl-5 space-y-2">
              {medicine.benefits?.map((b, i) => (
                <li key={i}>{b}</li>
              )) || <li>Details not available.</li>}
            </ul>
          )}
          {activeTab === 'ingredients' && (
            <ul className="list-disc pl-5 space-y-2">
              {medicine.ingredients?.map((i, idx) => (
                <li key={idx}>{i}</li>
              )) || <li>Active Homeopathic Ingredients</li>}
            </ul>
          )}
          {activeTab === 'dosage & safety' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-primary-500" /> Dosage</h3>
                <p>{medicine.dosage || "Use as directed by a healthcare professional."}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-primary-500" /> Safety Information</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {medicine.safetyInfo?.map((s, i) => <li key={i}>{s}</li>) || <li>Read label before use</li>}
                  {medicine.storage && <li><strong>Storage:</strong> {medicine.storage}</li>}
                </ul>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="text-center p-12 bg-slate-50 rounded-2xl border border-slate-100">
              <Star className="w-12 h-12 text-yellow-400 fill-current mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Customer Reviews</h3>
              <p className="mb-6">This product has {medicine.reviews} reviews averaging {medicine.rating} out of 5 stars.</p>
              <Button variant="outline">Write a Review</Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-100 pt-16 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Similar Medicines in {medicine.categories && medicine.categories.length > 0 ? medicine.categories[0] : medicine.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} medicine={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
