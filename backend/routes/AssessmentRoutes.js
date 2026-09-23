import express from 'express';
import Assessment from '../models/Assessment.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const list = await Assessment.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: list.length, data: list });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `FIT-${Math.floor(100 + Math.random() * 900)}`;
        const assessment = new Assessment({ ...req.body, id });
        const saved = await assessment.save();
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Assessment.findOneAndUpdate(
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
        await Assessment.findOneAndDelete({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
        res.json({ success: true, message: 'Assessment report deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/bulk-sync', async (req, res) => {
    try {
        const { assessments } = req.body;
        if (!Array.isArray(assessments)) return res.status(400).json({ success: false, message: 'Invalid data' });
        for (const a of assessments) {
            await Assessment.findOneAndUpdate({ id: a.id }, { $set: a }, { upsert: true, new: true });
        }
        const all = await Assessment.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
