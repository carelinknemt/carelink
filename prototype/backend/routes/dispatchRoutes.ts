import { Router } from 'express';
import {
  getBookingsHandler,
  createBookingHandler,
  updateBookingStatusHandler,
} from '../controllers/dispatchController.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/bookings', adminAuthMiddleware, getBookingsHandler);
router.post('/bookings', createBookingHandler);
router.patch('/bookings/:id/status', adminAuthMiddleware, updateBookingStatusHandler);

export default router;
