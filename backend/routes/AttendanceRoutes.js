import express from 'express';
const router = express.Router();
import { checkIn, checkOut, getAttendanceHistory, getLiveAttendance } from '../controllers/AttendanceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/checkin', checkIn);
router.post('/checkout/:id',  checkOut);

router.get('/history/:userId',  getAttendanceHistory); // User can get own, admin can get any
router.get('/live',  getLiveAttendance); // Admin only

export default router;
