import Payment from '../models/Payment.js';
import User from '../models/User.js';

// @desc    Get all payments (auto-seeds mock payments if database is empty)
// @route   GET /api/payments
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
    try {
        let payments = await Payment.find({}).populate('user', 'name email phone slot').sort({ createdAt: -1 });

        // If empty, let's auto-seed some mock payments for users in the database
        if (payments.length === 0) {
            const users = await User.find({});
            if (users.length > 0) {
                const seedPayments = [];
                // Add a completed membership payment and a late fee payment for some users
                for (let i = 0; i < Math.min(users.length, 5); i++) {
                    const user = users[i];
                    seedPayments.push({
                        user: user._id,
                        amount: user.role === 'admin' ? 50 : 25,
                        description: 'Monthly Premium Membership Fee',
                        status: 'completed',
                        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
                    });
                    
                    if (i % 2 === 0) {
                        seedPayments.push({
                            user: user._id,
                            amount: 5,
                            description: 'Late Return Fee - Overdue Book',
                            status: 'completed',
                            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
                        });
                    }

                    if (i === 1 || i === 3) {
                        seedPayments.push({
                            user: user._id,
                            amount: 3.50,
                            description: 'Printing & Photocopying services',
                            status: 'pending',
                            date: new Date()
                        });
                    }
                }
                
                if (seedPayments.length > 0) {
                    await Payment.insertMany(seedPayments);
                    payments = await Payment.find({}).populate('user', 'name email phone slot').sort({ createdAt: -1 });
                }
            }
        }

        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get payments for current logged-in user
// @route   GET /api/payments/my
// @access  Private
export const getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Create a payment / log transaction
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res) => {
    const { amount, description, status } = req.body;

    try {
        const payment = new Payment({
            user: req.user._id,
            amount: Number(amount),
            description: description || 'Library Service Payment',
            status: status || 'completed',
            date: new Date()
        });

        const savedPayment = await payment.save();

        // Update student late fees in user profile if it's a late fee description
        if (description.toLowerCase().includes('late') && req.user.lateFees > 0) {
            await User.findByIdAndUpdate(req.user._id, {
                $set: { lateFees: Math.max(0, req.user.lateFees - amount) }
            });
        }

        res.status(201).json({ success: true, data: savedPayment });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error processing payment', error: error.message });
    }
};
