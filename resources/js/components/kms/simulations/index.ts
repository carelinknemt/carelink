import type { ComponentType } from 'react';
import ApplicationsSimulation from '@/components/kms/simulations/applications-simulation';
import BookingDetailSimulation from '@/components/kms/simulations/booking-detail-simulation';
import BookingsListSimulation from '@/components/kms/simulations/bookings-list-simulation';
import BusinessPartnersSimulation from '@/components/kms/simulations/business-partners-simulation';
import CmsSectionsSimulation from '@/components/kms/simulations/cms-sections-simulation';
import JobOpeningsSimulation from '@/components/kms/simulations/job-openings-simulation';
import PaymentsSimulation from '@/components/kms/simulations/payments-simulation';
import UsersSimulation from '@/components/kms/simulations/users-simulation';
import type { SimulationKey } from '@/data/kms-tours';

export const SIMULATIONS: Record<SimulationKey, ComponentType> = {
    'bookings-list': BookingsListSimulation,
    'booking-detail': BookingDetailSimulation,
    payments: PaymentsSimulation,
    users: UsersSimulation,
    'job-openings': JobOpeningsSimulation,
    applications: ApplicationsSimulation,
    'business-partners': BusinessPartnersSimulation,
    'cms-sections': CmsSectionsSimulation,
};
