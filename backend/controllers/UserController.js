import mongoose from 'mongoose';
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.params.id;
        
        if (userId === 'playpeak_athlete_demo' || userId === 'playpeak-demo-token') {
            return res.json({
                _id: 'playpeak_athlete_demo',
                name: 'Coach Rajesh (Admin)',
                email: 'admin@playpeak.com',
                role: 'admin'
            });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findById(userId).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.params.id;

        if (userId === 'playpeak_athlete_demo' || userId === 'playpeak-demo-token') {
            return res.json({
                _id: 'playpeak_athlete_demo',
                name: req.body.name || 'Coach Rajesh (Admin)',
                email: req.body.email || 'admin@playpeak.com',
                role: 'admin',
                phone: req.body.phone || '+91 98260 11223'
            });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findById(userId);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email ? req.body.email.toLowerCase() : user.email;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.address = req.body.address !== undefined ? req.body.address : user.address;
            user.slot = req.body.slot !== undefined ? req.body.slot : user.slot;
            
            if (req.body.password && req.body.password.trim().length > 0) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                slot: updatedUser.slot,
                membership: updatedUser.membership,
                lateFees: updatedUser.lateFees
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getAllUsers, getUserProfile, updateUserProfile, deleteUser };
