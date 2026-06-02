import { Suspense } from 'react';
import MedicinesClient from './MedicinesClient';

export const metadata = {
  title: 'Homeopathic Medicines | Meducil',
  description: 'Browse our extensive collection of high-quality homeopathic medicines.',
};

export default function MedicinesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Medicines</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Discover natural, effective homeopathic remedies for your health and wellness. 
            Select a category below to find the right medicine for you.
          </p>
        </div>
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading medicines...</div>}>
          <MedicinesClient />
        </Suspense>
      </div>
    </div>
  );
}
