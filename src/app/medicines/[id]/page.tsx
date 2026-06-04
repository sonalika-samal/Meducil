export const dynamic = 'force-dynamic';

import ProductDetailClient from './ProductDetailClient';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-white pt-8 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <ProductDetailClient productId={resolvedParams.id} />
      </div>
    </div>
  );
}
