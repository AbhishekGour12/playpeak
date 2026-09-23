import express from 'express';
import Inventory from '../models/Inventory.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await Inventory.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: items.length, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `GEAR-${Math.floor(100 + Math.random() * 900)}`;
        const item = new Inventory({ ...req.body, id });
        const saved = await item.save();
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Inventory.findOneAndUpdate(
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
        await Inventory.findOneAndDelete({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
        res.json({ success: true, message: 'Gear item removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/bulk-sync', async (req, res) => {
    try {
        const { inventory } = req.body;
        if (!Array.isArray(inventory)) return res.status(400).json({ success: false, message: 'Invalid data' });
        for (const item of inventory) {
            await Inventory.findOneAndUpdate({ id: item.id }, { $set: item }, { upsert: true, new: true });
        }
        const all = await Inventory.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
