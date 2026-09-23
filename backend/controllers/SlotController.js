import Slot from "../models/Slot.js";

// @desc    Create a new time slot
// @route   POST /api/slots
// @access  Private/Admin
const createSlot = async (req, res) => {
    const { name, startTime, endTime, capacity } = req.body;
    try {
        const slot = new Slot({ name, startTime, endTime, capacity });
        const createdSlot = await slot.save();
        res.status(201).json(createdSlot);
    } catch (error) {
        res.status(400).json({ message: 'Error creating slot', error: error.message });
    }
};

// @desc    Get all time slots
// @route   GET /api/slots
// @access  Private/Admin
const getAllSlots = async (req, res) => {
    try {
        const slots = await Slot.find({});
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a time slot
// @route   PUT /api/slots/:id
// @access  Private/Admin
const updateSlot = async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (slot) {
            slot.name = req.body.name || slot.name;
            slot.startTime = req.body.startTime || slot.startTime;
            slot.endTime = req.body.endTime || slot.endTime;
            slot.capacity = req.body.capacity || slot.capacity;
            slot.isActive = req.body.isActive !== undefined ? req.body.isActive : slot.isActive;

            const updatedSlot = await slot.save();
            res.json(updatedSlot);
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating slot', error: error.message });
    }
};

// @desc    Delete a time slot
// @route   DELETE /api/slots/:id
// @access  Private/Admin
const deleteSlot = async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (slot) {
            await slot.deleteOne();
            res.json({ message: 'Slot removed' });
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
export { createSlot, getAllSlots, updateSlot, deleteSlot };
