import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    user: { type: Object, require: true},
    slot: { type: String,  required: true },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date, default: null },
    date: { type: Date, required: true },
    action: { type: String, require: true },
    location: { type: Object, require: true },
    student: {
        type: Object, require: true
    }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);

export default Attendance;