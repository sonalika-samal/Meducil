import { medicines } from '@/lib/data/medicines';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  return medicines.map((medicine) => ({
    id: medicine.id,
  }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <ProductDetailClient productId={params.id} />
      </div>
    </div>
  );
}
