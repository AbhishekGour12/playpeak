import mongoose from 'mongoose';

const CoachSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    sport: { type: String, required: true },
    role: { type: String, default: 'Head Coach' },
    phone: { type: String },
    email: { type: String },
    experience: { type: String, default: '5+ Years' },
    license: { type: String, default: 'Certified Pro' },
    rating: { type: Number, default: 4.9 },
    activeStudents: { type: Number, default: 15 },
    status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
    bio: { type: String }
}, { timestamps: true });

export default mongoose.model('Coach', CoachSchema);
