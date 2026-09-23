import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    sport: { type: String, default: 'Football' },
    planInterested: { type: String, default: 'Pro Academy Monthly' },
    message: { type: String },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, enum: ['New', 'Contacted', 'Trial Scheduled', 'Enrolled', 'Closed'], default: 'New' },
    trialDate: { type: String }
}, { timestamps: true });

export default mongoose.model('Inquiry', InquirySchema);
