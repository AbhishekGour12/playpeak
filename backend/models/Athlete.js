import mongoose from 'mongoose';

const AthleteSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    age: { type: Number, default: 16 },
    gender: { type: String, default: 'Male' },
    sport: { type: String, required: true, default: 'Football' },
    batchTime: { type: String, default: 'Evening Prime (05:00 PM - 07:00 PM)' },
    coach: { type: String, default: 'Coach Rajesh Sharma (AFC Pro)' },
    planType: { type: String, default: 'Monthly' },
    membership: { type: String, default: 'Pro Academy Monthly' },
    feeAmount: { type: Number, default: 3999 },
    amountPaid: { type: Number, default: 3999 },
    dueAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['Paid', 'Partial', 'Due'], default: 'Paid' },
    emergencyContact: { type: String },
    bloodGroup: { type: String, default: 'B+' },
    joinDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, enum: ['Active', 'Pending', 'Inactive', 'Suspended'], default: 'Active' },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Athlete', AthleteSchema);
