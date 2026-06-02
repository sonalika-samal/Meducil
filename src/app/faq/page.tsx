import { HelpCircle } from 'lucide-react';
import { FaqList } from './FaqList';

export const metadata = {
  title: 'FAQ | Meducil',
  description: 'Find answers to common questions about homeopathic formulations, payments, shipping, storage, and refund policies.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-2">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full border border-primary-100 mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Help Desk</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600">
            Got questions? We have answers. If you can't find what you are looking for, contact our support team.
          </p>
        </div>

        {/* FAQ List Content */}
        <FaqList />

      </div>
    </div>
  );
}
