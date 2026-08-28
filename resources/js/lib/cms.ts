import type { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

export type CmsField =
    | {
          key: string;
          label: string;
          type: 'text' | 'textarea' | 'number' | 'switch' | 'list' | 'image';
      }
    | {
          key: string;
          label: string;
          type: 'table';
          cols: {
              key: string;
              label: string;
              type: 'text' | 'textarea' | 'number' | 'image';
          }[];
      };

export interface CmsSectionRecord {
    slug: string;
    title: string;
    description: string;
    readonly?: boolean;
    schema: CmsField[];
    content: Record<string, unknown>;
    updated_at: string | null;
}

export interface CompanyInfo {
    name: string;
    logo_url: string;
    tagline: string;
    headquarters: string;
    phone: string;
    email: string;
    dispatch_phone: string;
    address: string;
    service_region: string;
    counties: string[];
}

export interface DispatchHours {
    day: string;
    hours: string;
}

export interface PaymentMethod {
    name: string;
    src: string;
}

export interface HeroSlide {
    id: string;
    title: string;
    highlight_text: string;
    subtitle: string;
    bg_image: string;
}

export interface PatientReview {
    author: string;
    role: string;
    initials: string;
    rating: number;
    date: string;
    text: string;
    avatar: string;
    avatar_bg: string;
}

export interface BookingStep {
    number: number;
    title: string;
    tagline: string;
    points: string[];
}

export interface BookingFee {
    money: {
        amount_cents: number;
        amount_dollars: string;
        label: string;
        dollars: string;
    };
    settings: { fee_amount_cents: number; label: string };
}

interface CmsProps extends PageProps {
    cms?: Record<string, any>;
}

/**
 * Every content section, shared with all Inertia responses by
 * HandleInertiaRequests. Sections fall back to the PHP-side defaults, so a
 * key may still be missing in edge cases (guests, SSR); use `??` guards.
 */
export function useCms(): Record<string, any> {
    return usePage<CmsProps>().props.cms ?? {};
}

export function useCompanyInfo(): Partial<CompanyInfo> {
    return useCms().company_info ?? {};
}

export interface PageHero {
    page: string;
    title: string;
    subtitle: string;
}

export function usePageHero(page: string): Partial<PageHero> {
    const heroes = (useCms().page_heroes?.heroes ?? []) as PageHero[];

    return heroes.find((hero) => hero.page === page) ?? {};
}

/**
 * CMS textarea cells are stored (and wired) as either a single string or an
 * array of lines depending on the section's defaults. Consumers that render
 * a plain text node must normalize through this helper.
 */
export function cmsText(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value.join(' ') : (value ?? '');
}

export function useBookingFee(): {
    amount_cents: number;
    dollars: string;
    label: string;
} {
    const settings = useCms().booking_fee_settings ?? {
        fee_amount_cents: 3000,
        label: 'CareLink Booking Fee',
    };

    return {
        amount_cents: Number(settings.fee_amount_cents) || 3000,
        dollars: `$${((Number(settings.fee_amount_cents) || 3000) / 100).toFixed(2)}`,
        label: settings.label || 'CareLink Booking Fee',
    };
}

/**
 * Replace {placeholder} tokens in CMS text with live values (fee, phone, ...).
 */
export function interpolateCmsText(
    text: string,
    values: Record<string, string>,
): string {
    return Object.entries(values).reduce(
        (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
        text,
    );
}
