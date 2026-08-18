import { Calendar, Clock, User, ArrowRight, Search, X } from 'lucide-react';
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
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
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
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Blog',
                    name: 'CareLink NEMT Insights & Healthcare Guides',
                    description: BLOG_DESCRIPTION,
                    blogPost: posts.map((post) => ({
                        '@type': 'BlogPosting',
                        headline: post.title,
                        url: `${window.location.origin}/blog`,
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
                        <article
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
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

                                    <h3 className="text-lg leading-snug font-black text-slate-900 transition-colors group-hover:text-[#004B87]">
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
                        </article>
                    ))}
                </div>

                {/* Reader View Modal */}
                {selectedPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
                        <div className="relative my-8 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                            <div className="relative h-64 w-full shrink-0 overflow-hidden sm:h-80">
                                <img
                                    src={selectedPost.image}
                                    alt={selectedPost.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="absolute top-4 right-4 rounded-full bg-slate-900/80 p-2 text-white transition-colors hover:bg-slate-900"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="absolute right-6 bottom-6 left-6 space-y-2 text-white">
                                    <span className="inline-block rounded-full bg-[#E64A19] px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-md">
                                        {selectedPost.category}
                                    </span>
                                    <h2 className="text-2xl leading-tight font-black sm:text-3xl">
                                        {selectedPost.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                                        <span>By {selectedPost.author}</span>
                                        <span>•</span>
                                        <span>{selectedPost.published_at}</span>
                                        <span>•</span>
                                        <span>{selectedPost.read_time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 overflow-y-auto p-6 text-xs leading-relaxed text-slate-700 sm:p-8 sm:text-sm">
                                <p className="rounded-r-xl border-l-4 border-[#E64A19] bg-orange-50 py-1 pl-4 text-sm font-bold text-[#004B87] italic">
                                    "{selectedPost.summary}"
                                </p>

                                <div className="space-y-4">
                                    <p>{selectedPost.content}</p>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
                                    <button
                                        onClick={() => setSelectedPost(null)}
                                        className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200"
                                    >
                                        Close Article
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
