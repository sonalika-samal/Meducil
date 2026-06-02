import { RefreshCw, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Returns & Refunds Policy | Meducil',
  description: 'Understand the terms of our broken bottle transit guarantee, order cancellations, and refund processing on Meducil.',
};

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-2">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full border border-primary-100 mb-6">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-wider">Fulfillment Desk</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            Returns & Refunds
          </h1>
          <p className="text-lg text-slate-600">
            We stand behind the quality of our homeopathic remedies. Read our policies on returns, refunds, and cancellations.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm space-y-8 text-slate-600 leading-relaxed text-sm">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary-600" />
              1. Broken Bottle Transit Guarantee
            </h2>
            <p>
              Homeopathic dilutions are packed in glass bottles. We protect all formulations using shock-proof double-bubble wrapping.
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50 text-emerald-950 flex gap-3 text-xs leading-relaxed">
              <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>100% Free Replacement or Refund:</strong> In the rare event that a bottle leaks, cracks, or breaks during transit, simply photograph the damaged bottle and send it to our WhatsApp support at <strong>7846969508</strong> or email us at <strong>sonalika.ctc29@gmail.com</strong> within 48 hours of delivery. We will ship a replacement free of charge or initiate a full refund.
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">2. Medicine Returns Policy</h2>
            <p>
              Due to strict clinical safety, hygiene, and formulation purity standards under the Drugs and Cosmetics Act, <strong>opened or unsealed homeopathic medicines cannot be returned</strong>. 
            </p>
            <p>
              Returns are only accepted for unopened, completely sealed, and undamaged health supplements or wellness items within 7 days of delivery. The customer is responsible for the return shipping costs unless the item sent was incorrect or damaged.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">3. Order Cancellations</h2>
            <p>
              You can cancel your order within **12 hours** of placing it, or before it is dispatched from our clinic fulfillment desk—whichever comes first. Once the package has been handed over to our shipping partner, the order cannot be cancelled or modified.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">4. Refund Processing Time</h2>
            <p>
              Once a refund is approved (either for cancelled orders or transit damages), it is processed directly back to the original payment source (UPI, Credit/Debit Card, Net Banking). 
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>UPI payments:</strong> Refund settles in 1 to 2 business days.</li>
              <li><strong>Card payments:</strong> Settlement takes 5 to 7 business days depending on your bank.</li>
              <li><strong>COD orders:</strong> Refund is issued via UPI/Bank Transfer after the buyer provides valid details.</li>
            </ul>
          </section>

          <div className="border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
            Last Updated: June 2026 | Meducil Homeopathic Clinic Fulfillment Desk
          </div>
        </div>

      </div>
    </div>
  );
}
