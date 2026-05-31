import { CalendarCheck, CreditCard, Video } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Choose Time',
      description: 'Select a consultation duration (10, 20, or 30 mins) and pick a time slot that works best for you.',
      icon: <CalendarCheck className="h-8 w-8 text-primary-600" />
    },
    {
      number: '02',
      title: 'Pay Online',
      description: 'Complete a secure payment using our Razorpay integration to confirm your booking instantly.',
      icon: <CreditCard className="h-8 w-8 text-primary-600" />
    },
    {
      number: '03',
      title: 'Consult Instantly',
      description: 'Join the secure video or audio call room at the scheduled time to talk directly with the doctor.',
      icon: <Video className="h-8 w-8 text-primary-600" />
    }
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary-400 tracking-wider uppercase mb-3">Simple Process</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h3>
          <p className="text-slate-400 text-lg">
            Getting expert homoeopathic care is now easier than ever. Follow these three simple steps to start your healing journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-800 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center mb-8 relative z-10 shadow-2xl">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-bold text-white border-4 border-slate-900">
                  {step.number}
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
              <p className="text-slate-400 leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
