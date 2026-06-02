import Link from 'next/link';
import { ArrowRight, Activity, Pill, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

export function ServicesSection() {
  const services = [
    {
      id: 'remedies',
      title: 'Authentic Remedies',
      description: 'We source 100% authentic homoeopathic medicines directly from globally certified laboratories like SBL, Dr. Reckeweg, and Schwabe India.',
      icon: <Activity className="h-10 w-10 text-primary-500" />,
      color: 'bg-primary-50',
      link: '/medicines'
    },
    {
      id: 'medicine',
      title: 'Online Medicine Delivery',
      description: 'Get your prescribed homoeopathic medicines delivered directly to your doorstep. We ensure authentic, high-quality dilutions and remedies.',
      icon: <Pill className="h-10 w-10 text-secondary-500" />,
      color: 'bg-secondary-50',
      link: '/services#medicine'
    },
    {
      id: 'guidance',
      title: 'Health Guidance',
      description: 'Holistic lifestyle and dietary advice to complement your homoeopathic treatment and accelerate your journey to complete wellness.',
      icon: <Heart className="h-10 w-10 text-rose-500" />,
      color: 'bg-rose-50',
      link: '/services#guidance'
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-3">Our Services</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Comprehensive Homoeopathic Care</h3>
          </div>
          <Link href="/services">
            <Button variant="outline" className="shrink-0">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className={`h-2 w-full ${service.id === 'consultation' ? 'bg-primary-500' : service.id === 'medicine' ? 'bg-secondary-500' : 'bg-rose-500'}`} />
              <CardContent className="p-8">
                <div className={`w-20 h-20 rounded-full ${service.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h4>
                <p className="text-slate-600 leading-relaxed mb-8">
                  {service.description}
                </p>
                <Link href={service.link} className="inline-flex items-center font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
