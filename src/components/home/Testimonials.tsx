import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Patient',
      text: 'I had been struggling with chronic migraines for years. After just a few months of consultation with Meducil, my frequency of attacks has reduced significantly. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Rahul Desai',
      role: 'Patient',
      text: 'The convenience of online consultation and direct medicine delivery is unmatched. The doctor was very patient and listened to all my problems before prescribing.',
      rating: 5,
    },
    {
      name: 'Anita Verma',
      role: 'Patient',
      text: 'I love that the treatments are completely natural and have no side effects. It’s a very gentle approach to healing that works wonders for my immunity.',
      rating: 4,
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-3">Testimonials</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">What Our Patients Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 relative mt-6">
              <div className="absolute -top-6 left-8 bg-primary-600 rounded-full p-3 shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <CardContent className="pt-12 pb-8 px-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent-500 fill-accent-500' : 'text-slate-300'}`} />
                  ))}
                </div>
                <p className="text-slate-700 italic leading-relaxed mb-8">
                  "{testimonial.text}"
                </p>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
