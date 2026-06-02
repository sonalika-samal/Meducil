import { Suspense } from 'react';
import { Truck } from 'lucide-react';
import { TrackOrderClient } from './TrackOrderClient';

export const metadata = {
  title: 'Track Order | Meducil',
  description: 'Enter your unique Order ID to check your homeopathic package transit status, logistics partner, and delivery timeline in real-time.',
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-2">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full border border-primary-100 mb-6">
            <Truck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Live Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-lg text-slate-600">
            Monitor the dispatch progress and real-time shipping status of your homeopathic remedies.
          </p>
        </div>

        {/* Client Interactive Order Track component wrapped in Suspense */}
        <Suspense fallback={
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        }>
          <TrackOrderClient />
        </Suspense>

      </div>
    </div>
  );
}
