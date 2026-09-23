import express from 'express';
import mongoose from 'mongoose';
import PhysioLog from '../models/PhysioLog.js';

const router = express.Router();

const getQueryFilter = (id) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    return isObjectId ? { $or: [{ _id: id }, { id: id }] } : { id: id };
};

router.get('/', async (req, res) => {
    try {
        const logs = await PhysioLog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: logs.length, data: logs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `PHY-${Math.floor(100 + Math.random() * 900)}`;
        const log = new PhysioLog({ ...req.body, id });
        const saved = await log.save();
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await PhysioLog.findOneAndUpdate(
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
        await PhysioLog.findOneAndDelete(getQueryFilter(req.params.id));
        res.json({ success: true, message: 'Physio log deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/bulk-sync', async (req, res) => {
    try {
        const { physioLogs } = req.body;
        if (!Array.isArray(physioLogs)) return res.status(400).json({ success: false, message: 'Invalid data' });
        for (const p of physioLogs) {
            await PhysioLog.findOneAndUpdate({ id: p.id }, { $set: p }, { upsert: true, new: true });
        }
        const all = await PhysioLog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
