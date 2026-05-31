import { ShieldCheck, Truck, Package, Clock, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping & Delivery Policy | Meducil',
  description: 'Understand Meducil express medicine dispatch times, secure packaging, flat-rate shipping, and transit security parameters.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full border border-primary-100 mb-6">
            <Truck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Store Logistics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            Express Shipping & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Safe Delivery</span>
          </h1>
          <p className="text-lg text-slate-600">
            We deliver premium authentic homeopathic medicines directly to your doorstep with clinical-standard protective packaging and real-time transit tracking.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Delivery Speed */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Express Delivery</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              All orders are dispatched within 24 hours. Delivery takes **3 to 5 business days** depending on your location.
            </p>
          </div>

          {/* Card 2: Safe Packaging */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Potency Protection</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Dilutions and drops are packed in **shock-proof double-bubble wrap** to protect formulations from leaks, breaks, and temperature shifts.
            </p>
          </div>

          {/* Card 3: Free Shipping */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">COD Available</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We offer flat-rate ₹40 shipping, with **Free Shipping on orders above ₹500**. Cash on Delivery (COD) and online payments are fully supported.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines Block */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm space-y-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">Logistics and Fulfillment Policies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-xs">📦 Dispatch & Transit tracking</h4>
              <p className="text-slate-600 leading-relaxed">
                As soon as your package is handed over to our courier partner (Delhivery, BlueDart, or FedEx), you will receive a tracking link via **SMS, Email, and WhatsApp**. You can track your order transit status in real-time.
              </p>
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-xs">🧪 Preservation & Radiation Shielding</h4>
              <p className="text-slate-600 leading-relaxed">
                Homeopathic dilutions are highly sensitive. Our customized shipping boxes ensure your medicines are protected from external fragrances, severe moisture, and direct high heat throughout transit, safeguarding active remedies.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-xs">🚚 Delivery Regions</h4>
              <p className="text-slate-600 leading-relaxed">
                We deliver to over **19,000 pin codes** across India. Standard delivery to metro cities takes 2-3 days, while remote and rural regions may take 4-6 business days.
              </p>
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-xs">🔄 Broken Bottle Guarantee</h4>
              <p className="text-slate-600 leading-relaxed">
                If a glass dilution or dropper bottle arrives broken or leaking, we offer a **100% immediate replacement or refund**. Simply take a photo of the damaged parcel and WhatsApp our support team within 48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-800/30 to-accent-600/20 opacity-50" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Order Your Formulations?</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Explore our verified homeopathic catalog of over 100+ dilutions, drops, biochemic tablets, and wellness items, all eligible for immediate flat-rate express delivery.
            </p>
            <div className="pt-2">
              <Link href="/medicines">
                <Button size="lg" className="rounded-full bg-white hover:bg-slate-50 text-slate-900 px-8 font-bold shadow-md">
                  Shop Medicines
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
