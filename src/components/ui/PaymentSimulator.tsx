'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, CheckCircle2, AlertCircle, Smartphone, Globe, X, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface PaymentSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  customerName: string;
  customerPhone: string;
  onSuccess: (paymentId: string, signature: string) => void;
  onFailure: (error: string) => void;
}

type TabType = 'card' | 'upi' | 'netbanking';

export function PaymentSimulator({
  isOpen,
  onClose,
  amount,
  description,
  customerName,
  customerPhone,
  onSuccess,
  onFailure,
}: PaymentSimulatorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upi');
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failure'>('idle');
  const [processingStep, setProcessingStep] = useState(0);

  const processingTexts = [
    'Initiating secure connection...',
    'Contacting sandbox banking network...',
    'Authorizing transaction amount...',
    'Generating payment token and signature...',
    'Verifying with Meducil servers...'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentState === 'processing') {
      if (processingStep < processingTexts.length - 1) {
        timer = setTimeout(() => {
          setProcessingStep(prev => prev + 1);
        }, 800);
      } else {
        // Automatically succeed or fail after last step (handled by click)
      }
    } else {
      setProcessingStep(0);
    }
    return () => clearTimeout(timer);
  }, [paymentState, processingStep]);

  const handleSimulate = (success: boolean) => {
    setPaymentState('processing');
    setProcessingStep(0);

    setTimeout(() => {
      if (success) {
        setPaymentState('success');
        setTimeout(() => {
          const mockPaymentId = 'pay_mock_' + Math.random().toString(36).substring(2, 14);
          const mockSignature = 'mock_sig_placeholder_' + Math.random().toString(36).substring(2, 10);
          onSuccess(mockPaymentId, mockSignature);
        }, 1500);
      } else {
        setPaymentState('failure');
        setTimeout(() => {
          setPaymentState('idle');
          onFailure('Payment was declined by the simulated bank network.');
        }, 2000);
      }
    }, 4000); // 4 seconds total processing animation time
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => paymentState === 'idle' && onClose()}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 flex flex-col font-sans"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-inner">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight leading-none">Sandbox Payment</h3>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mt-1 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/55 inline-block">
                  Developer Mode
                </span>
              </div>
            </div>
            {paymentState === 'idle' && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Body Content based on Payment State */}
          <div className="p-6 flex-1 min-h-[360px] flex flex-col justify-between">
            {paymentState === 'idle' && (
              <>
                {/* Warning Alert */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs text-amber-800 mb-5 leading-relaxed">
                  <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">No active credentials detected.</span> Meducil is running in demo sandbox mode. Live transactions are bypassed so you can test all features.
                  </div>
                </div>

                {/* Amount to pay */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center mb-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Amount to Pay</span>
                    <span className="text-slate-800 font-medium text-xs line-clamp-1 mt-0.5">{description}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">₹{amount}</span>
                  </div>
                </div>

                {/* Payment Methods tabs */}
                <div className="flex border-b border-slate-100 mb-5 text-xs font-bold text-slate-400">
                  <button
                    onClick={() => setActiveTab('upi')}
                    className={`flex-1 pb-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'upi' ? 'text-primary-600 border-primary-600' : 'border-transparent hover:text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> UPI Apps
                  </button>
                  <button
                    onClick={() => setActiveTab('card')}
                    className={`flex-1 pb-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'card' ? 'text-primary-600 border-primary-600' : 'border-transparent hover:text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Card Details
                  </button>
                  <button
                    onClick={() => setActiveTab('netbanking')}
                    className={`flex-1 pb-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'netbanking' ? 'text-primary-600 border-primary-600' : 'border-transparent hover:text-slate-700'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" /> NetBanking
                  </button>
                </div>

                {/* Tab Screens */}
                <div className="flex-1 mb-6">
                  {activeTab === 'upi' && (
                    <div className="space-y-4 text-center">
                      <p className="text-xs text-slate-500">Scan QR Code or pay directly via UPI applications</p>
                      
                      {/* Fake QR Code */}
                      <div className="w-32 h-32 bg-slate-50 border border-slate-200 rounded-2xl mx-auto flex flex-col items-center justify-center p-2 relative shadow-inner overflow-hidden select-none">
                        <div className="w-full h-full bg-slate-100 rounded-lg flex flex-wrap gap-1 p-1 opacity-80">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-[1px] ${
                              (i * 7 + i % 3) % 2 === 0 ? 'bg-slate-800' : 'bg-transparent'
                            }`} />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                            <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center text-[8px] text-white font-extrabold">M</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center gap-4 text-[10px] text-slate-500 font-bold">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200">@paytm</span>
                        <span className="px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200">@ybl</span>
                        <span className="px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200">@oksbi</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">CARD NUMBER</label>
                        <input
                          type="text"
                          readOnly
                          value="4111 •••• •••• 1111"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 font-mono focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">EXPIRY</label>
                          <input
                            type="text"
                            readOnly
                            value="12 / 29"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 font-mono focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">CVV</label>
                          <input
                            type="text"
                            readOnly
                            value="***"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic text-center pt-2">Simulated testing values pre-filled.</p>
                    </div>
                  )}

                  {activeTab === 'netbanking' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                        <div
                          key={bank}
                          className="p-2 border border-slate-150 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer font-medium text-slate-700 transition-colors"
                        >
                          <span className="truncate">{bank}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Simulation Action buttons */}
                <div className="space-y-2.5">
                  <Button
                    onClick={() => handleSimulate(true)}
                    className="w-full rounded-2xl h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    Simulate Payment Success
                  </Button>
                  <Button
                    onClick={() => handleSimulate(false)}
                    variant="outline"
                    className="w-full rounded-2xl h-11 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold flex items-center justify-center gap-1.5"
                  >
                    Simulate Payment Failure
                  </Button>
                </div>
              </>
            )}

            {paymentState === 'processing' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-6">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                  <Loader2 className="w-16 h-16 text-primary-600 animate-spin absolute" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800">Processing Online Payment</h4>
                  <p className="text-xs text-slate-500 font-medium animate-pulse max-w-[280px] mx-auto min-h-[32px]">
                    {processingTexts[processingStep]}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 select-none">
                  <Lock className="w-3 h-3" /> Secure Sandbox Node
                </div>
              </div>
            )}

            {paymentState === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 shadow-md">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-lg">Transaction Approved</h4>
                  <p className="text-xs text-emerald-600 font-bold">Verification complete. Redirecting...</p>
                </div>
                <div className="w-full max-w-[260px] bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] text-slate-500 text-left font-mono space-y-1 mt-4">
                  <div className="flex justify-between">
                    <span>STATUS:</span>
                    <span className="text-emerald-600 font-bold">SUCCESS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GATEWAY:</span>
                    <span>SANDBOX SIM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VERIFICATION:</span>
                    <span>BYPASSED</span>
                  </div>
                </div>
              </div>
            )}

            {paymentState === 'failure' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 shadow-md">
                  <AlertCircle className="w-10 h-10 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-lg">Transaction Failed</h4>
                  <p className="text-xs text-rose-500 font-bold">Insufficient funds or bank rejection.</p>
                </div>
                <p className="text-xs text-slate-400 max-w-[240px]">
                  Returning you to the checkout payment options in standard fallback mode.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
