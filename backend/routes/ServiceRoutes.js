import express from 'express';
import { getAllServices, createService, updateService, deleteService } from '../controllers/ServiceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all services
router.get('/', getAllServices);

// Admin only: CRUD services
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

export default router;
