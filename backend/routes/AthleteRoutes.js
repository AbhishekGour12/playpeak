import express from 'express';
import Athlete from '../models/Athlete.js';

const router = express.Router();

// GET all athletes with optional sport and status filtering
router.get('/', async (req, res) => {
    try {
        const { sport, status, search } = req.query;
        let query = {};

        if (sport && sport !== 'All') query.sport = sport;
        if (status && status !== 'All') query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { sport: { $regex: search, $options: 'i' } },
                { id: { $regex: search, $options: 'i' } }
            ];
        }

        const athletes = await Athlete.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: athletes.length, data: athletes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single athlete by ID
router.get('/:id', async (req, res) => {
    try {
        const athlete = await Athlete.findOne({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
        if (!athlete) return res.status(404).json({ success: false, message: 'Athlete not found' });
        res.json({ success: true, data: athlete });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE new athlete
router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `ATH-${Math.floor(100 + Math.random() * 900)}`;
        const athlete = new Athlete({ ...req.body, id });
        const saved = await athlete.save();
        if (req.io) req.io.emit('athlete_created', saved);
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// UPDATE athlete by ID
router.put('/:id', async (req, res) => {
    try {
        const updated = await Athlete.findOneAndUpdate(
            { $or: [{ _id: req.params.id }, { id: req.params.id }] },
            { $set: req.body },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: 'Athlete not found' });
        if (req.io) req.io.emit('athlete_updated', updated);
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE athlete by ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Athlete.findOneAndDelete({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
        if (!deleted) return res.status(404).json({ success: false, message: 'Athlete not found' });
        if (req.io) req.io.emit('athlete_deleted', deleted);
        res.json({ success: true, message: 'Athlete removed from academy records' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// BULK SYNC (Saves array of athletes)
router.post('/bulk-sync', async (req, res) => {
    try {
        const { athletes } = req.body;
        if (!Array.isArray(athletes)) return res.status(400).json({ success: false, message: 'Invalid data' });
        
        for (const ath of athletes) {
            await Athlete.findOneAndUpdate(
                { id: ath.id },
                { $set: ath },
                { upsert: true, new: true }
            );
        }
        const all = await Athlete.find({}).sort({ createdAt: -1 });
        res.json({ success: true, message: 'Athletes synced with MongoDB', data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
