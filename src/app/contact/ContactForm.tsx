'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        // Clear fields on success
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        throw new Error(data.error || 'Failed to send message.');
      }
    } catch (err: any) {
      console.error('Contact Form Error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleMailtoFallback = () => {
    const mailtoUri = `mailto:sonalika.ctc29@gmail.com?subject=${encodeURIComponent(subject || 'Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoUri;
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 text-center shadow-lg shadow-emerald-100/20 backdrop-blur-sm animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Sent Successfully!</h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Your message has been sent to <span className="font-semibold text-slate-900">sonalika.ctc29@gmail.com</span>. We will review it and get back to you as soon as possible.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href="https://wa.me/917846969508"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-md shadow-green-200"
          >
            Chat on WhatsApp
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <Button
            variant="outline"
            onClick={() => setStatus('idle')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>
      
      {status === 'error' && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-rose-900">Delivery Failed</h4>
            <p className="text-xs text-rose-700 mt-1">{errorMessage}</p>
            <button
              type="button"
              onClick={handleMailtoFallback}
              className="text-xs font-semibold text-rose-900 underline hover:text-rose-950 mt-2 block"
            >
              Open in your email client instead (mailto:sonalika.ctc29@gmail.com)
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Your Name" 
          placeholder="Your Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
          disabled={status === 'loading'}
        />
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="you@domain.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          disabled={status === 'loading'}
        />
        <Input 
          label="Subject" 
          placeholder="How can we help?" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required 
          disabled={status === 'loading'}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
          <textarea 
            rows={4}
            className="flex w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            placeholder="Your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={status === 'loading'}
          ></textarea>
        </div>
        <Button 
          type="submit" 
          className="w-full mt-2 flex items-center justify-center gap-2"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending Message...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </form>
    </div>
  );
}
