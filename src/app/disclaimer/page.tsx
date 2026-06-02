import { AlertOctagon, HeartHandshake, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Medical Disclaimer | Meducil',
  description: 'Read the official homeopathic medical disclaimer and guidance for purchasing formulations on Meducil.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-2">
          <div className="inline-flex items-center space-x-2 bg-rose-50 text-rose-700 px-4 py-1.5 rounded-full border border-rose-100 mb-6">
            <AlertOctagon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Clinical Notice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            Medical Disclaimer
          </h1>
          <p className="text-lg text-slate-600">
            Important regulatory notice and clinical guidance regarding homeopathic formulations and remedies.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm space-y-8 text-slate-600 leading-relaxed text-sm">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-rose-600" />
              1. General Information Only
            </h2>
            <p>
              The information and descriptions of homeopathic remedies, wellness guidelines, and dilution characteristics on Meducil are provided for **general educational purposes only**. They do not constitute specific medical advice, diagnostics, or therapeutic prescription.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-rose-600" />
              2. No Medical Relationship
            </h2>
            <p>
              Browsing this e-commerce site, purchasing wellness products, or submitting a contact form does not establish a doctor-patient relationship with Dr. Ganesh Kumar Das or any clinical consultant. Always consult a registered medical practitioner before starting any new remedy or changing existing treatments.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">3. Individual Variances & Side Effects</h2>
            <p>
              Homeopathic medicines are highly customized based on constitutional symptoms. The therapeutic actions listed on descriptions are standard historical attributes and may vary across individuals. While homeopathy is safe and generally free of side effects, seek immediate professional help if your symptoms worsen or persist.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">4. Emergency Situations</h2>
            <p>
              Meducil does not handle medical emergencies or acute clinical situations. In the event of an urgent health crisis or severe acute symptom, please immediately contact your nearest hospital or local emergency helpline.
            </p>
          </section>

          <div className="border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
            Last Updated: June 2026 | Meducil Homeopathic Clinic Fulfillment Desk
          </div>
        </div>

      </div>
    </div>
  );
}
