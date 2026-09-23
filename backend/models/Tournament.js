import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: { type: String, required: true },
    sport: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String, default: 'PlayPeak Main Arena' },
    prizePool: { type: String, default: '₹50,000' },
    entryFee: { type: String, default: '₹1,500 / Team' },
    teamsRegistered: { type: Number, default: 8 },
    maxTeams: { type: Number, default: 16 },
    status: { type: String, enum: ['Open for Registration', 'Upcoming', 'Ongoing', 'Completed'], default: 'Open for Registration' },
    winner: { type: String }
}, { timestamps: true });

export default mongoose.model('Tournament', TournamentSchema);
