import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    athleteId: { type: String },
    athleteName: { type: String, required: true },
    sport: { type: String, default: 'Football' },
    plan: { type: String, default: 'Pro Academy Monthly' },
    amount: { type: Number, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    dueDate: { type: String },
    method: { type: String, default: 'UPI (GPay)' },
    status: { type: String, enum: ['Completed', 'Pending', 'Failed', 'Refunded'], default: 'Completed' },
    receiptNo: { type: String, unique: true },
    transactionRef: { type: String },
    note: { type: String }
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);
