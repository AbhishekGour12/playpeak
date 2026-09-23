import mongoose from 'mongoose';

const PhysioLogSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    athleteName: { type: String, required: true },
    sport: { type: String, default: 'Football' },
    injury: { type: String, required: true },
    therapist: { type: String, default: 'Dr. Neha Verma (Sports PT)' },
    sessionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    recoveryStatus: { type: String, enum: ['Under Treatment', 'Rehab Phase', 'Cleared to Play', 'Evaluating'], default: 'Under Treatment' },
    rehabPlan: { type: String },
    clearanceDate: { type: String }
}, { timestamps: true });

export default mongoose.model('PhysioLog', PhysioLogSchema);
