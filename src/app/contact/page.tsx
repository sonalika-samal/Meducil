import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Meducil',
  description: 'Get in touch with Meducil for any queries regarding homoeopathic treatments or appointments.',
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
          <div className="bg-slate-50 p-8 rounded-3xl h-fit">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <MapPin className="text-primary-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Our Clinic</h3>
                  <p className="text-slate-600 mt-1"></p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <Mail className="text-primary-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Email Us</h3>
                  <p className="text-slate-600 mt-1"></p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <Phone className="text-primary-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Support Call (For queries only)</h3>
                  <p className="text-slate-600 mt-1"></p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>
            <form className="space-y-4">
              <Input label="Your Name" placeholder="Your Full Name" required />
              <Input label="Email Address" type="email" placeholder="you@domain.com" required />
              <Input label="Subject" placeholder="How can we help?" required />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea 
                  rows={4}
                  className="flex w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>
              <Button className="w-full mt-2">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
