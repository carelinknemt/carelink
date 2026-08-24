import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Search, User } from 'lucide-react';
import { useState } from 'react';
import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import { usePageHero } from '@/lib/cms';
import type { BlogPost } from '@/types/carelink';

interface BlogProps {
    posts: BlogPost[];
}

const BLOG_DESCRIPTION =
    'Educational NEMT articles on securing Medi-Cal transportation vouchers, organizing dialysis rides, wheelchair care, and hospital discharge efficiency across Humboldt, Del Norte, Trinity, and Shasta counties.';

export default function Blog({ posts }: BlogProps) {
    const hero = usePageHero('blog');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    const categories = [
        'ALL',
        'MEDI-CAL & BILLING',
        'HOSPITAL DISCHARGE',
        'WHEELCHAIR CARE',
        'RURAL NEMT',
    ];

    const filteredPosts = posts.filter((post) => {
        const matchesCategory =
            selectedCategory === 'ALL' ||
            post.category.toUpperCase().includes(selectedCategory);
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.summary.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="NEMT Insights & Healthcare Guides"
                description={BLOG_DESCRIPTION}
                keywords={[
                    'NEMT blog',
                    'Medi-Cal transportation vouchers',
                    'dialysis ride tips',
                    'hospital discharge guide',
                    'wheelchair transportation care',
                    'rural medical transport',
                ]}
                canonical="/blog"
                type="article"
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Blog', path: '/blog' },
                ]}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Blog',
                    name: 'CareLink NEMT Insights & Healthcare Guides',
                    description: BLOG_DESCRIPTION,
                    blogPost: posts.map((post) => ({
                        '@type': 'BlogPosting',
                        headline: post.title,
                        url: `${window.location.origin}/blog/${post.slug}`,
                        datePublished: post.published_at,
                        author: {
                            '@type': 'Person',
                            name: post.author,
                        },
                        image: post.image,
                        description: post.summary,
                    })),
                }}
            />

            <PageHero
                title={hero.title || 'NEMT Insights & Healthcare Guides'}
                subtitle={
                    hero.subtitle ||
                    'Educational articles on securing Medi-Cal transportation vouchers, organizing dialysis rides, and hospital discharge efficiency across Humboldt, Del Norte, Trinity, and Shasta counties.'
                }
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-12">
                {/* Filter and Search Bar */}
                <div className="flex flex-col items-stretch justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:flex-row md:items-center">
                    <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-[#E64A19] text-white shadow-md shadow-orange-900/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat === 'ALL' ? 'All Articles' : cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative min-w-[240px]">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder-slate-400 focus:border-[#E64A19] focus:bg-white focus:outline-none"
                        />
                    </div>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            prefetch
                            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
                        >
                            <div>
                                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black tracking-wider text-[#004B87] uppercase shadow-sm backdrop-blur-md">
                                        {post.category}
                                    </span>
                                </div>

                                <div className="space-y-3 p-6">
                                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-[#E64A19]" />
                                            {post.published_at}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-[#E64A19]" />
                                            {post.read_time}
                                        </span>
                                    </div>

                                    <h3 className="text-lg leading-snug font-black text-[#E64A19] transition-colors group-hover:text-[#004B87]">
                                        {post.title}
                                    </h3>

                                    <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">
                                        {post.summary}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 p-6 pt-0">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                    <User className="h-3.5 w-3.5 text-[#E64A19]" />
                                    <span>{post.author}</span>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E64A19] transition-transform group-hover:translate-x-1">
                                    <span>Read Guide</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
