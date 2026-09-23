import mongoose from 'mongoose';

const MembershipPlanSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    sport: { type: String, default: 'All' },
    duration: { type: String, default: '1 Month' },
    price: { type: Number, required: true },
    period: { type: String, default: '/month' },
    badge: { type: String, default: 'Standard' },
    popular: { type: Boolean, default: false },
    features: [{ type: String }],
    activeMembers: { type: Number, default: 0 },
    description: { type: String }
}, { timestamps: true });

export default mongoose.model('MembershipPlan', MembershipPlanSchema);
