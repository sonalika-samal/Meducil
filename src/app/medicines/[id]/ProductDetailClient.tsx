'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Medicine } from '@/lib/data/medicines';
import { useMedicines } from '@/lib/data/medicineStore';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Star, Heart, Share2, ShieldCheck, CheckCircle2, ChevronRight, Zap, ArrowLeft, Pill, Send } from 'lucide-react';
import { ProductCard } from '@/components/medicines/ProductCard';
import Link from 'next/link';
import { useCart } from '@/lib/data/cartContext';
import { useWishlist } from '@/lib/data/wishlistContext';
import { useReviews, submitReview } from '@/lib/data/reviewStore';

export default function ProductDetailClient({ productId }: { productId: string }) {
  const { medicines, loading } = useMedicines();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { reviews: fetchedReviews, loading: reviewsLoading, refetch: refetchReviews } = useReviews(productId);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const wishlisted = isWishlisted(productId);
  
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
        <p className="text-slate-500 max-w-md mb-4">
          The medicine you are looking for does not exist, or has been removed by the administrator.
        </p>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-left max-w-md w-full mb-8 text-xs font-mono space-y-1 text-slate-500 mx-auto">
          <p><span className="font-bold text-slate-700">Requested ID:</span> {productId || 'undefined'}</p>
          <p><span className="font-bold text-slate-700">Loaded count:</span> {medicines?.length || 0}</p>
          <p><span className="font-bold text-slate-700">Available IDs:</span> {medicines?.slice(0, 5).map(m => m.id).join(', ') || 'none'}</p>
        </div>
        <Link href="/medicines">
          <Button className="rounded-full px-8 bg-primary-600 text-white hover:bg-primary-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim()) {
      setReviewError('Name is required');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Review comment is required');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      await submitReview(productId, reviewName, reviewRating, reviewComment);
      setReviewSuccess('Your review has been added successfully! The product rating has been updated.');
      setReviewName('');
      setReviewRating(5);
      setReviewComment('');
      refetchReviews();
      setTimeout(() => setReviewSuccess(''), 5000);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

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
            <button 
              onClick={() => toggleWishlist(medicine)}
              className={`flex items-center text-sm font-medium transition-colors ${
                wishlisted ? 'text-rose-600 hover:text-rose-700' : 'text-slate-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 ${wishlisted ? 'fill-current' : ''}`} /> 
              {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <button 
              onClick={handleShare}
              className={`flex items-center text-sm font-medium transition-colors ${
                shareCopied ? 'text-green-650 hover:text-green-700 font-bold' : 'text-slate-500 hover:text-blue-500'
              }`}
            >
              <Share2 className="w-5 h-5 mr-2" /> {shareCopied ? 'Link Copied!' : 'Share'}
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
            <div className="space-y-10">
              {/* Reviews Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
                {/* Score */}
                <div className="text-center md:border-r md:border-slate-200 md:pr-8 space-y-2">
                  <span className="text-5xl font-black text-slate-900 block">{medicine.rating}</span>
                  <div className="flex justify-center text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => {
                      const isFilled = s <= Math.round(medicine.rating);
                      return <Star key={s} className={`w-5 h-5 ${isFilled ? 'fill-current' : 'text-slate-300'}`} />;
                    })}
                  </div>
                  <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider mt-1">
                    Based on {medicine.reviews} reviews
                  </span>
                </div>

                {/* Rating Distribution Bars */}
                <div className="md:col-span-2 space-y-2.5">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    // Count how many reviews have this rating
                    const matchingCount = fetchedReviews.filter((r) => r.rating === stars).length;
                    const percentage = fetchedReviews.length > 0 ? (matchingCount / fetchedReviews.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center text-xs gap-3">
                        <span className="w-3 font-bold text-slate-500">{stars}</span>
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <div className="flex-grow h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-14 font-bold text-slate-450 text-right">
                          {matchingCount} ({Math.round(percentage)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write a Review Section */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pt-4">
                {/* Left: Reviews Feed */}
                <div className="lg:col-span-3 space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Customer Feedback ({fetchedReviews.length})
                  </h3>
                  
                  {reviewsLoading ? (
                    <div className="py-8 text-center">
                      <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs text-slate-400 font-semibold">Loading reviews...</p>
                    </div>
                  ) : fetchedReviews.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed p-6">
                      <p className="text-sm font-semibold text-slate-500 mb-1">No reviews yet</p>
                      <p className="text-xs text-slate-400">Be the first to share your experience with this medicine!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 space-y-6">
                      {fetchedReviews.map((rev) => (
                        <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="font-bold text-slate-900 block text-sm">{rev.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium block">
                                {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-slate-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Submit Review Form */}
                <div className="lg:col-span-2 bg-slate-50 rounded-3xl border border-slate-100 p-6 self-start space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Add a Review</h3>
                    <p className="text-xs text-slate-500">Your feedback helps other buyers make healthier decisions.</p>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Reviewer Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmittingReview}
                      />
                    </div>

                    {/* Rating Select */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Product Rating</label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((s) => {
                          const isHoveredOrSelected = s <= reviewRating;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewRating(s)}
                              className={`p-0.5 rounded-full transition-transform hover:scale-125 ${
                                isHoveredOrSelected ? 'text-yellow-400' : 'text-slate-300'
                              }`}
                              disabled={isSubmittingReview}
                            >
                              <Star className={`w-7 h-7 ${isHoveredOrSelected ? 'fill-current' : ''}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review Comment */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Review Comments</label>
                      <textarea
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share details of your experience with this product..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed"
                        disabled={isSubmittingReview}
                      />
                    </div>

                    {reviewError && (
                      <div className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-xl text-[10px] font-bold">
                        {reviewError}
                      </div>
                    )}

                    {reviewSuccess && (
                      <div className="p-3 bg-green-50 border border-green-150 text-green-700 rounded-xl text-[10px] font-bold leading-normal animate-fadeIn">
                        {reviewSuccess}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs shadow-md mt-2 flex items-center justify-center gap-1.5"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>
              </div>
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
