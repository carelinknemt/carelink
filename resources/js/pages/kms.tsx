import { Head } from '@inertiajs/react';
import {
    BookOpen,
    ChevronRight,
    Info,
    Lightbulb,
    Search,
    TriangleAlert,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import GuidedTour from '@/components/kms/guided-tour';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type {
    KmsArticle,
    KmsBlock,
    KmsCalloutVariant,
    KmsCategory,
} from '@/data/kms-docs';
import { kmsCategories } from '@/data/kms-docs';
import { KMS_CATEGORY_ICONS } from '@/data/kms-icons';
import { kmsTours } from '@/data/kms-tours';
import { cn } from '@/lib/utils';
import { dashboard, kms } from '@/routes';

const CALLOUT_STYLES: Record<
    KmsCalloutVariant,
    { box: string; icon: typeof Info; iconColor: string }
> = {
    info: {
        box: 'border-sky-200 bg-sky-50',
        icon: Info,
        iconColor: 'text-sky-700',
    },
    tip: {
        box: 'border-emerald-200 bg-emerald-50',
        icon: Lightbulb,
        iconColor: 'text-emerald-700',
    },
    warning: {
        box: 'border-amber-200 bg-amber-50',
        icon: TriangleAlert,
        iconColor: 'text-amber-700',
    },
};

function parseHash(hash: string): [string | null, string | null] {
    const [category, article] = hash.replace(/^#\/?/, '').split('/');

    return [category || null, article || null];
}

function blockText(block: KmsBlock): string {
    switch (block.type) {
        case 'paragraph':
            return block.text;
        case 'steps':
            return [block.title ?? '', ...block.items].join(' ');
        case 'callout':
            return `${block.title ?? ''} ${block.text}`;
        case 'table':
            return [
                block.title ?? '',
                ...block.headers,
                ...block.rows.flat(),
            ].join(' ');
    }
}

function articleMatches(article: KmsArticle, query: string): boolean {
    const haystack = [
        article.title,
        article.summary,
        ...article.blocks.map(blockText),
    ]
        .join(' ')
        .toLowerCase();

    return haystack.includes(query);
}

function KmsCallout({
    block,
}: {
    block: Extract<KmsBlock, { type: 'callout' }>;
}) {
    const style = CALLOUT_STYLES[block.variant];
    const Icon = style.icon;

    return (
        <div className={cn('rounded-lg border p-4', style.box)}>
            <div className="flex items-start gap-3">
                <Icon
                    className={cn('mt-0.5 size-5 shrink-0', style.iconColor)}
                />
                <div>
                    {block.title && (
                        <p className="text-sm font-medium">{block.title}</p>
                    )}
                    <p className="text-sm">{block.text}</p>
                </div>
            </div>
        </div>
    );
}

function KmsBlocks({ blocks }: { blocks: KmsBlock[] }) {
    return (
        <div className="flex flex-col gap-5">
            {blocks.map((block, index) => {
                if (block.type === 'paragraph') {
                    return (
                        <p key={index} className="text-sm leading-relaxed">
                            {block.text}
                        </p>
                    );
                }

                if (block.type === 'steps') {
                    return (
                        <section
                            key={index}
                            id={`block-${index}`}
                            className="scroll-mt-24"
                        >
                            {block.title && (
                                <h3 className="mb-3 text-sm font-semibold">
                                    {block.title}
                                </h3>
                            )}
                            <ol className="flex flex-col gap-2.5">
                                {block.items.map((item, stepIndex) => (
                                    <li
                                        key={stepIndex}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                            {stepIndex + 1}
                                        </span>
                                        <p className="text-sm leading-relaxed">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    );
                }

                if (block.type === 'callout') {
                    return <KmsCallout key={index} block={block} />;
                }

                if (block.type === 'table') {
                    return (
                        <section
                            key={index}
                            id={`block-${index}`}
                            className="scroll-mt-24"
                        >
                            {block.title && (
                                <h3 className="mb-3 text-sm font-semibold">
                                    {block.title}
                                </h3>
                            )}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {block.headers.map((header) => (
                                                <TableHead key={header}>
                                                    {header}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {block.rows.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <TableCell
                                                        key={cellIndex}
                                                        className="align-top"
                                                    >
                                                        {cell}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </section>
                    );
                }

                return null;
            })}
        </div>
    );
}

function ArticleView({
    article,
    category,
    onBack,
}: {
    article: KmsArticle;
    category: KmsCategory;
    onBack: () => void;
}) {
    const toc: { title: string; index: number }[] = article.blocks.flatMap(
        (block, index) =>
            'title' in block && block.title
                ? [{ title: block.title, index }]
                : [],
    );
    const tour = kmsTours[article.slug];

    function jumpTo(index: number) {
        document
            .getElementById(`block-${index}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                    <span>{category.title}</span>
                    <ChevronRight className="size-3" />
                    <span className="text-foreground">{article.title}</span>
                </div>
                <CardTitle className="text-2xl">{article.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                    {article.summary}
                </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                {toc.length > 0 && (
                    <nav className="rounded-lg border border-border bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-semibold tracking-wide uppercase">
                            On this page
                        </p>
                        <ul className="flex flex-col items-start gap-1">
                            {toc.map(({ title, index }) => (
                                <li key={index}>
                                    <button
                                        type="button"
                                        onClick={() => jumpTo(index)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                <KmsBlocks blocks={article.blocks} />
                {tour && (
                    <GuidedTour
                        simulation={tour.simulation}
                        steps={tour.steps}
                    />
                )}
                <div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onBack}
                    >
                        <ChevronRight className="size-4 rotate-180" />
                        All topics
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function SearchResults({
    results,
    onOpen,
}: {
    results: { category: KmsCategory; article: KmsArticle }[];
    onOpen: (category: KmsCategory, article: KmsArticle) => void;
}) {
    if (results.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                    <Search className="size-8 text-muted-foreground" />
                    <p className="font-medium">No articles found</p>
                    <p className="text-sm text-muted-foreground">
                        Try a different word, for example "booking" or
                        "password".
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="flex flex-col divide-y">
                {results.map(({ category, article }) => (
                    <button
                        key={`${category.slug}/${article.slug}`}
                        type="button"
                        className="flex items-start justify-between gap-4 py-4 text-left hover:bg-slate-50"
                        onClick={() => onOpen(category, article)}
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-medium">
                                {article.title}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {article.summary}
                            </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                            {category.title}
                        </Badge>
                    </button>
                ))}
            </CardContent>
        </Card>
    );
}

function KmsHome({
    onOpen,
}: {
    onOpen: (category: KmsCategory, article: KmsArticle) => void;
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {kmsCategories.map((category) => {
                const Icon = KMS_CATEGORY_ICONS[category.slug] ?? BookOpen;

                return (
                    <Card
                        key={category.slug}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                    >
                        <button
                            type="button"
                            className="flex h-full w-full flex-col gap-3 p-6 text-left"
                            onClick={() =>
                                onOpen(category, category.articles[0])
                            }
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-5" />
                                </span>
                                <Badge variant="secondary">
                                    {category.articles.length}{' '}
                                    {category.articles.length === 1
                                        ? 'article'
                                        : 'articles'}
                                </Badge>
                            </div>
                            <div>
                                <p className="font-semibold">
                                    {category.title}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {category.summary}
                                </p>
                            </div>
                        </button>
                    </Card>
                );
            })}
        </div>
    );
}

export default function KmsPage() {
    const [routeHash, setRouteHash] = useState(() => window.location.hash);
    const [targetHash, setTargetHash] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [categorySlug, setCategorySlug] = useState<string>(() => {
        const [category] = parseHash(window.location.hash);

        return category ?? kmsCategories[0].slug;
    });

    useEffect(() => {
        const onHashChange = () => setRouteHash(window.location.hash);

        window.addEventListener('hashchange', onHashChange);

        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    useEffect(() => {
        if (targetHash === null) {
            return;
        }

        window.location.hash = targetHash;
    }, [targetHash]);

    const [hashCategorySlug, hashArticleSlug] = useMemo(
        () => parseHash(routeHash),
        [routeHash],
    );

    const results = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (normalized === '') {
            return [];
        }

        return kmsCategories.flatMap((category) =>
            category.articles
                .filter((article) => articleMatches(article, normalized))
                .map((article) => ({ category, article })),
        );
    }, [query]);

    const searching = query.trim() !== '';

    const category =
        kmsCategories.find(
            (candidate) => candidate.slug === hashCategorySlug,
        ) ?? null;
    const article =
        category?.articles.find(
            (candidate) => candidate.slug === hashArticleSlug,
        ) ?? null;

    function openArticle(nextCategory: KmsCategory, nextArticle: KmsArticle) {
        setQuery('');
        setCategorySlug(nextCategory.slug);
        setTargetHash(`/${nextCategory.slug}/${nextArticle.slug}`);
        window.scrollTo({ top: 0 });
    }

    function goHome() {
        setTargetHash('');
        window.scrollTo({ top: 0 });
    }

    function changeCategory(nextSlug: string) {
        setCategorySlug(nextSlug);
        const next = kmsCategories.find(
            (candidate) => candidate.slug === nextSlug,
        );

        if (next) {
            openArticle(next, next.articles[0]);
        }
    }

    const mobileCategory =
        kmsCategories.find((candidate) => candidate.slug === categorySlug) ??
        kmsCategories[0];
    const mobileArticle =
        mobileCategory.articles.find(
            (candidate) => candidate.slug === hashArticleSlug,
        ) ?? mobileCategory.articles[0];

    return (
        <>
            <Head title="Knowledge Base">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Knowledge Base
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Step-by-step guides for every page and task in the
                            CareLink dashboard. Many articles include an
                            interactive demo with a guided tour.
                        </p>
                    </div>
                </div>

                <div className="relative sm:max-w-md">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search the guide, for example 'cancel booking'…"
                        className="pl-9"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>

                <main className="flex min-w-0 flex-col gap-4">
                    {!searching && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                            <div className="grid gap-1.5">
                                <Select
                                    value={mobileCategory.slug}
                                    onValueChange={changeCategory}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kmsCategories.map((option) => (
                                            <SelectItem
                                                key={option.slug}
                                                value={option.slug}
                                            >
                                                {option.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-1.5">
                                <Select
                                    value={mobileArticle.slug}
                                    onValueChange={(slug) => {
                                        const next =
                                            mobileCategory.articles.find(
                                                (candidate) =>
                                                    candidate.slug === slug,
                                            );

                                        if (next) {
                                            openArticle(mobileCategory, next);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mobileCategory.articles.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.slug}
                                                    value={option.slug}
                                                >
                                                    {option.title}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    {searching ? (
                        <SearchResults results={results} onOpen={openArticle} />
                    ) : article && category ? (
                        <ArticleView
                            article={article}
                            category={category}
                            onBack={goHome}
                        />
                    ) : (
                        <KmsHome onOpen={openArticle} />
                    )}
                </main>
            </div>
        </>
    );
}

KmsPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Knowledge Base',
            href: kms(),
        },
    ],
};
