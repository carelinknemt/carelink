import type { RideBookingModel} from '../models/bookingModel.js';
import { INITIAL_BOOKINGS_DATA } from '../models/bookingModel.js';

const inMemoryBookings: RideBookingModel[] = [...INITIAL_BOOKINGS_DATA];

export class BambiDispatchBackendService {
  static getAllBookings(): RideBookingModel[] {
    return inMemoryBookings;
  }

  static createBooking(booking: Omit<RideBookingModel, 'id' | 'createdAt'>): RideBookingModel {
    const newBooking: RideBookingModel = {
      ...booking,
      id: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    inMemoryBookings.unshift(newBooking);

    return newBooking;
  }

  static updateStatus(id: string, status: RideBookingModel['status']): RideBookingModel | null {
    const index = inMemoryBookings.findIndex((b) => b.id === id);

    if (index === -1) {
return null;
}

    inMemoryBookings[index].status = status;

    return inMemoryBookings[index];
  }
}
