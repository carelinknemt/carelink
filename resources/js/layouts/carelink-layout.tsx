import type { ReactNode } from 'react';
import AccessibilityWidget from '@/components/carelink/accessibility-widget';
import AppointmentModal from '@/components/carelink/appointment-modal';
import Footer from '@/components/carelink/footer';
import Header from '@/components/carelink/header';
import { BookingProvider } from '@/context/booking-context';

export default function CarelinkLayout({
    children,
}: {
    children: ReactNode;
}): ReactNode {
    return (
        <BookingProvider>
            <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-cyan-100 selection:text-[#004B87]">
                <Header />
                <main>{children}</main>
                <Footer />
                <AppointmentModal />
                <AccessibilityWidget />
            </div>
        </BookingProvider>
    );
}
