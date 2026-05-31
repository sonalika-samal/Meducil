import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Health Blog | Meducil',
  description: 'Read the latest articles on homoeopathy, natural healing, and lifestyle wellness.',
};

export default function BlogPage() {
  const dummyPosts = [
    {
      id: 1,
      title: 'The Principles of Natural Healing in Homoeopathy',
      excerpt: 'Discover how homoeopathy works with your body to stimulate natural healing processes without harmful side effects.',
      date: 'May 10, 2026',
    },
    {
      id: 2,
      title: 'Managing Chronic Migraines Naturally',
      excerpt: 'A comprehensive guide on how homoeopathic treatments can reduce the frequency and intensity of migraines.',
      date: 'May 05, 2026',
    },
    {
      id: 3,
      title: 'Boosting Immunity for Changing Seasons',
      excerpt: 'Simple lifestyle changes and homoeopathic remedies to keep your immune system strong year-round.',
      date: 'April 28, 2026',
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Health Advice Blog</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Insights, tips, and articles from our experts on maintaining perfect health naturally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dummyPosts.map(post => (
          <div key={post.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-shadow bg-white">
            <p className="text-sm text-primary-600 font-semibold mb-2">{post.date}</p>
            <h2 className="text-xl font-bold text-slate-900 mb-3">{post.title}</h2>
            <p className="text-slate-600 mb-6">{post.excerpt}</p>
            <Link href={`#`} className="text-primary-600 font-medium hover:underline">
              Read Article &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
