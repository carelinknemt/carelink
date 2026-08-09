export interface RideBookingModel {
  id: string;
  passengerName: string;
  phone: string;
  email: string;
  pickupAddress: string;
  destinationAddress: string;
  rideDate: string;
  rideTime: string;
  serviceType: string;
  wheelchairNeeded: boolean;
  oxygenNeeded: boolean;
  status: 'PENDING_DISPATCH' | 'BAMBI_DISPATCHED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  estimatedCost: number;
  paymentMethod: string;
  bambiDispatchRef?: string;
  createdAt: string;
}

export const INITIAL_BOOKINGS_DATA: RideBookingModel[] = [
  {
    id: 'CL-9021',
    passengerName: 'Eleanor Vance',
    phone: '(707) 555-0192',
    email: 'eleanor.v@example.com',
    pickupAddress: '1420 Harrison Ave, Eureka, CA',
    destinationAddress: 'St. Joseph Hospital, Eureka, CA',
    rideDate: '2026-07-26',
    rideTime: '09:30 AM',
    serviceType: 'Wheelchair Van',
    wheelchairNeeded: true,
    oxygenNeeded: true,
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
    destinationAddress: 'Mad River Community Hospital, Arcata, CA',
    rideDate: '2026-07-26',
    rideTime: '11:00 AM',
    serviceType: 'Gurney Stretcher',
    wheelchairNeeded: false,
    oxygenNeeded: false,
    status: 'BAMBI_DISPATCHED',
    estimatedCost: 180,
    paymentMethod: 'Facility Billing',
    bambiDispatchRef: 'Sarah Jenkins (Gurney Unit 02)',
    createdAt: '2026-07-25 16:05',
  },
  {
    id: 'CL-9023',
    passengerName: 'Maria Rodriguez',
    phone: '(707) 555-3311',
    email: 'm.rodriguez@example.com',
    pickupAddress: '310 5th Street, Eureka, CA',
    destinationAddress: 'Open Door Community Health Center, Fortuna, CA',
    rideDate: '2026-07-26',
    rideTime: '02:15 PM',
    serviceType: 'Ambulatory Sedan',
    wheelchairNeeded: false,
    oxygenNeeded: false,
    status: 'PENDING_DISPATCH',
    estimatedCost: 65,
    paymentMethod: 'Private Pay Cash',
    createdAt: '2026-07-26 08:00',
  },
];
