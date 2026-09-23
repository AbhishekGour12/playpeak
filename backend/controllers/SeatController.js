import Seat from '../models/Seat.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Get all seats (auto-seeds 30 seats if empty)
// @route   GET /api/seats
// @access  Private
export const getAllSeats = async (req, res) => {
    try {
        let seats = await Seat.find({}).populate('allocatedTo', 'name email phone slot');
        
        // If there are no seats in the database, seed 30 seats
        if (seats.length === 0) {
            const seedSeats = [];
            for (let i = 1; i <= 30; i++) {
                seedSeats.push({
                    seatNumber: `Seat-${i}`,
                    status: 'empty',
                    allocatedTo: null,
                    slot: ''
                });
            }
            await Seat.insertMany(seedSeats);
            seats = await Seat.find({}).populate('allocatedTo', 'name email phone slot');
        }

        res.json({ success: true, data: seats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Allocate seat to a student manually
// @route   POST /api/seats/allocate
// @access  Private/Admin
export const allocateSeat = async (req, res) => {
    const { seatNumber, studentId, slot } = req.body;

    try {
        // Find the seat
        const seat = await Seat.findOne({ seatNumber });
        if (!seat) {
            return res.status(404).json({ success: false, message: 'Seat not found' });
        }

        // Find the student (could be ID or email)
        let query = {};
        if (mongoose.isValidObjectId(studentId)) {
            query = { _id: studentId };
        } else {
            query = { email: studentId.toLowerCase() };
        }

        const student = await User.findOne(query);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found with specified ID or Email' });
        }

        // Check if student already has a seat allocated
        const alreadyAllocated = await Seat.findOne({ allocatedTo: student._id });
        if (alreadyAllocated) {
            return res.status(400).json({ 
                success: false, 
                message: `Student already has ${alreadyAllocated.seatNumber} allocated.` 
            });
        }

        // Update the seat
        seat.status = 'reserved';
        seat.allocatedTo = student._id;
        seat.slot = slot || student.slot || 'Morning';
        
        await seat.save();

        const updatedSeat = await Seat.findById(seat._id).populate('allocatedTo', 'name email phone slot');

        // Emit real-time update if socket io exists
        if (req.io) {
            req.io.emit('seats_updated', await Seat.find({}).populate('allocatedTo', 'name email phone slot'));
        }

        res.json({ success: true, message: 'Seat allocated successfully', data: updatedSeat });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Remove seat allocation
// @route   POST /api/seats/remove
// @access  Private/Admin
export const removeAllocation = async (req, res) => {
    const { seatNumber } = req.body;

    try {
        const seat = await Seat.findOne({ seatNumber });
        if (!seat) {
            return res.status(404).json({ success: false, message: 'Seat not found' });
        }

        seat.status = 'empty';
        seat.allocatedTo = null;
        seat.slot = '';

        await seat.save();

        const updatedSeat = await Seat.findById(seat._id);

        // Emit real-time update
        if (req.io) {
            req.io.emit('seats_updated', await Seat.find({}).populate('allocatedTo', 'name email phone slot'));
        }

        res.json({ success: true, message: 'Seat allocation removed successfully', data: updatedSeat });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
