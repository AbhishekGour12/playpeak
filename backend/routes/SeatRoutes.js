import express from 'express';
import { getAllSeats, allocateSeat, removeAllocation } from '../controllers/SeatController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all seats
router.get('/', protect, getAllSeats);

// Allocate seat (Admin only)
router.post('/allocate', protect, admin, allocateSeat);

// Remove allocation (Admin only)
router.post('/remove', protect, admin, removeAllocation);

export default router;
