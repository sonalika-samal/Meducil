'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Truck, ShieldCheck, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'General' | 'Shipping' | 'Payments' | 'Remedies';
}

export function FaqList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'General' | 'Shipping' | 'Payments' | 'Remedies'>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      category: 'General',
      question: 'How do I place an order for homeopathic medicines?',
      answer: 'Browse our extensively catalogued Categories or use the Search bar to find your required dilutions, drops, or biochemic tablets. Simply add them to your cart, fill in your shipping details, and check out securely.'
    },
    {
      category: 'Remedies',
      question: 'Are the homeopathic medicines authentic and safe?',
      answer: 'Yes. All products listed on Meducil are 100% authentic formulations sourced directly from licensed homeopathic laboratories like SBL, Dr. Reckeweg, Schwabe, and Wheezal. They are safe, non-toxic, and prepared under international quality standards.'
    },
    {
      category: 'Shipping',
      question: 'What are the shipping charges and transit speeds?',
      answer: 'We charge a flat shipping rate of ₹40 for standard delivery, and offer Free Shipping on all orders above ₹500. Most orders are dispatched within 24 hours and take 3 to 5 business days to reach your doorstep.'
    },
    {
      category: 'Shipping',
      question: 'What is your refund policy if a bottle breaks in transit?',
      answer: 'Homeopathic bottles are glass and can be fragile. We pack every order in premium, shock-absorbing double-bubble wrapping. In the rare event that a bottle leaks or breaks in transit, simply take a photo of the damaged bottle and send it to our WhatsApp support team within 48 hours for a 100% free replacement or refund.'
    },
    {
      category: 'Remedies',
      question: 'How should I store homeopathic dilutions and tablets?',
      answer: 'Keep them in a cool, dry place, away from direct sunlight, strong ambient odors (like camphor, coffee, perfume, onions), and electromagnetic radiation (such as microwave ovens, televisions, and mobile phones).'
    },
    {
      category: 'Payments',
      question: 'What payment methods do you support?',
      answer: 'We support all major payment types including credit/debit cards, net banking, UPI (GPay, PhonePe, Paytm), and Cash on Delivery (COD) for all eligible pin codes.'
    },
    {
      category: 'Payments',
      question: 'How secure is the checkout process?',
      answer: 'Extremely secure. All credit card and bank transactions are routed through Razorpay, a PCI-DSS certified payment processor with bank-grade security. Meducil never stores or sees your personal card credentials.'
    },
    {
      category: 'General',
      question: 'Can I cancel or change my shipping address after order placement?',
      answer: 'Yes, you can modify details or cancel orders within 12 hours of placing them, or before dispatch. Simply contact us via WhatsApp support at 7846969508 or email sonalika.ctc29@gmail.com with your Order ID.'
    }
  ];

  const categories: ('All' | 'General' | 'Shipping' | 'Payments' | 'Remedies')[] = [
    'All', 'General', 'Shipping', 'Payments', 'Remedies'
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/10'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-200 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent transition-all"
          />
        </div>
      </div>

      {/* FAQs List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className={`border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
                openIndex === idx ? 'shadow-md border-primary-200' : 'hover:border-primary-200'
              }`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className={`font-semibold text-base pr-4 ${openIndex === idx ? 'text-primary-700' : 'text-slate-900'}`}>
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-primary-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              
              {openIndex === idx && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">No questions match your search or filter.</p>
        </div>
      )}
    </div>
  );
}
