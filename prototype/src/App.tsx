/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import React, { useState, useEffect } from 'react';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { AppointmentModal } from './components/AppointmentModal';
import { CommittedExcellence } from './components/CommittedExcellence';
import { ContactAndHours } from './components/ContactAndHours';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesModal } from './components/ServicesModal';
import { SmileThatShine } from './components/SmileThatShine';
import { SpecializedTeam } from './components/SpecializedTeam';
import { StaffModal } from './components/StaffModal';
import { StripePartnershipSpotlight } from './components/StripePartnershipSpotlight';


import { AboutPage } from './pages/AboutPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { BlogPage } from './pages/BlogPage';
import { CareersPage } from './pages/CareersPage';
import { CMSPage } from './pages/CMSPage';
import { FAQPage } from './pages/FAQPage';
import { FleetPage } from './pages/FleetPage';
import { ServicesPage } from './pages/ServicesPage';


export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('carelink_admin_auth') === 'true';
  });

  // Check URL route for active page/tab on load and hash change
  useEffect(() => {
    const syncRouteFromHash = () => {
      const rawHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const search = window.location.search.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (
        rawHash === 'admin' ||
        rawHash === 'admin-login' ||
        rawHash === 'login' ||
        rawHash === 'cms' ||
        search.includes('admin') ||
        path.endsWith('/admin')
      ) {
        if (sessionStorage.getItem('carelink_admin_auth') === 'true') {
          setActiveTab('cms');
        } else {
          setActiveTab('admin-login');
        }

        return;
      }

      if (rawHash === 'service' || rawHash === 'services') {
        setActiveTab('services');
      } else if (rawHash === 'fleet') {
        setActiveTab('fleet');
      } else if (rawHash === 'about') {
        setActiveTab('about');
      } else if (rawHash === 'faq' || rawHash === 'faqs' || rawHash === 'contact') {
        setActiveTab('faq');
      } else if (rawHash === 'blog' || rawHash === 'blogs') {
        setActiveTab('blog');
      } else if (rawHash === 'careers' || rawHash === 'career') {
        setActiveTab('careers');
      } else if (rawHash === 'home') {
        setActiveTab('home');
      }
    };

    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    window.addEventListener('popstate', syncRouteFromHash);

    return () => {
      window.removeEventListener('hashchange', syncRouteFromHash);
      window.removeEventListener('popstate', syncRouteFromHash);
    };
  }, []);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const [preselectedDay, setPreselectedDay] = useState<string | undefined>(undefined);

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Initialize Lenis Smooth Scrolling engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateFn = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateFn);
      lenis.destroy();
    };
  }, []);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = `#${tab}`;
  };

  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setServicesModalOpen(true);
  };

  const handleSelectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setStaffModalOpen(true);
  };

  const handleBookDaySlot = (_day: string) => {
    // Booking modal trigger disabled
  };

  const isAdminUI = activeTab === 'cms' || activeTab === 'admin-login';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-cyan-100 selection:text-[#004B87]">
      {/* Header Bar - Hidden on Admin UI */}
      {!isAdminUI && (
        <Header
          activeTab={activeTab}
          setActiveTab={handleNavClick}
          onOpenBooking={() => setBookingModalOpen(true)}
        />
      )}

      {/* Main Content Sections / Dedicated Pages */}
      <main>
        {activeTab === 'services' && (
          <ServicesPage
            onOpenBooking={() => {}}
            onSelectService={handleSelectService}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'fleet' && (
          <FleetPage
            onOpenBooking={() => {}}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage
            onOpenBooking={() => {}}
            onSelectDoctor={handleSelectDoctor}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'faq' && (
          <FAQPage
            onOpenBooking={() => {}}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'blog' && (
          <BlogPage
            onOpenBooking={() => {}}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'careers' && (
          <CareersPage
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              sessionStorage.setItem('carelink_admin_auth', 'true');
              setActiveTab('cms');
            }}
            onBackToHome={() => {
              setActiveTab('home');
              window.location.hash = '';
            }}
          />
        )}

        {activeTab === 'cms' && (
          isAdminAuthenticated ? (
            <CMSPage
              onBackToHome={() => {
                setActiveTab('home');
                window.location.hash = '';
              }}
              onLogout={() => {
                setIsAdminAuthenticated(false);
                sessionStorage.removeItem('carelink_admin_auth');
                setActiveTab('admin-login');
              }}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                sessionStorage.setItem('carelink_admin_auth', 'true');
                setActiveTab('cms');
              }}
              onBackToHome={() => {
                setActiveTab('home');
                window.location.hash = '';
              }}
            />
          )
        )}

        {activeTab === 'home' && (
          <>
            {/* Hero Carousel */}
            <Hero onOpenBooking={() => {}} />

            {/* Core NEMT Services & Appointment Banner */}
            <CommittedExcellence
              onOpenBooking={() => {}}
              onSelectService={handleSelectService}
              onViewAllServices={() => setActiveTab('services')}
            />

            {/* Specialized Leadership & Personnel */}
            <SpecializedTeam
              onSelectDoctor={handleSelectDoctor}
              onSeeAllStaff={() => setActiveTab('about')}
            />

            {/* Patient Journeys & Quality Fleet */}
            <SmileThatShine />

            {/* Stripe Partnership Spotlight Section */}
            <StripePartnershipSpotlight onOpenBooking={() => {}} />

            {/* Contact Our Team, Google Map & Dispatch Hours */}
            <ContactAndHours
              onOpenBooking={() => {}}
              onBookDaySlot={handleBookDaySlot}
            />
          </>
        )}
      </main>

      {/* Footer - Hidden on Admin UI */}
      {!isAdminUI && <Footer onNavClick={handleNavClick} />}

      {/* Interactive Modals */}
      <AppointmentModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDay={preselectedDay}
      />

      <ServicesModal
        isOpen={servicesModalOpen}
        selectedService={selectedService}
        onClose={() => setServicesModalOpen(false)}
        onBookService={() => {}}
      />

      <StaffModal
        isOpen={staffModalOpen}
        selectedDoctor={selectedDoctor}
        onClose={() => setStaffModalOpen(false)}
        onBookDoctor={() => {}}
      />

      {/* Accessibility Control Floating Tool */}
      <AccessibilityWidget />
    </div>
  );
}
