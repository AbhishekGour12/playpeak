import express from 'express';
import mongoose from 'mongoose';
import Coach from '../models/Coach.js';

const router = express.Router();

const getQueryFilter = (id) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    return isObjectId ? { $or: [{ _id: id }, { id: id }] } : { id: id };
};

router.get('/', async (req, res) => {
    try {
        const coaches = await Coach.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: coaches.length, data: coaches });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `COACH-${Math.floor(100 + Math.random() * 900)}`;
        const coach = new Coach({ ...req.body, id });
        const saved = await coach.save();
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Coach.findOneAndUpdate(
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
        await Coach.findOneAndDelete(getQueryFilter(req.params.id));
        res.json({ success: true, message: 'Coach removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/bulk-sync', async (req, res) => {
    try {
        const { coaches } = req.body;
        if (!Array.isArray(coaches)) return res.status(400).json({ success: false, message: 'Invalid data' });
        for (const c of coaches) {
            await Coach.findOneAndUpdate({ id: c.id }, { $set: c }, { upsert: true, new: true });
        }
        const all = await Coach.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
