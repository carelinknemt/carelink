import type { Request, Response } from 'express';
import { BambiDispatchBackendService } from '../services/bambiService.js';

export const getBookingsHandler = (req: Request, res: Response) => {
  const bookings = BambiDispatchBackendService.getAllBookings();
  res.json({ status: 'success', data: bookings });
};

export const createBookingHandler = (req: Request, res: Response) => {
  try {
    const booking = BambiDispatchBackendService.createBooking(req.body);
    res.status(201).json({ status: 'success', data: booking });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message || 'Invalid booking payload' });
  }
};

export const updateBookingStatusHandler = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = BambiDispatchBackendService.updateStatus(id, status);

  if (!updated) {
    res.status(404).json({ status: 'error', message: 'Booking ID not found' });

    return;
  }

  res.json({ status: 'success', data: updated });
};
