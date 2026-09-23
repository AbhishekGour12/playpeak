import Attendance from '../models/Attendance.js';
import Slot from '../models/Slot.js';
import mongoose from 'mongoose';
import express from 'express';

// @desc    Check-in a user
// @route   POST /api/attendance/checkin
// @access  Private


const checkIn = async (req, res) => {

    const { id, studentId, action, timeStamp, location, qrData, slot } = req.body;

    try {
        {/**  const slot = await Slot.findById(slotId);
        if (!slot || !slot.isActive) {
            return res.status(400).json({ message: 'Invalid or inactive slot' });
        }
            */}

        // Check if user is already checked in

        const existingAttendance = await Attendance.findOne({ user: id, checkOutTime: null });

        if (existingAttendance) {
            return res.status(400).json({ message: 'User is already checked in' });
        }

        const attendance = new Attendance({
            user: id,
            slot: slot,
            date: new Date().setHours(0, 0, 0, 0), // Store date only
            checkInTime: timeStamp,
            action: action,
            location: location,
            student: { email: studentId }

        });

        const newAttendance = await attendance.save();

        if (req.io) {
            const allLive = await Attendance.find();
            req.io.emit("attendance_updated", allLive);
        }

        return res.status(201).json({ success: true, data: newAttendance });
    } catch (error) {
        console.error('Attendance checkIn error:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Check-out a user
// @route   POST /api/attendance/checkout/:id
// @access  Private
const checkOut = async (req, res) => {
    const userId = req.params.id || req.body.id;
    const { action } = req.body;

    try {
        const attendance = await Attendance.findOne({ user: userId, checkOutTime: null });
        if (!attendance) {
            return res.status(400).json({ message: 'User is not checked in' });
        }

        attendance.checkOutTime = new Date();
        if (action) attendance.action = action;
        const updatedAttendance = await attendance.save();

        if (req.io) {
            const allLive = await Attendance.find();
            req.io.emit("attendance_updated", allLive);
        }

        return res.status(200).json({ success: true, data: updatedAttendance });
    } catch (error) {
        console.error('Attendance checkOut error:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get attendance history for a user
// @route   GET /api/attendance/history/:userId
// @access  Private
const getAttendanceHistory = async (req, res) => {
    try {
        // A user can only get their own history, unless they are an admin
        const userId = (req.user.role === 'admin') ? req.params.userId : req.user._id;

        const history = await Attendance.find({ user: userId }).populate('slot', 'name').sort({ checkInTime: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get live attendance
// @route   GET /api/attendance/live
// @access  Private/Admin
const getLiveAttendance = async (req, res) => {
    try {
        const io = req.io;
        console.log(io);
        const liveUsers = await Attendance.find();


        res.json({ success: true, data: liveUsers });
        io.emit("attendance_updated", liveUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message)
    }
};

export { checkIn, checkOut, getAttendanceHistory, getLiveAttendance };
