import { ShieldCheck, Leaf, HeartPulse, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary-600" />,
      title: '20+ Years Experience',
      description: 'Decades of clinical expertise ensuring you receive the highest standard of homoeopathic care.',
      bgColor: 'bg-primary-50',
    },
    {
      icon: <Leaf className="h-8 w-8 text-secondary-600" />,
      title: 'Natural Healing',
      description: 'Treatments that work in harmony with your body to stimulate natural healing processes.',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: <HeartPulse className="h-8 w-8 text-rose-500" />,
      title: 'Personalized Treatment',
      description: 'Every treatment plan is customized specifically to your unique symptoms and constitution.',
      bgColor: 'bg-rose-50',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-accent-600" />,
      title: 'No Side Effects',
      description: 'Safe, gentle, and highly diluted medicines that are effective without harmful side effects.',
      bgColor: 'bg-accent-50',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-3">Why Choose Meducil</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">A Better Approach to Your Health</h3>
          <p className="text-slate-600 text-lg">
            We believe in treating the person, not just the disease. Our holistic approach ensures long-lasting health benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
