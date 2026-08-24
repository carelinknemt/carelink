import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface JsonLdNode {
    '@context': string;
    '@type': string;
    [key: string]: unknown;
}

export interface BreadcrumbEntry {
    name: string;
    path: string;
}

interface AppHeadProps {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    robots?: string;
    image?: string;
    type?: string;
    breadcrumbs?: BreadcrumbEntry[];
    jsonLd?: JsonLdNode | JsonLdNode[];
    children?: ReactNode;
}

const SITE_NAME = 'CareLink';
const DEFAULT_OG_IMAGE = '/images/non-emergency-medical-transportation.png';
const DEFAULT_DESCRIPTION =
    'CareLink provides dependable non-emergency medical transportation across Northern California with wheelchair vans, dialysis rides, hospital discharge transport, and group shuttles.';

function toAbsolute(url: string): string {
    if (/^https?:\/\//.test(url)) {
        return url;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}

function composeTitle(title?: string): string {
    if (!title) {
        return SITE_NAME;
    }

    return title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`;
}

function websiteJsonLd(origin: string): JsonLdNode {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
    };
}

function breadcrumbJsonLd(
    origin: string,
    breadcrumbs: BreadcrumbEntry[],
): JsonLdNode {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `${origin}${crumb.path}`,
        })),
    };
}

function flattenJsonLd(nodes: JsonLdNode | JsonLdNode[]): JsonLdNode[] {
    return Array.isArray(nodes) ? nodes : [nodes];
}

export default function AppHead({
    title,
    description,
    keywords,
    canonical,
    robots = 'index, follow',
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    breadcrumbs,
    jsonLd,
    children,
}: AppHeadProps) {
    const pageUrl = canonical
        ? toAbsolute(canonical)
        : typeof window !== 'undefined'
          ? window.location.href
          : undefined;
    const ogImage = toAbsolute(image);
    const fullTitle = composeTitle(title);

    const graph: JsonLdNode[] = [
        ...(typeof window !== 'undefined'
            ? [websiteJsonLd(window.location.origin)]
            : []),
        ...flattenJsonLd(jsonLd ?? []),
        ...(breadcrumbs && breadcrumbs.length > 0
            ? [breadcrumbJsonLd(window.location.origin, breadcrumbs)]
            : []),
    ];

    return (
        <Head title={fullTitle}>
            <meta
                head-key="description"
                name="description"
                content={description || DEFAULT_DESCRIPTION}
            />
            {keywords && keywords.length > 0 && (
                <meta
                    head-key="keywords"
                    name="keywords"
                    content={keywords.join(', ')}
                />
            )}
            <meta head-key="robots" name="robots" content={robots} />
            {pageUrl && (
                <link head-key="canonical" rel="canonical" href={pageUrl} />
            )}

            {/* Open Graph */}
            <meta head-key="og:site_name" property="og:site_name" content={SITE_NAME} />
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:title" property="og:title" content={fullTitle} />
            <meta
                head-key="og:description"
                property="og:description"
                content={description || DEFAULT_DESCRIPTION}
            />
            {pageUrl && (
                <meta head-key="og:url" property="og:url" content={pageUrl} />
            )}
            <meta head-key="og:image" property="og:image" content={ogImage} />
            <meta
                head-key="og:image:alt"
                property="og:image:alt"
                content={title || SITE_NAME}
            />
            <meta head-key="og:locale" property="og:locale" content="en_US" />

            {/* Twitter Card */}
            <meta
                head-key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            <meta head-key="twitter:title" name="twitter:title" content={fullTitle} />
            <meta
                head-key="twitter:description"
                name="twitter:description"
                content={description || DEFAULT_DESCRIPTION}
            />
            <meta head-key="twitter:image" name="twitter:image" content={ogImage} />

            {/* Structured Data */}
            {graph.length > 0 && (
                <script
                    key="ld-json-graph"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
                />
            )}

            {children}
        </Head>
    );
}
