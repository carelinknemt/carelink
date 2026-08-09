import { useState } from 'react';
import AppHead from '@/components/app-head';
import BookingSteps from '@/components/carelink/booking-steps';
import CommittedExcellence from '@/components/carelink/committed-excellence';
import ContactAndHours from '@/components/carelink/contact-and-hours';
import Hero from '@/components/carelink/hero';
import ServicesModal from '@/components/carelink/services-modal';
import SmileThatShine from '@/components/carelink/smile-that-shine';
import SpecializedTeam from '@/components/carelink/specialized-team';
import StripePartnershipSpotlight from '@/components/carelink/stripe-partnership-spotlight';
import { COMPANY_INFO, DISPATCH_HOURS } from '@/data/carelink';
import type { TransportService } from '@/types/carelink';

interface HomeProps {
    services: TransportService[];
}

const HOME_DESCRIPTION =
    'CareLink Medical Transportation LLC provides compassionate non-emergency medical transportation (NEMT) across Humboldt, Del Norte, Trinity, and Shasta counties — ADA wheelchair vans, dialysis rides, hospital discharges, and curb-to-curb support. Call (707) 854-9350.';

function to24Hour(expr: string): string {
    const match = expr.trim().match(/(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)/);

    if (!match) {
        return expr.trim();
    }

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3];

    if (period.startsWith('p') && hours !== 12) {
        hours += 12;
    }

    if (period.startsWith('a') && hours === 12) {
        hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
}

export default function Home({ services }: HomeProps) {
    const [selectedService, setSelectedService] =
        useState<TransportService | null>(null);
    const [servicesModalOpen, setServicesModalOpen] = useState(false);

    const handleSelectService = (service: TransportService) => {
        setSelectedService(service);
        setServicesModalOpen(true);
    };

    return (
        <div>
            <AppHead
                title="Non-Emergency Medical Transportation (NEMT) in Northern California"
                description={HOME_DESCRIPTION}
                keywords={[
                    'NEMT',
                    'non-emergency medical transportation',
                    'wheelchair van service',
                    'dialysis transportation',
                    'hospital discharge rides',
                    'medical transport Humboldt County',
                    'CareLink Medical Transportation',
                    'Eureka CA medical transport',
                    'ambulatory sedan service',
                    'Medi-Cal transportation',
                ]}
                canonical="/"
                type="website"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'MedicalBusiness',
                    '@id': `${window.location.origin}/#organization`,
                    name: COMPANY_INFO.name,
                    description: HOME_DESCRIPTION,
                    url: window.location.origin,
                    telephone: COMPANY_INFO.phone,
                    email: COMPANY_INFO.email,
                    image: `${window.location.origin}/images/Img-Carelink-hero.webp`,
                    priceRange: '$$',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: '3857 Walnut Drive, Suite B',
                        addressLocality: 'Eureka',
                        addressRegion: 'CA',
                        postalCode: '95503',
                        addressCountry: 'US',
                    },
                    areaServed: COMPANY_INFO.counties.map(
                        (county) => `${county} County, California`,
                    ),
                    openingHoursSpecification: DISPATCH_HOURS.map(
                        (schedule) => ({
                            '@type': 'OpeningHoursSpecification',
                            dayOfWeek: schedule.day,
                            opens: to24Hour(schedule.hours.split('-')[0]),
                            closes: to24Hour(schedule.hours.split('-')[1]),
                        }),
                    ),
                }}
            />

            {/* Hero Carousel */}
            <Hero />

            {/* Core Services & Appointment Banner */}
            <CommittedExcellence
                services={services}
                onSelectService={handleSelectService}
            />

            {/* Booking Journey Steps */}
            <BookingSteps />

            {/* Specialized Team Section */}
            <SpecializedTeam />

            {/* Google Patient Reviews */}
            <SmileThatShine />

            {/* Stripe Payment Spotlight */}
            <StripePartnershipSpotlight />

            {/* Contact & Hours */}
            <ContactAndHours />

            {/* Modals */}
            <ServicesModal
                selectedService={selectedService}
                isOpen={servicesModalOpen}
                onClose={() => setServicesModalOpen(false)}
            />
        </div>
    );
}
