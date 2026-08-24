<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline script to apply saved accessibility settings before first paint (mirrors resources/js/components/carelink/accessibility-widget.tsx) --}}
        <script>
            (function() {
                try {
                    const saved = JSON.parse(localStorage.getItem('ssd_accessibility_settings_v2'));

                    if (!saved || typeof saved !== 'object') {
                        return;
                    }

                    const root = document.documentElement;
                    const fontSizes = { '100%': 'a11y-font-100', '110%': 'a11y-font-110', '120%': 'a11y-font-120', '130%': 'a11y-font-130', '140%': 'a11y-font-140', '150%': 'a11y-font-150' };
                    const toggles = {
                        highContrast: 'a11y-high-contrast',
                        invertColors: 'a11y-invert-colors',
                        grayscale: 'a11y-grayscale',
                        saturate: 'a11y-saturate',
                        dyslexiaFont: 'a11y-dyslexia',
                        highlightLinks: 'a11y-highlight-links',
                        highlightHeadings: 'a11y-highlight-headings',
                        largeCursor: 'a11y-large-cursor',
                        hideImages: 'a11y-hide-images',
                        reduceMotion: 'a11y-reduce-motion',
                    };

                    if (fontSizes[saved.fontSize]) {
                        root.classList.add(fontSizes[saved.fontSize]);
                    }

                    if (saved.lineHeight === 'relaxed') {
                        root.classList.add('a11y-line-height-relaxed');
                    }

                    if (saved.lineHeight === 'loose') {
                        root.classList.add('a11y-line-height-loose');
                    }

                    if (saved.letterSpacing === 'wide') {
                        root.classList.add('a11y-letter-spacing-wide');
                    }

                    if (saved.letterSpacing === 'extra') {
                        root.classList.add('a11y-letter-spacing-extra');
                    }

                    Object.keys(toggles).forEach((key) => {
                        if (saved[key]) {
                            root.classList.add(toggles[key]);
                        }
                    });
                } catch (e) {
                    return;
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
            @if (request()->routeIs(['home', 'about', 'services', 'fleet', 'faq', 'blog', 'blog.show', 'careers', 'book', 'business', 'terms', 'privacy']))
                {{-- First-paint SEO/social defaults for public pages. The data-inertia keys
                     match the head-key attributes in resources/js/components/app-head.tsx so
                     Inertia adopts and replaces these tags per page on navigation. --}}
                <meta data-inertia="description" name="description" content="CareLink provides dependable non-emergency medical transportation across Northern California with wheelchair vans, dialysis rides, hospital discharge transport, and group shuttles.">
                <meta data-inertia="robots" name="robots" content="index, follow">
                <link data-inertia="canonical" rel="canonical" href="{{ url()->current() }}">
                <meta data-inertia="og:site_name" property="og:site_name" content="{{ config('app.name', 'Laravel') }}">
                <meta data-inertia="og:type" property="og:type" content="website">
                <meta data-inertia="og:title" property="og:title" content="{{ config('app.name', 'Laravel') }}">
                <meta data-inertia="og:description" property="og:description" content="CareLink provides dependable non-emergency medical transportation across Northern California with wheelchair vans, dialysis rides, hospital discharge transport, and group shuttles.">
                <meta data-inertia="og:url" property="og:url" content="{{ url()->current() }}">
                <meta data-inertia="og:image" property="og:image" content="{{ asset('images/non-emergency-medical-transportation.png') }}">
                <meta data-inertia="og:image:alt" property="og:image:alt" content="{{ config('app.name', 'Laravel') }}">
                <meta data-inertia="og:locale" property="og:locale" content="en_US">
                <meta data-inertia="twitter:card" name="twitter:card" content="summary_large_image">
                <meta data-inertia="twitter:title" name="twitter:title" content="{{ config('app.name', 'Laravel') }}">
                <meta data-inertia="twitter:description" name="twitter:description" content="CareLink provides dependable non-emergency medical transportation across Northern California with wheelchair vans, dialysis rides, hospital discharge transport, and group shuttles.">
                <meta data-inertia="twitter:image" name="twitter:image" content="{{ asset('images/non-emergency-medical-transportation.png') }}">
            @endif
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
