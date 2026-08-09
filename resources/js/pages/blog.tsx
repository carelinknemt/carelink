import { Link } from '@inertiajs/react';
import { Calendar, Clock, User, ArrowRight, Search, ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';
import type { BlogPost } from '@/types/carelink';

interface BlogProps {
    posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    const categories = ['ALL', 'MEDI-CAL & BILLING', 'HOSPITAL DISCHARGE', 'WHEELCHAIR CARE', 'RURAL NEMT'];

    const filteredPosts = posts.filter((post) => {
        const matchesCategory = selectedCategory === 'ALL' || post.category.toUpperCase().includes(selectedCategory);
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.summary.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* Navigation Back Button */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#004B87] hover:bg-slate-100 transition-all border border-slate-200 shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="h-4 w-4 text-[#E64A19]" />
                        <span>Back to Overview</span>
                    </Link>
                </div>

                {/* Page Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-[#004B87] p-8 sm:p-12 text-white shadow-2xl">
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl tracking-tight leading-tight">NEMT Insights & Healthcare Guides</h1>
                        <p className="text-sm sm:text-base text-orange-100 leading-relaxed">
                            Educational articles on securing Medi-Cal transportation vouchers, organizing dialysis rides, and hospital discharge efficiency across Humboldt, Del Norte, Trinity, and Shasta counties.
                        </p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${
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
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-[#E64A19] focus:bg-white focus:outline-none"
                        />
                    </div>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <article
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                            <div>
                                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#004B87] shadow-sm uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                </div>

                                <div className="p-6 space-y-3">
                                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-[#E64A19]" />
                                            {post.published_at}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-[#E64A19]" />
                                            {post.read_time}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#004B87] transition-colors leading-snug">
                                        {post.title}
                                    </h3>

                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{post.summary}</p>
                                </div>
                            </div>

                            <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                    <User className="h-3.5 w-3.5 text-[#E64A19]" />
                                    <span>{post.author}</span>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E64A19] group-hover:translate-x-1 transition-transform">
                                    <span>Read Guide</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Reader View Modal */}
                {selectedPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
                        <div className="relative my-8 w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
                            <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
                                <img src={selectedPost.image} alt={selectedPost.title} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="absolute top-4 right-4 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-900 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                                    <span className="inline-block rounded-full bg-[#E64A19] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                                        {selectedPost.category}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black leading-tight">{selectedPost.title}</h2>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                                        <span>By {selectedPost.author}</span>
                                        <span>•</span>
                                        <span>{selectedPost.published_at}</span>
                                        <span>•</span>
                                        <span>{selectedPost.read_time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
                                <p className="text-sm font-bold text-[#004B87] border-l-4 border-[#E64A19] pl-4 py-1 italic bg-orange-50 rounded-r-xl">
                                    "{selectedPost.summary}"
                                </p>

                                <div className="space-y-4">
                                    <p>{selectedPost.content}</p>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                                    <button
                                        onClick={() => setSelectedPost(null)}
                                        className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all"
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
