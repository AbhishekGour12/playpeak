import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SeatSchema = new Schema({
    seatNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['empty', 'reserved'], default: 'empty' },
    allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    slot: { type: String, default: '' } // e.g., Morning, Late Morning, Afternoon, Evening
}, { timestamps: true });

const Seat = mongoose.model('Seat', SeatSchema);

export default Seat;
