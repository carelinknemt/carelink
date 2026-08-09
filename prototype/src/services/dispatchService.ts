import { TRANSPORT_SERVICES, VEHICLE_FLEET } from '../data/carelinkData';
import type { RideBooking } from '../types';

const INITIAL_BOOKINGS: RideBooking[] = [
  {
    id: 'CL-9021',
    passengerName: 'Eleanor Vance',
    phone: '(707) 555-0192',
    email: 'eleanor.v@example.com',
    pickupAddress: '1420 Harrison Ave, Eureka, CA',
    pickupCounty: 'Humboldt',
    destinationAddress: 'St. Joseph Hospital, Eureka, CA',
    destinationCounty: 'Humboldt',
    rideDate: '2026-07-26',
    rideTime: '09:30 AM',
    isRoundTrip: true,
    serviceType: 'Wheelchair Van',
    wheelchairNeeded: true,
    oxygenNeeded: true,
    additionalNotes: 'Requires companion seat.',
    status: 'IN_TRANSIT',
    estimatedCost: 85,
    paymentMethod: 'Insurance / Medicaid',
    bambiDispatchRef: 'Marcus Miller (Van 104)',
    createdAt: '2026-07-25 14:20',
  },
  {
    id: 'CL-9022',
    passengerName: 'Robert Sterling',
    phone: '(707) 555-0844',
    email: 'rsterling@example.com',
    pickupAddress: '885 Redwood Way, Arcata, CA',
    pickupCounty: 'Humboldt',
    destinationAddress: 'Mad River Community Hospital, Arcata, CA',
    destinationCounty: 'Humboldt',
    rideDate: '2026-07-26',
    rideTime: '11:00 AM',
    isRoundTrip: false,
    serviceType: 'Transit Shuttle',
    wheelchairNeeded: false,
    oxygenNeeded: false,
    additionalNotes: 'Requires multi-passenger shuttle for group therapy session.',
    status: 'BAMBI_DISPATCHED',
    estimatedCost: 120,
    paymentMethod: 'Facility Billing',
    bambiDispatchRef: 'Sarah Jenkins (Shuttle Unit 08)',
    createdAt: '2026-07-25 16:05',
  },
  {
    id: 'CL-9023',
    passengerName: 'Maria Rodriguez',
    phone: '(707) 555-3311',
    email: 'm.rodriguez@example.com',
    pickupAddress: '310 5th Street, Eureka, CA',
    pickupCounty: 'Humboldt',
    destinationAddress: 'Open Door Community Health Center, Fortuna, CA',
    destinationCounty: 'Humboldt',
    rideDate: '2026-07-26',
    rideTime: '02:15 PM',
    isRoundTrip: true,
    serviceType: 'Ambulatory Sedan',
    wheelchairNeeded: false,
    oxygenNeeded: false,
    additionalNotes: 'Bilingual driver preferred.',
    status: 'PENDING_DISPATCH',
    estimatedCost: 65,
    paymentMethod: 'Private Pay Cash',
    createdAt: '2026-07-26 08:00',
  },
];

export class DispatchService {
  private static STORAGE_KEY = 'carelink_dispatch_bookings_v2';

  static getBookings(): RideBooking[] {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));

      return INITIAL_BOOKINGS;
    }

    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  static updateBookingStatus(id: string, newStatus: RideBooking['status']): RideBooking[] {
    const bookings = this.getBookings();
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));

    return updated;
  }

  static getServices() {
    return TRANSPORT_SERVICES;
  }

  static getFleet() {
    return VEHICLE_FLEET;
  }
}
