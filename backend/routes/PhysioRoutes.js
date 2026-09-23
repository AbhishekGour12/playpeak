import express from 'express';
import PhysioLog from '../models/PhysioLog.js';

const router = express.Router();

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
            { $or: [{ _id: req.params.id }, { id: req.params.id }] },
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
        await PhysioLog.findOneAndDelete({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
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
