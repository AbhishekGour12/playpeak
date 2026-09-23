import express from 'express';
import Tournament from '../models/Tournament.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const list = await Tournament.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: list.length, data: list });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `TRN-${Math.floor(100 + Math.random() * 900)}`;
        const tournament = new Tournament({ ...req.body, id });
        const saved = await tournament.save();
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Tournament.findOneAndUpdate(
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
        await Tournament.findOneAndDelete({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
        res.json({ success: true, message: 'Tournament deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/bulk-sync', async (req, res) => {
    try {
        const { tournaments } = req.body;
        if (!Array.isArray(tournaments)) return res.status(400).json({ success: false, message: 'Invalid data' });
        for (const t of tournaments) {
            await Tournament.findOneAndUpdate({ id: t.id }, { $set: t }, { upsert: true, new: true });
        }
        const all = await Tournament.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
