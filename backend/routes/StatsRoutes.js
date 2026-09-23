import express from 'express';
import Athlete from '../models/Athlete.js';
import Payment from '../models/Payment.js';
import Coach from '../models/Coach.js';
import Tournament from '../models/Tournament.js';
import PhysioLog from '../models/PhysioLog.js';
import Assessment from '../models/Assessment.js';
import Inventory from '../models/Inventory.js';
import MembershipPlan from '../models/MembershipPlan.js';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// GET Live Dashboard Overview Stats
router.get('/overview', async (req, res) => {
    try {
        const [
            athletes,
            payments,
            coaches,
            tournaments,
            physioLogs,
            assessments,
            inventory,
            plans,
            inquiries
        ] = await Promise.all([
            Athlete.find({}),
            Payment.find({}),
            Coach.find({}),
            Tournament.find({}),
            PhysioLog.find({}),
            Assessment.find({}),
            Inventory.find({}),
            MembershipPlan.find({}),
            Inquiry.find({})
        ]);

        const totalRevenue = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
        const activeAthletes = athletes.filter(a => a.status === 'Active').length;
        const feeDueCount = athletes.filter(a => Number(a.dueAmount) > 0 || a.paymentStatus === 'Due').length;
        const pendingLeads = inquiries.filter(i => i.status === 'New').length;

        res.json({
            success: true,
            data: {
                totalAthletes: athletes.length,
                activeAthletes,
                totalRevenue,
                feeDueCount,
                coachesCount: coaches.length,
                tournamentsCount: tournaments.length,
                physioActiveCount: physioLogs.filter(p => p.recoveryStatus !== 'Cleared to Play').length,
                assessmentsCount: assessments.length,
                inventoryItemsCount: inventory.length,
                plansCount: plans.length,
                pendingLeadsCount: pendingLeads,
                recentPayments: payments.slice(0, 5),
                recentAthletes: athletes.slice(0, 5)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
