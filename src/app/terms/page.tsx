import { FileText, ShieldAlert, BadgeInfo } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Meducil',
  description: 'Understand the terms and conditions governing purchases, shipping, and clinical standards on Meducil.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-2">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full border border-primary-100 mb-6">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Usage Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600">
            Please read these terms carefully before purchasing homeopathic medicines or using our wellness portal.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm space-y-8 text-slate-600 leading-relaxed text-sm">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BadgeInfo className="w-6 h-6 text-primary-600" />
              1. E-Commerce Purchases & Availability
            </h2>
            <p>
              Meducil operates as an online catalog and supplier platform. All homeopathic dilutions, tablets, drops, and biochemic formulations listed are subject to laboratory availability. We reserve the right to refuse or limit orders in the event of manufacturing shortages.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-primary-600" />
              2. User Obligations & Compliance
            </h2>
            <p>
              By placing an order, you confirm that you are at least 18 years of age and that the shipping information provided is accurate and complete. Falsifying order details or attempting unauthorized administrative access represents a violation of these terms.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">3. Shipping and Delivery</h2>
            <p>
              We commit to dispatching orders within 24 hours of successful verification. Transit times are managed by third-party delivery services and may vary depending on local disruptions. Our <strong>Broken Bottle Guarantee</strong> covers transit damage only and must be reported via WhatsApp within 48 hours.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">4. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms of service, shipping rates, and product listings at any time without prior notice. Continuous usage of the website constitutes your acceptance of any revisions.
            </p>
          </section>

          <div className="border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
            Last Updated: June 2026 | Meducil Homeopathic Clinic Fulfillment Desk
          </div>
        </div>

      </div>
    </div>
  );
}
