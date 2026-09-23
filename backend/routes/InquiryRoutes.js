import express from 'express';
import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

const getQueryFilter = (id) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    return isObjectId ? { $or: [{ _id: id }, { id: id }] } : { id: id };
};

router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: inquiries.length, data: inquiries });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `LEAD-${Math.floor(100 + Math.random() * 900)}`;
        const inquiry = new Inquiry({ ...req.body, id });
        const saved = await inquiry.save();
        if (req.io) req.io.emit('new_inquiry_received', saved);
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Inquiry.findOneAndUpdate(
            getQueryFilter(req.params.id),
            { $set: req.body },
            { new: true }
        );
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Inquiry.findOneAndDelete(getQueryFilter(req.params.id));
        res.json({ success: true, message: 'Inquiry removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/bulk-sync', async (req, res) => {
    try {
        const { inquiries } = req.body;
        if (!Array.isArray(inquiries)) return res.status(400).json({ success: false, message: 'Invalid data' });
        for (const i of inquiries) {
            await Inquiry.findOneAndUpdate({ id: i.id }, { $set: i }, { upsert: true, new: true });
        }
        const all = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
