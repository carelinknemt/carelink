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
import type { TransportService } from '@/types/carelink';

interface HomeProps {
    services: TransportService[];
}

export default function Home({ services }: HomeProps) {
    const [selectedService, setSelectedService] = useState<TransportService | null>(null);
    const [servicesModalOpen, setServicesModalOpen] = useState(false);

    const handleSelectService = (service: TransportService) => {
        setSelectedService(service);
        setServicesModalOpen(true);
    };

    return (
        <div>
            <AppHead title="Home" />

            {/* Hero Carousel */}
            <Hero />

            {/* Core Services & Appointment Banner */}
            <CommittedExcellence services={services} onSelectService={handleSelectService} />

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
            <ServicesModal selectedService={selectedService} isOpen={servicesModalOpen} onClose={() => setServicesModalOpen(false)} />
        </div>
    );
}
