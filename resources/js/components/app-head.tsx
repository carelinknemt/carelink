import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface JsonLdNode {
    '@context': string;
    '@type': string;
    [key: string]: unknown;
}

interface AppHeadProps {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    robots?: string;
    image?: string;
    type?: string;
    jsonLd?: JsonLdNode | JsonLdNode[];
    children?: ReactNode;
}

const SITE_NAME = 'CareLink';
const DEFAULT_OG_IMAGE = '/images/Img-Carelink-hero.webp';

function toAbsolute(url: string): string {
    if (/^https?:\/\//.test(url)) {
        return url;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}

export default function AppHead({
    title,
    description,
    keywords,
    canonical,
    robots = 'index, follow',
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    jsonLd,
    children,
}: AppHeadProps) {
    const pageUrl = canonical
        ? toAbsolute(canonical)
        : typeof window !== 'undefined'
          ? window.location.href
          : undefined;
    const ogImage = toAbsolute(image);
    const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;

    return (
        <Head title={title}>
            {description && <meta name="description" content={description} />}
            {keywords && keywords.length > 0 && (
                <meta name="keywords" content={keywords.join(', ')} />
            )}
            <meta name="robots" content={robots} />
            {pageUrl && <link rel="canonical" href={pageUrl} />}

            {/* Open Graph */}
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            {description && (
                <meta property="og:description" content={description} />
            )}
            {pageUrl && <meta property="og:url" content={pageUrl} />}
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={title || SITE_NAME} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            {description && (
                <meta name="twitter:description" content={description} />
            )}
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data */}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}

            {children}
        </Head>
    );
}
