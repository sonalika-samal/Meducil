import { ShieldCheck, Lock, EyeOff } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Meducil',
  description: 'Learn how Meducil collects, processes, protects, and stores customer order details and personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-2">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full border border-primary-100 mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Privacy & Trust</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600">
            We value your privacy and are committed to safeguarding your personal information and transaction details.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm space-y-8 text-slate-600 leading-relaxed text-sm">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary-600" />
              1. Information We Collect
            </h2>
            <p>
              When you purchase medicines or register an account on Meducil, we collect personal information necessary to fulfill your orders. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Personal details:</strong> Your full name, email address, and phone number.</li>
              <li><strong>Shipping details:</strong> Your physical address and postal pin code.</li>
              <li><strong>Billing information:</strong> Secure payment transaction references processed by our payment gateway.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-6 h-6 text-primary-600" />
              2. How We Use Your Data
            </h2>
            <p>
              Your data is processed strictly for clinical fulfillment, order verification, and logistics. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and ship your homeopathic medicines.</li>
              <li>Send real-time order tracking details via SMS, Email, and WhatsApp.</li>
              <li>Verify administrator access and safeguard transactions.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">3. Transaction Security</h2>
            <p>
              All online payments are processed through Razorpay, a certified, secure payment gateway using bank-grade SSL encryption protocols. Meducil does not store or see your debit/credit card details or net banking credentials.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">4. Third-Party Sharing</h2>
            <p>
              We only share your physical address and phone details with our shipping partners (such as Delhivery, BlueDart, or FedEx) to ensure successful delivery. We never sell, lease, or rent your personal information to third-party advertisers.
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
