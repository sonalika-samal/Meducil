'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Medicine } from '@/lib/data/medicines';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Star, Heart, GitCompare, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '@/lib/data/cartContext';
import { useWishlist } from '@/lib/data/wishlistContext';
import { useCompare } from '@/lib/data/compareContext';

interface ProductCardProps {
  medicine: Medicine;
}

export function ProductCard({ medicine }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const wishlisted = isWishlisted(medicine.id);
  const compared = isInCompare(medicine.id);
  const discountPercentage = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 group flex flex-col relative overflow-hidden h-full">
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {medicine.isBestSeller && (
          <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase flex items-center shadow-sm">
            <Zap className="w-3 h-3 mr-1 fill-current" />
            Best Seller
          </span>
        )}
        {medicine.isDoctorRecommended && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase flex items-center shadow-sm">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Dr. Recommended
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(medicine);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm border ${
            wishlisted
              ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 backdrop-blur-sm border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50'
          }`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist: Save this medicine to view it later"}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (compared) {
              removeFromCompare(medicine.id);
            } else {
              addToCompare(medicine);
            }
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm border ${
            compared
              ? 'bg-blue-50 border-blue-200 text-blue-500 hover:bg-blue-100'
              : 'bg-white/90 backdrop-blur-sm border-slate-100 text-slate-400 hover:text-blue-500 hover:bg-blue-50'
          }`}
          title={compared ? "Remove from comparison" : "Compare: Add this medicine to compare side-by-side with others"}
        >
          <GitCompare className="w-4 h-4" />
        </button>
      </div>

      <Link href={`/medicines/${medicine.id}`} className="block relative h-56 w-full bg-slate-50 overflow-hidden">
        <Image
          src={medicine.image}
          alt={medicine.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discountPercentage > 0 && (
          <div className="absolute bottom-3 left-3 bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs border border-red-200">
            {discountPercentage}% OFF
          </div>
        )}
      </Link>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-bold text-primary-600 tracking-wide uppercase">{medicine.brand}</span>
          <div className="flex items-center text-xs font-medium bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {medicine.rating} <span className="text-yellow-600/70 ml-1">({medicine.reviews})</span>
          </div>
        </div>
        
        <Link href={`/medicines/${medicine.id}`}>
          <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
            {medicine.name}
          </h3>
        </Link>
        
        <div className="text-xs text-slate-500 mb-2 flex flex-wrap gap-1 items-center">
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{medicine.form}</span>
          {medicine.potency && (
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{medicine.potency}</span>
          )}
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{medicine.quantity}</span>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 mt-2">
          <span className="font-medium text-slate-700 block mb-1">Used for: {medicine.mainUsage}</span>
          {medicine.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-slate-900">₹{medicine.price}</span>
            {medicine.mrp > medicine.price && (
              <span className="text-sm text-slate-400 line-through">₹{medicine.mrp}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className={`text-xs font-medium flex items-center ${
              medicine.stockStatus === 'In Stock' ? 'text-green-600' : 
              medicine.stockStatus === 'Few Left' ? 'text-orange-500' : 'text-red-500'
            }`}>
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {medicine.stockStatus}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
            <Button 
              onClick={() => addToCart(medicine, 1)} 
              variant="outline" 
              className="w-full text-xs py-2 px-2 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" /> Add
            </Button>
            <Button 
              onClick={() => addToCart(medicine, 1)} 
              variant="primary" 
              className="w-full text-xs py-2 px-2 bg-primary-600 hover:bg-primary-700"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
