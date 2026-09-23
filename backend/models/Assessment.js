import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    athleteName: { type: String, required: true },
    sport: { type: String, default: 'Football' },
    evaluator: { type: String, default: 'Coach Elena Rostova' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    sprint40m: { type: String, default: '4.95s' },
    verticalJump: { type: String, default: '64 cm' },
    vo2Max: { type: String, default: '54 ml/kg' },
    agilityIndex: { type: String, default: '9.2 / 10' },
    overallScore: { type: String, default: 'Elite Level' },
    recommendations: { type: String }
}, { timestamps: true });

export default mongoose.model('Assessment', AssessmentSchema);
