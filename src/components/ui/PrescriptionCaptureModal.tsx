'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { Button } from './Button';

interface PrescriptionCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64: string, mimeType: string) => void;
}

export function PrescriptionCaptureModal({ isOpen, onClose, onCapture }: PrescriptionCaptureModalProps) {
  const [tab, setTab] = useState<'upload' | 'capture'>('upload');
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setError("Unable to access camera. Please verify camera permissions or switch to file upload.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && tab === 'capture') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, tab]);

  const handleFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file (PNG, JPG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onCapture(base64, file.type);
      onClose();
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg');
      onCapture(base64, 'image/jpeg');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl relative z-[10000] font-sans flex flex-col overflow-hidden max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Prescription Search</h3>
                <p className="text-xs text-slate-500 mt-0.5">Search for medicines using a prescription photo or label</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Selector */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-5 shrink-0">
              <button
                onClick={() => { setTab('upload'); setError(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                  tab === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 bg-transparent'
                }`}
              >
                <Upload className="w-3.5 h-3.5 inline mr-1.5" /> Upload File
              </button>
              <button
                onClick={() => { setTab('capture'); setError(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                  tab === 'capture' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 bg-transparent'
                }`}
              >
                <Camera className="w-3.5 h-3.5 inline mr-1.5" /> Take Photo
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-semibold flex gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Tab Contents */}
            <div className="flex-grow min-h-0 flex flex-col justify-center items-center">
              {tab === 'upload' ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`w-full py-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-primary-500 bg-primary-50/30'
                      : 'border-slate-200 hover:border-primary-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Drag & drop your image here</p>
                  <p className="text-[10px] text-slate-400 mt-1">or click to browse files</p>
                  <div className="flex gap-4 mt-6 text-[10px] text-slate-400 border-t border-slate-100 pt-4 w-10/12 justify-center">
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> JPEG / PNG</span>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center">
                  {cameraActive ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-inner">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover scale-x-[-1]" // mirror view
                        />
                        <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                      </div>
                      
                      {/* Capture Trigger Button */}
                      <button
                        onClick={handleCapture}
                        className="mt-6 w-14 h-14 rounded-full border-4 border-slate-200 bg-red-600 hover:bg-red-700 shadow-lg active:scale-95 transition-all flex items-center justify-center group cursor-pointer"
                        title="Capture Photo"
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-white/60 bg-transparent flex items-center justify-center">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Camera Access Pending</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">We need access to your webcam or device camera.</p>
                      <Button
                        onClick={startCamera}
                        className="mt-4 bg-slate-900 text-white hover:bg-slate-800 text-xs py-2 px-4 rounded-xl"
                      >
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Retry Camera Access
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
