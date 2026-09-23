import express from 'express';
import mongoose from 'mongoose';
import Payment from '../models/Payment.js';

const router = express.Router();

const getQueryFilter = (id) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    return isObjectId ? { $or: [{ _id: id }, { id: id }] } : { id: id };
};

// GET all payments
router.get('/', async (req, res) => {
    try {
        const { status, athleteId } = req.query;
        let query = {};
        if (status && status !== 'All') query.status = status;
        if (athleteId) query.athleteId = athleteId;

        const payments = await Payment.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: payments.length, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE payment
router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `PAY-${Math.floor(100 + Math.random() * 900)}`;
        const receiptNo = req.body.receiptNo || `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const payment = new Payment({ ...req.body, id, receiptNo });
        const saved = await payment.save();
        if (req.io) req.io.emit('payment_recorded', saved);
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// UPDATE payment
router.put('/:id', async (req, res) => {
    try {
        const updated = await Payment.findOneAndUpdate(
            getQueryFilter(req.params.id),
            { $set: req.body },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Payment.findOneAndDelete(getQueryFilter(req.params.id));
        if (!deleted) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, message: 'Payment record deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// BULK SYNC
router.post('/bulk-sync', async (req, res) => {
    try {
        const { payments } = req.body;
        if (!Array.isArray(payments)) return res.status(400).json({ success: false, message: 'Invalid data' });
        
        for (const pay of payments) {
            await Payment.findOneAndUpdate(
                { id: pay.id },
                { $set: pay },
                { upsert: true, new: true }
            );
        }
        const all = await Payment.find({}).sort({ createdAt: -1 });
        res.json({ success: true, message: 'Payments synced with MongoDB', data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
