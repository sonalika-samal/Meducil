'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I place an order for medicines?',
      answer: 'Browse our extensively catalogued Categories or use the Search bar to find your required dilutions, drops, or biochemic tablets. Simply add them to your cart, fill in your shipping details, and check out using credit cards, UPI, net banking, or Cash on Delivery.'
    },
    {
      question: 'Are the homeopathic medicines authentic and safe?',
      answer: 'Yes. All products listed on Meducil are 100% authentic formulations sourced directly from licensed homeopathic laboratories like SBL, Dr. Reckeweg, Schwabe, and Wheezal. They are safe, non-toxic, and prepared under international quality standards.'
    },
    {
      question: 'What are the shipping charges and transit speeds?',
      answer: 'We charge a flat shipping rate of ₹40 for standard delivery, and offer Free Shipping on all orders above ₹500. Most orders are dispatched within 24 hours and take 3 to 5 business days to reach your doorstep.'
    },
    {
      question: 'What is your refund policy if a bottle breaks in transit?',
      answer: 'Homeopathic bottles are glass and can be fragile. We pack every order in premium, shock-absorbing double-bubble wrapping. In the rare event that a bottle leaks or breaks in transit, simply take a photo of the damaged bottle and send it to our WhatsApp support team within 48 hours for a 100% free replacement or refund.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-3">FAQ</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-md border-primary-200' : 'hover:border-primary-200'}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between bg-white text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-semibold text-lg pr-4 ${openIndex === index ? 'text-primary-700' : 'text-slate-900'}`}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
