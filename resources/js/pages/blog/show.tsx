import { Link } from '@inertiajs/react';
import { Calendar, Clock, User } from 'lucide-react';
import AppHead from '@/components/app-head';
import type { BlogPost } from '@/types/carelink';

interface BlogShowProps {
    post: BlogPost;
    recent_posts: BlogPost[];
}

function paragraphs(content: string): string[] {
    return content
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0);
}

export default function BlogShow({ post, recent_posts }: BlogShowProps) {
    const bodyParagraphs = paragraphs(post.content);

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title={post.title}
                description={post.summary}
                keywords={[
                    post.category,
                    'CareLink NEMT',
                    'medical transportation',
                ]}
                canonical={`/blog/${post.slug}`}
                type="article"
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Blog', path: '/blog' },
                    { name: post.title, path: `/blog/${post.slug}` },
                ]}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: post.title,
                    description: post.summary || post.excerpt,
                    image: post.image.startsWith('http')
                        ? post.image
                        : `${window.location.origin}${post.image}`,
                    datePublished: post.published_at
                        ? new Date(post.published_at).toISOString()
                        : undefined,
                    author: {
                        '@type': 'Person',
                        name: post.author,
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'CareLink Medical Transportation',
                    },
                }}
            />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
                <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                    <div className="relative h-72 w-full overflow-hidden sm:h-96">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                        <div className="absolute right-6 bottom-6 left-6 space-y-3 text-white">
                            <span className="inline-block rounded-full bg-[#E64A19] px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-md">
                                {post.category}
                            </span>
                            <h1 className="text-3xl leading-tight font-black sm:text-4xl">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                                <span className="inline-flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" />
                                    By {post.author}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {post.published_at}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    {post.read_time}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 p-6 sm:p-10">
                        {post.summary && (
                            <p className="rounded-r-xl border-l-4 border-[#E64A19] bg-orange-50 py-2 pl-5 text-base font-bold text-[#004B87] italic">
                                "{post.summary}"
                            </p>
                        )}

                        <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base">
                            {bodyParagraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </article>

                {recent_posts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-xl font-black tracking-tight text-[#004B87]">
                            More from the Carelink Blog
                        </h2>
                        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {recent_posts.map((recent) => (
                                <Link
                                    key={recent.id}
                                    href={`/blog/${recent.slug}`}
                                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="h-40 w-full overflow-hidden">
                                        <img
                                            src={recent.image}
                                            alt={recent.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="space-y-2 p-5">
                                        <span className="text-[10px] font-black tracking-wider text-[#E64A19] uppercase">
                                            {recent.category}
                                        </span>
                                        <h3 className="line-clamp-2 text-sm leading-snug font-bold text-slate-900 group-hover:text-[#E64A19]">
                                            {recent.title}
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            {recent.published_at} ·{' '}
                                            {recent.read_time}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
