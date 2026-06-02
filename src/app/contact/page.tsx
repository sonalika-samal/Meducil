import { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Meducil',
  description: 'Get in touch with Meducil for any queries regarding homoeopathic remedies or orders.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-blue-950 text-white p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-2xl shadow-blue-950/20 relative overflow-hidden">
            {/* Background decorative glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-8">Get In Touch</h2>
              <div className="space-y-6">
                
                {/* Clinic Location */}
                <div className="flex items-start">
                  <div className="bg-primary-600 p-3 rounded-full mr-4 text-white shrink-0 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Our Clinic</h3>
                    <p className="text-slate-300 mt-1">Keoti-Ranway, DBG, Bihar, India</p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start">
                  <div className="bg-primary-600 p-3 rounded-full mr-4 text-white shrink-0 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Email Us</h3>
                    <a
                      href="mailto:sonalika.ctc29@gmail.com"
                      className="text-slate-300 mt-1 block hover:text-primary-400 transition-colors"
                    >
                      sonalika.ctc29@gmail.com
                    </a>
                  </div>
                </div>

                {/* Call Support */}
                <div className="flex items-start">
                  <div className="bg-primary-600 p-3 rounded-full mr-4 text-white shrink-0 flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Call Support</h3>
                    <a
                      href="tel:+917846969508"
                      className="text-slate-300 mt-1 block hover:text-primary-400 transition-colors font-medium"
                    >
                      (+91) 7846969508
                    </a>
                  </div>
                </div>

                {/* WhatsApp Support */}
                <div className="flex items-start">
                  <div className="bg-primary-600 p-3 rounded-full mr-4 text-white shrink-0 flex items-center justify-center">
                    <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.449 4.793 1.451 5.485.002 9.948-4.41 9.952-9.873.001-2.647-1.026-5.136-2.892-7.005C16.536 1.858 14.053.83 11.411.83c-5.492 0-9.957 4.411-9.962 9.874-.002 1.848.483 3.655 1.405 5.265l-.982 3.585 3.738-.968zm11.387-4.915c-.273-.137-1.62-.8-1.872-.892-.252-.092-.437-.137-.62.137-.183.274-.708.892-.868 1.077-.16.185-.32.206-.593.069-.273-.137-1.155-.426-2.202-1.36-1.15-.99-1.92-2.213-2.146-2.6-.226-.386-.024-.595.113-.732.123-.122.273-.32.41-.48.137-.16.183-.274.273-.457.092-.183.046-.343-.023-.48-.069-.137-.62-1.492-.85-2.04-.224-.54-.471-.466-.62-.474-.15-.007-.323-.008-.497-.008-.174 0-.458.065-.697.32-.239.256-.913.892-.913 2.176 0 1.284.933 2.525 1.063 2.7.13.175 1.837 2.805 4.45 3.93.622.268 1.108.428 1.488.548.624.199 1.192.171 1.64.104.499-.074 1.62-.663 1.848-1.302.228-.64.228-1.189.16-1.302-.069-.113-.252-.18-.524-.317z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">WhatsApp Support</h3>
                    <a
                      href="https://wa.me/917846969508"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 mt-1 block hover:text-emerald-400 transition-colors font-medium"
                    >
                      (+91) 7846969508
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-400 relative z-10">
              Response time: We usually reply within a few hours.
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
