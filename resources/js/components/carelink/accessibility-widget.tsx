import {
    Accessibility,
    X,
    Type,
    Eye,
    Volume2,
    RotateCcw,
    Sliders,
    Sparkles,
    Sun,
    ZapOff,
    Link,
    BookOpen,
    Check,
    MousePointer,
    Heading,
    ImageOff,
    Contrast,
    SlidersHorizontal,
    Flame,
    Focus,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface AccessibilitySettings {
    fontSize: '100%' | '110%' | '120%' | '130%' | '140%' | '150%';
    lineHeight: 'normal' | 'relaxed' | 'loose';
    letterSpacing: 'normal' | 'wide' | 'extra';
    highContrast: boolean;
    invertColors: boolean;
    grayscale: boolean;
    saturate: boolean;
    dyslexiaFont: boolean;
    highlightLinks: boolean;
    highlightHeadings: boolean;
    largeCursor: boolean;
    hideImages: boolean;
    reduceMotion: boolean;
    readingGuide: boolean;
    readingMask: boolean;
    textToSpeech: boolean;
    speechRate: number;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
    fontSize: '100%',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    highContrast: false,
    invertColors: false,
    grayscale: false,
    saturate: false,
    dyslexiaFont: false,
    highlightLinks: false,
    highlightHeadings: false,
    largeCursor: false,
    hideImages: false,
    reduceMotion: false,
    readingGuide: false,
    readingMask: false,
    textToSpeech: false,
    speechRate: 1.0,
};

const STORAGE_KEY = 'ssd_accessibility_settings_v2';

function loadSettings(): AccessibilitySettings {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return DEFAULT_SETTINGS;
        }

        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function applySettingsToRoot(settings: AccessibilitySettings): void {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;

    // 1. Font Size
    root.classList.remove(
        'a11y-font-100',
        'a11y-font-110',
        'a11y-font-120',
        'a11y-font-130',
        'a11y-font-140',
        'a11y-font-150',
    );

    if (settings.fontSize === '100%') {
        root.classList.add('a11y-font-100');
    }

    if (settings.fontSize === '110%') {
        root.classList.add('a11y-font-110');
    }

    if (settings.fontSize === '120%') {
        root.classList.add('a11y-font-120');
    }

    if (settings.fontSize === '130%') {
        root.classList.add('a11y-font-130');
    }

    if (settings.fontSize === '140%') {
        root.classList.add('a11y-font-140');
    }

    if (settings.fontSize === '150%') {
        root.classList.add('a11y-font-150');
    }

    // 2. Line Height
    root.classList.remove(
        'a11y-line-height-normal',
        'a11y-line-height-relaxed',
        'a11y-line-height-loose',
    );

    if (settings.lineHeight === 'relaxed') {
        root.classList.add('a11y-line-height-relaxed');
    }

    if (settings.lineHeight === 'loose') {
        root.classList.add('a11y-line-height-loose');
    }

    // 3. Letter Spacing
    root.classList.remove(
        'a11y-letter-spacing-normal',
        'a11y-letter-spacing-wide',
        'a11y-letter-spacing-extra',
    );

    if (settings.letterSpacing === 'wide') {
        root.classList.add('a11y-letter-spacing-wide');
    }

    if (settings.letterSpacing === 'extra') {
        root.classList.add('a11y-letter-spacing-extra');
    }

    // 4. Color Modes
    if (settings.highContrast) {
        root.classList.add('a11y-high-contrast');
    } else {
        root.classList.remove('a11y-high-contrast');
    }

    if (settings.invertColors) {
        root.classList.add('a11y-invert-colors');
    } else {
        root.classList.remove('a11y-invert-colors');
    }

    if (settings.grayscale) {
        root.classList.add('a11y-grayscale');
    } else {
        root.classList.remove('a11y-grayscale');
    }

    if (settings.saturate) {
        root.classList.add('a11y-saturate');
    } else {
        root.classList.remove('a11y-saturate');
    }

    // 5. Typography & Focus
    if (settings.dyslexiaFont) {
        root.classList.add('a11y-dyslexia');
    } else {
        root.classList.remove('a11y-dyslexia');
    }

    if (settings.highlightLinks) {
        root.classList.add('a11y-highlight-links');
    } else {
        root.classList.remove('a11y-highlight-links');
    }

    if (settings.highlightHeadings) {
        root.classList.add('a11y-highlight-headings');
    } else {
        root.classList.remove('a11y-highlight-headings');
    }

    if (settings.largeCursor) {
        root.classList.add('a11y-large-cursor');
    } else {
        root.classList.remove('a11y-large-cursor');
    }

    if (settings.hideImages) {
        root.classList.add('a11y-hide-images');
    } else {
        root.classList.remove('a11y-hide-images');
    }

    if (settings.reduceMotion) {
        root.classList.add('a11y-reduce-motion');
    } else {
        root.classList.remove('a11y-reduce-motion');
    }
}

export default function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        const loaded = loadSettings();

        // Apply saved settings before the first paint so users never see an unstyled flash.
        applySettingsToRoot(loaded);

        return loaded;
    });

    const [mousePosY, setMousePosY] = useState(0);

    // Apply Settings to Root HTML
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Could not save accessibility settings', e);
        }

        applySettingsToRoot(settings);
    }, [settings]);

    // Reading Guide Mouse Follower
    useEffect(() => {
        if (!settings.readingGuide && !settings.readingMask) {
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosY(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [settings.readingGuide, settings.readingMask]);

    // Text To Speech on Hover
    useEffect(() => {
        if (!settings.textToSpeech) {
            window.speechSynthesis?.cancel();

            return;
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (!target) {
                return;
            }

            const text =
                target.innerText ||
                target.getAttribute('aria-label') ||
                target.getAttribute('title');

            if (text && text.trim().length > 0 && text.trim().length < 200) {
                window.speechSynthesis?.cancel();
                const utterance = new SpeechSynthesisUtterance(text.trim());
                utterance.rate = settings.speechRate || 1.0;
                window.speechSynthesis?.speak(utterance);
            }
        };

        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            window.speechSynthesis?.cancel();
        };
    }, [settings.textToSpeech, settings.speechRate]);

    const toggleSetting = <K extends keyof AccessibilitySettings>(key: K) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const updateSetting = <K extends keyof AccessibilitySettings>(
        key: K,
        val: AccessibilitySettings[K],
    ) => {
        setSettings((prev) => ({ ...prev, [key]: val }));
    };

    const applyProfile = (profileSettings: Partial<AccessibilitySettings>) => {
        setSettings({
            ...DEFAULT_SETTINGS,
            ...profileSettings,
        });
    };

    const resetAll = () => {
        setSettings(DEFAULT_SETTINGS);
        window.speechSynthesis?.cancel();
    };

    const toggleShortcuts = [
        { key: 'highContrast', title: 'High Contrast', icon: Sun },
        { key: 'invertColors', title: 'Invert Colors', icon: Contrast },
        { key: 'dyslexiaFont', title: 'Readable Font', icon: BookOpen },
        { key: 'largeCursor', title: 'Large Cursor', icon: MousePointer },
        { key: 'readingGuide', title: 'Reading Guide', icon: Sliders },
        { key: 'readingMask', title: 'Focus Mask', icon: Focus },
        { key: 'textToSpeech', title: 'Speech Reader', icon: Volume2 },
        { key: 'highlightLinks', title: 'Highlight Links', icon: Link },
        {
            key: 'highlightHeadings',
            title: 'Highlight Headings',
            icon: Heading,
        },
        { key: 'grayscale', title: 'Grayscale', icon: Eye },
        { key: 'saturate', title: 'Color Saturate', icon: Flame },
        { key: 'reduceMotion', title: 'Pause Motion', icon: ZapOff },
        { key: 'hideImages', title: 'Hide Media', icon: ImageOff },
    ] as const;

    return (
        <>
            {/* Floating Accessibility Button */}
            <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Open Accessibility Controls"
                    className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#E64A19] text-white shadow-2xl shadow-orange-950/40 transition-all duration-300 hover:scale-110 hover:bg-[#d83f0e] focus:ring-4 focus:ring-orange-300 focus:outline-none sm:h-14 sm:w-14"
                >
                    <Accessibility className="h-6 w-6 transition-transform group-hover:rotate-12 sm:h-7 sm:w-7" />
                </button>
            </div>

            {/* Reading Guide Line */}
            {settings.readingGuide && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed right-0 left-0 z-50 h-7 border-y-2 border-amber-500 bg-amber-300/30 shadow-lg backdrop-contrast-125 transition-all duration-75"
                    style={{ top: `${mousePosY - 14}px` }}
                />
            )}

            {/* Reading Focus Mask */}
            {settings.readingMask && (
                <>
                    <div
                        aria-hidden="true"
                        className="pointer-events-none fixed top-0 right-0 left-0 z-40 bg-black/60 transition-all duration-75"
                        style={{ height: `${Math.max(0, mousePosY - 45)}px` }}
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 bg-black/60 transition-all duration-75"
                        style={{ top: `${mousePosY + 45}px` }}
                    />
                </>
            )}

            {/* Mobile Top Bar Style Shortcut Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-xs sm:p-5">
                    <div className="relative my-auto flex max-h-[90vh] min-h-0 w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-xs text-white shadow-2xl">
                        {/* Top Bar Header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E64A19] text-white shadow-md">
                                    <Accessibility className="h-5 w-5" />
                                </div>
                                <h3 className="text-sm font-black tracking-wide text-white uppercase">
                                    Accessibility Shortcuts
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={resetAll}
                                    title="Reset All"
                                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                                    aria-label="Close"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content Drawer */}
                        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-5">
                            {/* 1. Quick Presets Bar */}
                            <div>
                                <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                                    <Sparkles className="h-3.5 w-3.5 text-[#E64A19]" />
                                    <span>Presets</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {[
                                        {
                                            title: 'Vision Assist',
                                            icon: Eye,
                                            config: {
                                                fontSize: '140%',
                                                highContrast: true,
                                                largeCursor: true,
                                            },
                                        },
                                        {
                                            title: 'Reading Comfort',
                                            icon: BookOpen,
                                            config: {
                                                lineHeight: 'loose',
                                                letterSpacing: 'wide',
                                                readingGuide: true,
                                            },
                                        },
                                        {
                                            title: 'ADHD Focus',
                                            icon: Focus,
                                            config: {
                                                readingGuide: true,
                                                readingMask: true,
                                                reduceMotion: true,
                                            },
                                        },
                                        {
                                            title: 'Motor Assist',
                                            icon: MousePointer,
                                            config: {
                                                largeCursor: true,
                                                highlightLinks: true,
                                            },
                                        },
                                    ].map((p) => {
                                        const Icon = p.icon;

                                        return (
                                            <button
                                                key={p.title}
                                                onClick={() =>
                                                    applyProfile(
                                                        p.config as Partial<AccessibilitySettings>,
                                                    )
                                                }
                                                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-700/60 bg-slate-800/80 p-3 text-center transition-all hover:bg-slate-800 active:scale-95"
                                            >
                                                <Icon className="h-5 w-5 text-[#E64A19]" />
                                                <span className="text-[11px] font-extrabold text-slate-200">
                                                    {p.title}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Shortcut Toggles Grid (Mobile Top Bar / Control Center Style) */}
                            <div>
                                <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                                    <Sliders className="h-3.5 w-3.5 text-[#E64A19]" />
                                    <span>Quick Controllers</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                    {toggleShortcuts.map((sc) => {
                                        const Icon = sc.icon;
                                        const isActive = !!settings[sc.key];

                                        return (
                                            <button
                                                key={sc.key}
                                                onClick={() =>
                                                    toggleSetting(sc.key)
                                                }
                                                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                                                    isActive
                                                        ? 'border-[#E64A19] bg-[#E64A19] text-white shadow-lg shadow-orange-950/30'
                                                        : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                                                }`}
                                            >
                                                <div
                                                    className={`shrink-0 rounded-xl p-2 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-700/50 text-slate-300'}`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex w-full min-w-0 items-center justify-between">
                                                    <span className="truncate text-[11px] font-extrabold">
                                                        {sc.title}
                                                    </span>
                                                    {isActive && (
                                                        <Check className="ml-1 h-3.5 w-3.5 shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Segmented Level Controls (Text Size, Line Height, Letter Spacing, Speech Speed) */}
                            <div className="space-y-3 border-t border-slate-800 pt-2">
                                {/* Text Size Scale */}
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-extrabold text-slate-300">
                                        <span className="flex items-center gap-1.5">
                                            <Type className="h-3.5 w-3.5 text-[#E64A19]" />
                                            <span>Text Size</span>
                                        </span>
                                        <span className="font-black text-[#E64A19]">
                                            {settings.fontSize}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-6 gap-1 rounded-2xl border border-slate-800 bg-slate-950 p-1">
                                        {(
                                            [
                                                '100%',
                                                '110%',
                                                '120%',
                                                '130%',
                                                '140%',
                                                '150%',
                                            ] as const
                                        ).map((sz) => (
                                            <button
                                                key={sz}
                                                onClick={() =>
                                                    updateSetting(
                                                        'fontSize',
                                                        sz,
                                                    )
                                                }
                                                className={`rounded-xl py-1.5 text-center text-[10px] font-black transition-all ${
                                                    settings.fontSize === sz
                                                        ? 'bg-[#E64A19] text-white shadow-sm'
                                                        : 'text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {sz}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Line Height */}
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-extrabold text-slate-300">
                                        <span className="flex items-center gap-1.5">
                                            <SlidersHorizontal className="h-3.5 w-3.5 text-[#E64A19]" />
                                            <span>Line Spacing</span>
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 rounded-2xl border border-slate-800 bg-slate-950 p-1">
                                        {[
                                            { id: 'normal', label: 'Standard' },
                                            { id: 'relaxed', label: 'Relaxed' },
                                            { id: 'loose', label: 'Loose' },
                                        ].map((lh) => (
                                            <button
                                                key={lh.id}
                                                onClick={() =>
                                                    updateSetting(
                                                        'lineHeight',
                                                        lh.id as
                                                            | 'normal'
                                                            | 'relaxed'
                                                            | 'loose',
                                                    )
                                                }
                                                className={`rounded-xl py-1.5 text-center text-[10px] font-bold transition-all ${
                                                    settings.lineHeight ===
                                                    lh.id
                                                        ? 'bg-[#E64A19] text-white shadow-sm'
                                                        : 'text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {lh.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Speech Speed */}
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-extrabold text-slate-300">
                                        <span className="flex items-center gap-1.5">
                                            <Volume2 className="h-3.5 w-3.5 text-[#E64A19]" />
                                            <span>Speech Speed</span>
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1 rounded-2xl border border-slate-800 bg-slate-950 p-1">
                                        {[
                                            { rate: 0.8, label: '0.8x' },
                                            { rate: 1.0, label: '1.0x' },
                                            { rate: 1.25, label: '1.25x' },
                                            { rate: 1.5, label: '1.5x' },
                                        ].map((sp) => (
                                            <button
                                                key={sp.rate}
                                                onClick={() =>
                                                    updateSetting(
                                                        'speechRate',
                                                        sp.rate,
                                                    )
                                                }
                                                className={`rounded-xl py-1.5 text-center text-[10px] font-bold transition-all ${
                                                    settings.speechRate ===
                                                    sp.rate
                                                        ? 'bg-[#E64A19] text-white shadow-sm'
                                                        : 'text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {sp.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="shrink-0 border-t border-slate-800 bg-slate-950 p-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full rounded-2xl bg-[#E64A19] py-3 text-xs font-black tracking-wider text-white uppercase shadow-md transition-all hover:bg-[#d83f0e] active:scale-98"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
