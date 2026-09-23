import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String },
    sport: { type: String, default: 'Football' },
    address: { type: String },
    slot: { type: String, default: '' },
    membership: {
        status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' },
        planName: { type: String, default: 'Pro Academy Monthly' },
        expiryDate: { type: Date }
    },
    lateFees: { type: Number, default: 0 },
}, { timestamps: true });

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema);

export default User;
