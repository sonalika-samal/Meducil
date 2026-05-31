'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';

const DURATION_OPTIONS = [
  { id: 10, label: '10 Minutes', price: 100, description: 'Quick follow-up or minor query' },
  { id: 20, label: '20 Minutes', price: 200, description: 'Standard consultation' },
  { id: 30, label: '30 Minutes', price: 300, description: 'Detailed case taking for new patients' },
];

export function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    duration: 20,
    amount: 200,
    name: '',
    phone: '',
    age: '',
    gender: 'Select Gender',
    symptoms: '',
    preferredDate: '',
    preferredTime: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDurationSelect = (duration: number, price: number) => {
    setFormData(prev => ({ ...prev, duration, amount: price }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Create order via API (mocking here for frontend logic)
      // In a real scenario, we would call /api/create-order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const order = await response.json();

      // If Razorpay Key is available, initialize SDK, else simulate success
      if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && (window as any).Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Meducil",
          description: `Consultation - ${formData.duration} mins`,
          order_id: order.id,
          handler: async function (response: any) {
            // Verify payment
            await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, bookingData: formData })
            });
            router.push(`/success?id=${order.id}`);
          },
          prefill: {
            name: formData.name,
            contact: formData.phone,
          },
          theme: {
            color: "#2563eb"
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsLoading(false);
      } else {
        // Simulate Payment Success for Demo
        setTimeout(() => {
          setIsLoading(false);
          // Store mock booking data in localStorage to pass to success page
          localStorage.setItem('recentBooking', JSON.stringify({
            ...formData,
            id: 'mock_order_' + Math.floor(Math.random() * 100000),
            meetingLink: 'https://meducil.daily.co/consult-' + Math.floor(Math.random() * 1000)
          }));
          router.push('/success');
        }, 1500);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setIsLoading(false);
      alert('An error occurred while initializing payment. Please try again.');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            step >= i ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {i}
          </div>
          {i < 3 && (
            <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${
              step > i ? 'bg-primary-600' : 'bg-slate-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {renderStepIndicator()}

      <Card className="overflow-hidden shadow-xl border-slate-200">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: DURATION */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Consultation Duration</h2>
                  <p className="text-slate-500">Pricing is calculated at ₹10 per minute.</p>
                </div>

                <div className="space-y-4">
                  {DURATION_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleDurationSelect(option.id, option.price)}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.duration === option.id
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className={`w-6 h-6 mr-4 ${formData.duration === option.id ? 'text-primary-600' : 'text-slate-400'}`} />
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">{option.label}</h3>
                            <p className="text-sm text-slate-500">{option.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary-600">₹{option.price}</span>
                        </div>
                      </div>
                      {formData.duration === option.id && (
                        <div className="absolute -top-3 -right-3 bg-primary-600 text-white rounded-full p-1 shadow-md">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={nextStep} className="w-full sm:w-auto">
                    Continue <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PATIENT DETAILS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Patient Details</h2>
                  <p className="text-slate-500">Please provide accurate information for the doctor.</p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required />
                    <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 9876543210" required />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="35" required />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        required
                      >
                        <option disabled>Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Symptoms / Problem</label>
                    <textarea 
                      name="symptoms" 
                      value={formData.symptoms} 
                      onChange={handleInputChange}
                      rows={3}
                      className="flex w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      placeholder="Briefly describe what you're experiencing..."
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Preferred Date" name="preferredDate" type="date" value={formData.preferredDate} onChange={handleInputChange} required />
                    <Input label="Preferred Time" name="preferredTime" type="time" value={formData.preferredTime} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button 
                    onClick={nextStep} 
                    disabled={!formData.name || !formData.phone || !formData.age || formData.gender === 'Select Gender' || !formData.symptoms || !formData.preferredDate || !formData.preferredTime}
                  >
                    Review & Pay <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="mb-6 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h2>
                  <p className="text-slate-500">Review your details and proceed to secure payment.</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Booking Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Patient Name:</span>
                      <span className="font-medium text-slate-900">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duration:</span>
                      <span className="font-medium text-slate-900">{formData.duration} Minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date & Time:</span>
                      <span className="font-medium text-slate-900">{formData.preferredDate} at {formData.preferredTime}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-semibold text-slate-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-primary-600">₹{formData.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <Button variant="outline" onClick={prevStep} className="order-2 sm:order-1" disabled={isLoading}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Edit Details
                  </Button>
                  <Button 
                    className="order-1 sm:order-2 bg-slate-900 hover:bg-slate-800" 
                    onClick={handlePayment} 
                    isLoading={isLoading}
                  >
                    Pay ₹{formData.amount} Securely
                  </Button>
                </div>
                <p className="text-xs text-center text-slate-400 mt-6 flex items-center justify-center">
                  <Lock className="w-3 h-3 mr-1" /> Secured by Razorpay
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

// Temporary icon imports missed above
import { CreditCard, Lock } from 'lucide-react';
