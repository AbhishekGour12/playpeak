import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'FiBook' }, // React icon name
    features: [{ type: String }]
}, { timestamps: true });

const Service = mongoose.model('Service', ServiceSchema);

export default Service;
