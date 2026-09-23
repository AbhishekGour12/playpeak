import express from 'express';
const router = express.Router();
import {
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUser
} from '../controllers/UserController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Admin gets all users
router.get('/', protect, admin, getAllUsers);

// User can get and update their own profile
router.route('/profile/:id')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin can delete a user
router.delete('/:id', protect, admin, deleteUser);


export default router;