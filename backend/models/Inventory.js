import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
    id: { type: String, unique: true },
    item: { type: String, required: true },
    category: { type: String, default: 'Balls & Gear' },
    sport: { type: String, required: true },
    totalStock: { type: Number, default: 20 },
    available: { type: Number, default: 15 },
    inUse: { type: Number, default: 5 },
    unitPrice: { type: Number, default: 1200 },
    location: { type: String, default: 'Locker Room Sector A' },
    lastAudited: { type: String, default: () => new Date().toISOString().split('T')[0] },
    condition: { type: String, enum: ['Good', 'Fair', 'Needs Replacement'], default: 'Good' }
}, { timestamps: true });

export default mongoose.model('Inventory', InventorySchema);
