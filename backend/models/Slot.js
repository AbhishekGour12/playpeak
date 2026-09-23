import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
    name: { type: String, required: true }, // e.g., "Morning Slot"
    startTime: { type: String, required: true }, // e.g., "09:00"
    endTime: { type: String, required: true }, // e.g., "13:00"
    capacity: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
});

const Slot = mongoose.model('Slot', SlotSchema);

export default Slot;
