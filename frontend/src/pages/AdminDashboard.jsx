// pages/AdminDashboard.jsx - PlayPeak Sports Academy Full-Featured Responsive PWA Admin Center
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiGrid,
    FiUsers,
    FiDollarSign,
    FiSearch,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiCheckCircle,
    FiAlertCircle,
    FiDownload,
    FiX,
    FiLogOut,
    FiSend,
    FiMapPin,
    FiShield,
    FiZap,
    FiMenu,
    FiRefreshCw,
    FiPhone,
    FiMail,
    FiCheck,
    FiInfo,
    FiActivity,
    FiSliders,
    FiChevronRight,
    FiEye,
    FiBell,
    FiCalendar,
    FiAward,
    FiBox,
    FiMessageSquare,
    FiPrinter,
    FiClock,
    FiCopy,
    FiExternalLink,
    FiSmartphone,
    FiHeart,
    FiTrendingUp
} from 'react-icons/fi';
import { 
    FaFutbol, 
    FaBasketballBall, 
    FaSwimmer, 
    FaDumbbell, 
    FaTrophy, 
    FaWhatsapp, 
    FaQrcode,
    FaMedal
} from 'react-icons/fa';
import { 
    GiCricketBat, 
    GiShuttlecock, 
    GiTennisRacket, 
    GiPunchingBag, 
    GiWhistle,
    GiHealing,
    GiStopwatch
} from 'react-icons/gi';
import { 
    MdOutlineStadium, 
    MdOutlineSportsScore, 
    MdOutlineFitnessCenter,
    MdSportsSoccer 
} from 'react-icons/md';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { userinfo } from '../features/userinfo';

const AdminDashboard = () => {
    // Current Active Tab
    const [activeTab, setActiveTab] = useState('overview'); 
    // Tabs: overview, athletes, payments, reminders, coaches, inventory, memberships, tournaments, physio, assessments, inquiries

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [toastMessage, setToastMessage] = useState(null);
    const [filterSport, setFilterSport] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // PWA Install Prompt State
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallModal, setShowInstallModal] = useState(false);

    // Modals state
    const [showAddAthleteModal, setShowAddAthleteModal] = useState(false);
    const [editingAthlete, setEditingAthlete] = useState(null);
    const [viewingAthleteCard, setViewingAthleteCard] = useState(null);
    const [athletePassQrDataUrl, setAthletePassQrDataUrl] = useState('');
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [showMembershipQrModal, setShowMembershipQrModal] = useState(false);
    const [selectedPlanQr, setSelectedPlanQr] = useState(null);
    const [membershipQrDataUrl, setMembershipQrDataUrl] = useState('');

    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);

    const [showAddCoachModal, setShowAddCoachModal] = useState(false);
    const [editingCoach, setEditingCoach] = useState(null);

    const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
    const [editingInventory, setEditingInventory] = useState(null);

    const [showAddPlanModal, setShowAddPlanModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const [showAddTournamentModal, setShowAddTournamentModal] = useState(false);
    const [editingTournament, setEditingTournament] = useState(null);

    const [showAddPhysioModal, setShowAddPhysioModal] = useState(false);
    const [editingPhysio, setEditingPhysio] = useState(null);

    const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);

    const [showAddInquiryModal, setShowAddInquiryModal] = useState(false);
    const [editingInquiry, setEditingInquiry] = useState(null);

    const [broadcastingNotice, setBroadcastingNotice] = useState(false);

    // Redux & Navigation
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sportsList = [
        { name: 'Football', coach: 'Coach Rajesh Sharma (AFC Pro)', monthly: 3999, yearly: 39990, quarterly: 10499 },
        { name: 'Cricket', coach: 'Coach Vikram Singh (BCCI)', monthly: 3499, yearly: 34990, quarterly: 9499 },
        { name: 'Basketball', coach: 'Coach Rahul Nair (FIBA)', monthly: 3799, yearly: 37990, quarterly: 9999 },
        { name: 'Badminton', coach: 'Coach Ananya Sen (National)', monthly: 2499, yearly: 24990, quarterly: 6999 },
        { name: 'Swimming', coach: 'Coach Vikram Joshi', monthly: 3200, yearly: 32000, quarterly: 8600 },
        { name: 'Tennis', coach: 'Coach Elena Rostova', monthly: 3400, yearly: 34000, quarterly: 9200 },
        { name: 'Combat / MMA', coach: 'Coach Devendra Patil', monthly: 2999, yearly: 29990, quarterly: 7999 },
        { name: 'Strength & Conditioning', coach: 'Coach Elena Rostova', monthly: 2499, yearly: 24990, quarterly: 6999 },
        { name: 'Pro Esports', coach: 'Coach Tyler Ray', monthly: 2200, yearly: 22000, quarterly: 5999 }
    ];

    // Listen for PWA BeforeInstallPrompt Event
    useEffect(() => {
        if (window.deferredPWAInstallPrompt) {
            setDeferredPrompt(window.deferredPWAInstallPrompt);
        }
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            window.deferredPWAInstallPrompt = e;
            setDeferredPrompt(e);
        };
        const handlePromptReady = () => {
            setDeferredPrompt(window.deferredPWAInstallPrompt);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('pwa-prompt-ready', handlePromptReady);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('pwa-prompt-ready', handlePromptReady);
        };
    }, []);

    const handleTriggerInstall = () => {
        const promptEvent = deferredPrompt || window.deferredPWAInstallPrompt;
        if (promptEvent) {
            promptEvent.prompt();
            promptEvent.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    showToast('🎉 PlayPeak App added to Home Screen as mobile app!');
                }
                window.deferredPWAInstallPrompt = null;
                setDeferredPrompt(null);
            });
        } else {
            setShowInstallModal(true);
        }
    };




    // ==========================================
    // INITIAL SEED DATA & LOCAL STORAGE LOADERS
    // ==========================================

    const [athletes, setAthletes] = useState(() => {
        const saved = localStorage.getItem('playpeak_athletes');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            {
                id: 'ATH-101',
                name: 'Aarav Sharma',
                phone: '+91 98261 55678',
                email: 'aarav.football@gmail.com',
                age: 15,
                gender: 'Male',
                sport: 'Football',
                batchTime: 'Evening Prime (05:00 PM - 07:00 PM)',
                coach: 'Coach Rajesh Sharma (AFC Pro)',
                planType: 'Monthly',
                membership: 'Pro Academy Monthly',
                feeAmount: 3999,
                dueAmount: 0,
                paymentStatus: 'Paid',
                joinDate: '2026-08-01',
                emergencyContact: '+91 98261 55600 (Father)',
                bloodGroup: 'B+',
                status: 'Active'
            },
            {
                id: 'ATH-102',
                name: 'Rohan Mehra',
                phone: '+91 97554 22331',
                email: 'rohan.cricket@gmail.com',
                age: 17,
                gender: 'Male',
                sport: 'Cricket',
                batchTime: 'Morning Dawn (06:00 AM - 08:30 AM)',
                coach: 'Coach Vikram Singh (BCCI)',
                planType: 'Yearly',
                membership: 'Ranji Elite Annual',
                feeAmount: 34990,
                dueAmount: 12000,
                paymentStatus: 'Due',
                joinDate: '2026-07-15',
                emergencyContact: '+91 97554 22300 (Mother)',
                bloodGroup: 'O+',
                status: 'Active'
            },
            {
                id: 'ATH-103',
                name: 'Ananya Verma',
                phone: '+91 94071 88992',
                email: 'ananya.badminton@gmail.com',
                age: 14,
                gender: 'Female',
                sport: 'Badminton',
                batchTime: 'Evening Prime (04:30 PM - 06:30 PM)',
                coach: 'Coach Ananya Sen (National)',
                planType: 'Monthly',
                membership: 'Junior Shuttler Pass',
                feeAmount: 2499,
                dueAmount: 0,
                paymentStatus: 'Paid',
                joinDate: '2026-08-10',
                emergencyContact: '+91 94071 88900',
                bloodGroup: 'A+',
                status: 'Active'
            },
            {
                id: 'ATH-104',
                name: 'Kabir Patel',
                phone: '+91 99812 44332',
                email: 'kabir.basketball@gmail.com',
                age: 16,
                gender: 'Male',
                sport: 'Basketball',
                batchTime: 'Evening Prime (05:30 PM - 07:30 PM)',
                coach: 'Coach Rahul Nair (FIBA)',
                planType: 'Monthly',
                membership: 'Pro Academy Monthly',
                feeAmount: 3799,
                dueAmount: 3799,
                paymentStatus: 'Overdue',
                joinDate: '2026-06-20',
                emergencyContact: '+91 99812 44300',
                bloodGroup: 'AB+',
                status: 'Active'
            },
            {
                id: 'ATH-105',
                name: 'Sneha Kulkarni',
                phone: '+91 98765 11223',
                email: 'sneha.swim@gmail.com',
                age: 13,
                gender: 'Female',
                sport: 'Swimming',
                batchTime: 'Morning Dawn (06:00 AM - 07:30 AM)',
                coach: 'Coach Vikram Joshi',
                planType: 'Yearly',
                membership: 'Aquatics Pro Annual',
                feeAmount: 32000,
                dueAmount: 0,
                paymentStatus: 'Paid',
                joinDate: '2026-08-05',
                emergencyContact: '+91 98765 11200',
                bloodGroup: 'O+',
                status: 'Active'
            },
            {
                id: 'ATH-106',
                name: 'Devendra Singh',
                phone: '+91 91234 56789',
                email: 'dev.combat@gmail.com',
                age: 19,
                gender: 'Male',
                sport: 'Combat / MMA',
                batchTime: 'Night Lights (07:30 PM - 09:30 PM)',
                coach: 'Coach Devendra Patil',
                planType: 'Monthly',
                membership: 'MMA Striker Monthly',
                feeAmount: 2999,
                dueAmount: 2999,
                paymentStatus: 'Overdue',
                joinDate: '2026-05-12',
                emergencyContact: '+91 91234 56700',
                bloodGroup: 'B-',
                status: 'Active'
            }
        ];
    });

    const [payments, setPayments] = useState(() => {
        const saved = localStorage.getItem('playpeak_payments');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'PAY-901', athleteId: 'ATH-101', athleteName: 'Aarav Sharma', sport: 'Football', plan: 'Pro Academy Monthly', amount: 3999, date: '2026-09-01', dueDate: '2026-10-01', method: 'UPI (GPay)', status: 'Completed', receiptNo: 'RCP-2026-0891' },
            { id: 'PAY-902', athleteId: 'ATH-102', athleteName: 'Rohan Mehra', sport: 'Cricket', plan: 'Ranji Elite Annual', amount: 22990, date: '2026-08-15', dueDate: '2026-09-15', method: 'Debit Card', status: 'Completed', receiptNo: 'RCP-2026-0892' },
            { id: 'PAY-903', athleteId: 'ATH-103', athleteName: 'Ananya Verma', sport: 'Badminton', plan: 'Junior Shuttler Monthly', amount: 2499, date: '2026-09-05', dueDate: '2026-10-05', method: 'Cash Offline', status: 'Completed', receiptNo: 'RCP-2026-0893' },
            { id: 'PAY-904', athleteId: 'ATH-105', athleteName: 'Sneha Kulkarni', sport: 'Swimming', plan: 'Aquatics Pro Annual', amount: 32000, date: '2026-09-08', dueDate: '2026-10-08', method: 'UPI (PhonePe)', status: 'Completed', receiptNo: 'RCP-2026-0894' },
            { id: 'PAY-905', athleteId: 'ATH-104', athleteName: 'Kabir Patel', sport: 'Basketball', plan: 'Pro Academy Monthly', amount: 3799, date: '2026-08-01', dueDate: '2026-09-01', method: 'Netbanking', status: 'Completed', receiptNo: 'RCP-2026-0895' }
        ];
    });

    const [coaches, setCoaches] = useState(() => {
        const saved = localStorage.getItem('playpeak_coaches');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'COA-01', name: 'Rajesh Sharma', sport: 'Football', certification: 'AFC Pro License & UEFA-A', phone: '+91 98261 11223', email: 'rajesh.football@playpeaksports.com', experience: 12, trainees: 48, monthlySalary: '₹75,000', rating: 4.9, status: 'Active' },
            { id: 'COA-02', name: 'Vikram Singh', sport: 'Cricket', certification: 'BCCI Level-3 Certified Coach', phone: '+91 97554 33445', email: 'vikram.cricket@playpeaksports.com', experience: 15, trainees: 54, monthlySalary: '₹85,000', rating: 4.9, status: 'Active' },
            { id: 'COA-03', name: 'Ananya Sen', sport: 'Badminton', certification: 'BWF Certified & Ex-National Champ', phone: '+91 94071 55667', email: 'ananya.badminton@playpeaksports.com', experience: 9, trainees: 36, monthlySalary: '₹65,000', rating: 4.8, status: 'Active' },
            { id: 'COA-04', name: 'Rahul Nair', sport: 'Basketball', certification: 'FIBA Level-2 International Coach', phone: '+91 99812 77889', email: 'rahul.hoops@playpeaksports.com', experience: 10, trainees: 40, monthlySalary: '₹70,000', rating: 4.8, status: 'Active' },
            { id: 'COA-05', name: 'Elena Rostova', sport: 'Strength & Conditioning', certification: 'CSCS & Olympic Biomechanics', phone: '+91 98765 99001', email: 'elena.strength@playpeaksports.com', experience: 11, trainees: 65, monthlySalary: '₹90,000', rating: 4.9, status: 'Active' }
        ];
    });

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('playpeak_inventory');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'EQP-101', name: 'FIFA Pro Match Footballs (Size 5)', sport: 'Football', category: 'Balls & Turf Gear', totalQty: 45, availableQty: 38, damagedQty: 7, location: 'Turf Shed Rack A', minThreshold: 15, unitCost: '₹2,400' },
            { id: 'EQP-102', name: 'Merlin Automated Bowling Machine Balls', sport: 'Cricket', category: 'Bowling Gear', totalQty: 80, availableQty: 72, damagedQty: 8, location: 'Cricket Pavilion Box 2', minThreshold: 30, unitCost: '₹850' },
            { id: 'EQP-103', name: 'Yonex Aerosensa 50 Feather Shuttles', sport: 'Badminton', category: 'Shuttles & Mats', totalQty: 120, availableQty: 95, damagedQty: 25, location: 'Court Hub Cabinet 4', minThreshold: 40, unitCost: '₹280' },
            { id: 'EQP-104', name: 'Molten FIBA BG4500 Basketballs (Size 7)', sport: 'Basketball', category: 'Balls & Hoops', totalQty: 30, availableQty: 26, damagedQty: 4, location: 'Indoor Arena Locker 1', minThreshold: 10, unitCost: '₹3,200' },
            { id: 'EQP-105', name: 'Eleiko Olympic Weight Plates (20kg Bumper)', sport: 'Strength & Conditioning', category: 'Gym & Lifting', totalQty: 24, availableQty: 24, damagedQty: 0, location: 'Strength Lab Platform 3', minThreshold: 8, unitCost: '₹8,500' },
            { id: 'EQP-106', name: 'Speed Agility Cones & Slalom Poles', sport: 'Football', category: 'Training Gear', totalQty: 150, availableQty: 140, damagedQty: 10, location: 'Ground Equipment Bin', minThreshold: 50, unitCost: '₹120' }
        ];
    });

    const [memberships, setMemberships] = useState(() => {
        const saved = localStorage.getItem('playpeak_memberships');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'PLN-01', name: 'Pro Academy Monthly', sport: 'Football / Basketball / Cricket', duration: '1 Month (3x Weekly)', price: 3999, activeAthletes: 74, features: ['3 Pro Coaching Sessions/Wk', 'Turf & Floodlight Access', 'Performance GPS Logging', 'Official Academy Jersey'], badge: 'Most Popular' },
            { id: 'PLN-02', name: 'Junior Grassroots Quarter', sport: 'All Sports (Ages 6-14)', duration: '3 Months', price: 8999, activeAthletes: 52, features: ['Fundamental Skills Drills', 'Weekend Match Leagues', 'Parent Progress Reports', 'Free Equipment Rental'], badge: 'Youth Value' },
            { id: 'PLN-03', name: 'Elite High-Performance Annual', sport: 'Multi-Sport All-Access', duration: '12 Months', price: 29999, activeAthletes: 28, features: ['Unlimited Arena Access', '1-on-1 Biomechanics Review', 'Physio & Ice-Bath Access', 'State & National Trials Prep'], badge: 'Champion Tier' },
            { id: 'PLN-04', name: 'Single Sport Weekend Pass', sport: 'Badminton / Swimming / Tennis', duration: '1 Month (Sat & Sun)', price: 1999, activeAthletes: 41, features: ['Weekend Morning Batches', 'Court Reservation Rights', 'Locker & Shower Access'], badge: 'Weekend' }
        ];
    });

    // Tournaments & Fixtures Seed State
    const [tournaments, setTournaments] = useState(() => {
        const saved = localStorage.getItem('playpeak_tournaments');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'TRN-01', title: 'Indore Inter-Academy Football Championship', sport: 'Football', ageCategory: 'U-17 Boys', startDate: '2026-10-10', endDate: '2026-10-14', teamsCount: 16, prizePool: '₹1,50,000', venue: 'FIFA Pro Turf Arena', status: 'Upcoming' },
            { id: 'TRN-02', title: 'Ranji Junior Cricket Premier Cup', sport: 'Cricket', ageCategory: 'U-19 Open', startDate: '2026-10-20', endDate: '2026-10-25', teamsCount: 12, prizePool: '₹2,00,000', venue: 'PlayPeak Cricket Pavilion', status: 'Upcoming' },
            { id: 'TRN-03', title: 'State Ranking Badminton Smash Masters', sport: 'Badminton', ageCategory: 'Singles & Doubles', startDate: '2026-09-28', endDate: '2026-09-30', teamsCount: 48, prizePool: '₹75,000', venue: 'BWF 6-Court Complex', status: 'In Progress' }
        ];
    });

    // Physio & Injury Recovery Seed State
    const [physioLogs, setPhysioLogs] = useState(() => {
        const saved = localStorage.getItem('playpeak_physio');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'PHY-01', athleteName: 'Kabir Patel', sport: 'Basketball', injuryType: 'Right Ankle Inversion (Grade 1)', injuryDate: '2026-09-18', recoveryStatus: 'In Rehab', therapist: 'Dr. Neha Saxena (PT)', expectedReturn: '2026-10-02', treatment: 'Cryotherapy & Proprioception Drills' },
            { id: 'PHY-02', athleteName: 'Rohan Mehra', sport: 'Cricket', injuryType: 'Lumbar Spine Muscle Tightness', injuryDate: '2026-09-15', recoveryStatus: 'Light Training', therapist: 'Dr. Sameer Khan', expectedReturn: '2026-09-26', treatment: 'Dry Needling & Core Stability' },
            { id: 'PHY-03', athleteName: 'Devendra Singh', sport: 'Combat / MMA', injuryType: 'Left Knee Meniscus Soreness', injuryDate: '2026-09-10', recoveryStatus: 'Match Fit', therapist: 'Dr. Neha Saxena (PT)', expectedReturn: '2026-09-23', treatment: 'Contrast Ice-Bath & Foam Rolling' }
        ];
    });

    // Biomechanics & Fitness Assessments Seed State
    const [assessments, setAssessments] = useState(() => {
        const saved = localStorage.getItem('playpeak_assessments');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'ASM-01', athleteName: 'Aarav Sharma', sport: 'Football', sprint30m: '3.92s', verticalJump: '58 cm', vo2Max: '54.2 ml/kg', deadlift: '110 kg', testDate: '2026-09-12', rating: 'Elite Prospect' },
            { id: 'ASM-02', athleteName: 'Sneha Kulkarni', sport: 'Swimming', sprint30m: '4.45s', verticalJump: '46 cm', vo2Max: '58.0 ml/kg', deadlift: '80 kg', testDate: '2026-09-14', rating: 'State Level' },
            { id: 'ASM-03', athleteName: 'Rohan Mehra', sport: 'Cricket', sprint30m: '4.10s', verticalJump: '52 cm', vo2Max: '51.5 ml/kg', deadlift: '125 kg', testDate: '2026-09-10', rating: 'Ranji Track' }
        ];
    });

    const [inquiries, setInquiries] = useState(() => {
        const saved = localStorage.getItem('playpeak_inquiries');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'INQ-501', name: 'Manish Rawat', phone: '+91 98260 99887', email: 'manish.rawat@gmail.com', sport: 'Football', ageGroup: 'Under 14 (Son)', message: 'Looking for weekend football training batch with AFC licensed coaches.', date: '2026-09-22', status: 'New' },
            { id: 'INQ-502', name: 'Deepika Sen', phone: '+91 97551 11224', email: 'deepika.sen@yahoo.com', sport: 'Swimming', ageGroup: 'Under 12 (Daughter)', message: 'Need information regarding heated pool safety and beginner lap batches.', date: '2026-09-21', status: 'Trial Scheduled' },
            { id: 'INQ-503', name: 'Kunal Joshi', phone: '+91 94073 44556', email: 'kunal.cricket@gmail.com', sport: 'Cricket', ageGroup: 'Ages 16-19', message: 'Interested in automated bowling machine nets and pace bowling biomechanics analysis.', date: '2026-09-19', status: 'Contacted' },
            { id: 'INQ-504', name: 'Sanjay Patidar', phone: '+91 99814 77880', email: 'sanjay.patidar@gmail.com', sport: 'Badminton', ageGroup: 'Adult Evening', message: 'Want hourly court booking subscription for 4 players with floodlights.', date: '2026-09-18', status: 'Enrolled' }
        ];
    });

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';

    // Fetch live data from MongoDB Atlas on component mount, tab change & socket events
    const fetchMongoData = async () => {
        try {
            const [athRes, payRes, coachRes, tourRes, phyRes, asmRes, invRes, planRes, inqRes] = await Promise.allSettled([
                axios.get(`${API_BASE}athletes`),
                axios.get(`${API_BASE}payments`),
                axios.get(`${API_BASE}coaches`),
                axios.get(`${API_BASE}tournaments`),
                axios.get(`${API_BASE}physio`),
                axios.get(`${API_BASE}assessments`),
                axios.get(`${API_BASE}inventory`),
                axios.get(`${API_BASE}memberships`),
                axios.get(`${API_BASE}inquiries`),
            ]);

            if (athRes.status === 'fulfilled' && Array.isArray(athRes.value.data?.data)) setAthletes(athRes.value.data.data);
            if (payRes.status === 'fulfilled' && Array.isArray(payRes.value.data?.data)) setPayments(payRes.value.data.data);
            if (coachRes.status === 'fulfilled' && Array.isArray(coachRes.value.data?.data)) setCoaches(coachRes.value.data.data);
            if (tourRes.status === 'fulfilled' && Array.isArray(tourRes.value.data?.data)) setTournaments(tourRes.value.data.data);
            if (phyRes.status === 'fulfilled' && Array.isArray(phyRes.value.data?.data)) setPhysioLogs(phyRes.value.data.data);
            if (asmRes.status === 'fulfilled' && Array.isArray(asmRes.value.data?.data)) setAssessments(asmRes.value.data.data);
            if (invRes.status === 'fulfilled' && Array.isArray(invRes.value.data?.data)) setInventory(invRes.value.data.data);
            if (planRes.status === 'fulfilled' && Array.isArray(planRes.value.data?.data)) setMemberships(planRes.value.data.data);
            if (inqRes.status === 'fulfilled' && Array.isArray(inqRes.value.data?.data)) setInquiries(inqRes.value.data.data);
        } catch (err) {
            console.warn('MongoDB Atlas connection sync:', err.message);
        }
    };

    // Auto-reload data whenever admin switches to another tab
    useEffect(() => {
        fetchMongoData();
    }, [activeTab]);

    // Live Socket.io real-time connection across all devices and QR scans
    useEffect(() => {
        let socket = null;
        try {
            const socketUrl = API_BASE.replace(/\/api\/?$/, '');
            socket = io(socketUrl, {
                transports: ['websocket', 'polling'],
                reconnectionAttempts: 10,
                reconnectionDelay: 1000
            });

            socket.on('connect', () => {
                console.log('⚡ Connected to PlayPeak Live Real-Time Socket');
            });

            socket.on('athlete_created', (newAth) => {
                setAthletes(prev => {
                    if (prev.some(a => a.id === newAth.id || a._id === newAth._id)) return prev;
                    return [newAth, ...prev];
                });
                showToast(`⚡ Real-Time Alert: New athlete "${newAth.name}" (${newAth.sport}) just registered via QR!`, 'success');
            });

            socket.on('athlete_updated', (updatedAth) => {
                setAthletes(prev => prev.map(a => (a.id === updatedAth.id || a._id === updatedAth._id) ? updatedAth : a));
            });

            socket.on('athlete_deleted', (deletedAth) => {
                setAthletes(prev => prev.filter(a => a.id !== deletedAth.id && a._id !== deletedAth._id));
            });

            socket.on('payment_recorded', (newPay) => {
                setPayments(prev => {
                    if (prev.some(p => p.id === newPay.id || p._id === newPay._id)) return prev;
                    return [newPay, ...prev];
                });
                showToast(`💰 Real-Time: Payment recorded for ${newPay.athleteName || 'Athlete'} (₹${newPay.amount})`, 'info');
            });

            socket.on('new_inquiry_received', (newInq) => {
                setInquiries(prev => {
                    if (prev.some(i => i.id === newInq.id || i._id === newInq._id)) return prev;
                    return [newInq, ...prev];
                });
                showToast(`📩 Real-Time Lead: New inquiry from "${newInq.name}" (${newInq.sport})`, 'info');
            });
        } catch (e) {
            console.warn('Socket connection note:', e);
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [API_BASE]);

    // Background interval sync (every 5 seconds) & focus refetch
    useEffect(() => {
        fetchMongoData();

        const interval = setInterval(() => {
            fetchMongoData();
        }, 5000);

        const handleFocus = () => {
            fetchMongoData();
        };
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleFocus);
        };
    }, []);

    // Instant cross-tab real-time sync via BroadcastChannel & window events
    useEffect(() => {
        const handleSync = (e) => {
            fetchMongoData();
            if (e && e.detail) {
                showToast(`⚡ Real-Time Alert: New athlete "${e.detail.name}" enrolled via QR code!`, 'success');
            }
        };

        window.addEventListener('storage', handleSync);
        window.addEventListener('playpeak_athlete_enrolled', handleSync);

        // BroadcastChannel listener for multi-tab zero-reload updates
        let channel = null;
        try {
            channel = new BroadcastChannel('playpeak_realtime_sync');
            channel.onmessage = (event) => {
                if (event.data && event.data.type === 'ATHLETE_ENROLLED') {
                    const newAth = event.data.athlete;
                    setAthletes((prev) => {
                        if (prev.some(a => a.id === newAth.id)) return prev;
                        return [newAth, ...prev];
                    });
                    showToast(`⚡ Real-Time Alert: New athlete "${newAth.name}" (${newAth.sport}) just enrolled via QR code!`, 'success');
                    fetchMongoData();
                }
            };
        } catch (e) {}

        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('playpeak_athlete_enrolled', handleSync);
            if (channel) {
                channel.close();
            }
        };
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => { localStorage.setItem('playpeak_athletes', JSON.stringify(athletes)); }, [athletes]);
    useEffect(() => { localStorage.setItem('playpeak_payments', JSON.stringify(payments)); }, [payments]);
    useEffect(() => { localStorage.setItem('playpeak_coaches', JSON.stringify(coaches)); }, [coaches]);
    useEffect(() => { localStorage.setItem('playpeak_inventory', JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem('playpeak_memberships', JSON.stringify(memberships)); }, [memberships]);
    useEffect(() => { localStorage.setItem('playpeak_tournaments', JSON.stringify(tournaments)); }, [tournaments]);
    useEffect(() => { localStorage.setItem('playpeak_physio', JSON.stringify(physioLogs)); }, [physioLogs]);
    useEffect(() => { localStorage.setItem('playpeak_assessments', JSON.stringify(assessments)); }, [assessments]);
    useEffect(() => { localStorage.setItem('playpeak_inquiries', JSON.stringify(inquiries)); }, [inquiries]);

    const showToast = (msg, type = 'success') => {
        setToastMessage({ msg, type });
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('libraryUser');
        dispatch(userinfo(null));
        navigate('/login');
    };

    // ==========================================
    // QR CODE DOWNLOAD & PDF GENERATION UTILITIES
    // ==========================================
    const downloadQrImage = (dataUrl, fileName = 'PlayPeak_QR_Code.png') => {
        if (!dataUrl) {
            showToast('QR code not ready yet, please wait.', 'error');
            return;
        }
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`QR Code image (${fileName}) downloaded!`);
    };

    const downloadQrPdf = ({ title, subtitle, qrDataUrl, instructions, fileName = 'PlayPeak_QR_Poster.pdf', metaData }) => {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            // Header background banner
            doc.setFillColor(15, 23, 42); // slate-900
            doc.rect(0, 0, 210, 48, 'F');
            
            // Orange accent line
            doc.setFillColor(255, 106, 26); // #FF6A1A
            doc.rect(0, 48, 210, 3, 'F');

            // Title & Branding
            doc.setFontSize(22);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text("PLAYPEAK SPORTS ACADEMY", 105, 22, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(255, 106, 26);
            doc.text("OLYMPIC STANDARD TRAINING & ATHLETE EXCELLENCE", 105, 32, { align: "center" });

            doc.setFontSize(9);
            doc.setTextColor(203, 213, 225);
            doc.text("Indore Olympic Sports Complex | www.playpeaksports.com", 105, 40, { align: "center" });

            // Section Box
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, 58, 170, 200, 4, 4, 'FD');

            // Document Title
            doc.setFontSize(16);
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text(title || "OFFICIAL REGISTRATION QR PASS", 105, 74, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.text(subtitle || "Scan this QR code with any smartphone camera to open the registration portal.", 105, 82, { align: "center" });

            // QR Code Image in Center
            if (qrDataUrl) {
                doc.addImage(qrDataUrl, 'PNG', 65, 92, 80, 80);
            }

            // Meta data / details box if provided
            let yPos = 182;
            if (metaData && Array.isArray(metaData)) {
                doc.setFontSize(9);
                metaData.forEach(item => {
                    doc.setTextColor(71, 85, 105);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${item.label}: `, 35, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(15, 23, 42);
                    doc.text(`${item.value}`, 85, yPos);
                    yPos += 6.5;
                });
            }

            // Instructions
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(instructions || "Steps: 1. Open Phone Camera or QR Scanner  2. Point at QR Code  3. Submit details for instant pass.", 105, 245, { align: "center" });

            // Footer
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("PlayPeak Sports Arena, Olympic Complex Road | Helpline: +91 98765 43210 | info@playpeaksports.com", 105, 287, { align: "center" });

            doc.save(fileName);
            showToast(`Printable PDF Poster (${fileName}) downloaded!`);
        } catch (err) {
            console.error("PDF generation failed:", err);
            showToast("Error generating PDF poster.", "error");
        }
    };

    // Download Official Fee Payment Receipt PDF
    const handleDownloadReceiptPDF = (pay) => {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            // Header
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 210, 44, 'F');
            
            // Accent line
            doc.setFillColor(255, 106, 26);
            doc.rect(0, 44, 210, 3, 'F');

            // Header titles
            doc.setFontSize(22);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text("PLAYPEAK SPORTS ACADEMY", 105, 20, { align: "center" });

            doc.setFontSize(9);
            doc.setTextColor(255, 106, 26);
            doc.text("OFFICIAL FEE PAYMENT RECEIPT & TAX INVOICE", 105, 29, { align: "center" });

            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("Indore Olympic Sports Complex | Helpline: +91 98765 43210 | info@playpeaksports.com", 105, 36, { align: "center" });

            // Main Details Container
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, 54, 180, 195, 4, 4, 'FD');

            doc.setFontSize(15);
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text("FEE PAYMENT RECEIPT", 25, 68);

            doc.setFontSize(10);
            doc.setTextColor(255, 106, 26);
            doc.text(`Receipt #: ${pay.receiptNo || pay.id}`, 185, 68, { align: "right" });

            // Divider line
            doc.setDrawColor(226, 232, 240);
            doc.line(25, 74, 185, 74);

            const details = [
                { label: "Athlete Name", value: pay.athleteName },
                { label: "Sport Discipline", value: pay.sport },
                { label: "Membership Plan", value: pay.plan || "Pro Academy Pass" },
                { label: "Transaction / Ref ID", value: pay.id },
                { label: "Date of Payment", value: pay.date || new Date().toISOString().split('T')[0] },
                { label: "Payment Mode", value: pay.method || "UPI Reception" },
                { label: "Payment Status", value: pay.status || "Completed" },
                { label: "Next Due Date", value: pay.dueDate || "N/A" }
            ];

            let curY = 86;
            details.forEach(item => {
                doc.setFontSize(9.5);
                doc.setTextColor(100, 116, 139);
                doc.setFont('helvetica', 'normal');
                doc.text(item.label, 25, curY);

                doc.setTextColor(15, 23, 42);
                doc.setFont('helvetica', 'bold');
                doc.text(String(item.value), 90, curY);
                curY += 10.5;
            });

            // Total Box
            doc.setFillColor(255, 247, 237);
            doc.setDrawColor(254, 215, 170);
            doc.roundedRect(25, 180, 160, 24, 3, 3, 'FD');

            doc.setFontSize(11);
            doc.setTextColor(194, 65, 12);
            doc.setFont('helvetica', 'bold');
            doc.text("TOTAL AMOUNT RECEIVED:", 35, 195);

            doc.setFontSize(16);
            doc.setTextColor(234, 88, 12);
            doc.text(`INR ${Number(pay.amount || 0).toLocaleString()}`, 175, 195, { align: "right" });

            // Note
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'italic');
            doc.text("This is an electronically generated official receipt issued by PlayPeak Sports Academy.", 105, 230, { align: "center" });

            // Footer
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("PlayPeak Sports Arena, Olympic Complex Road | Helpline: +91 98765 43210", 105, 287, { align: "center" });

            doc.save(`PlayPeak_Receipt_${pay.receiptNo || pay.id}.pdf`);
            showToast(`Receipt PDF (${pay.receiptNo || pay.id}) downloaded!`);
        } catch (err) {
            console.error("Receipt PDF generation error:", err);
            showToast("Error generating receipt PDF.", "error");
        }
    };

    // Base URL for PlayPeak Production QR Codes & Links
    const PLAYPEAK_BASE_URL = 'https://playpeak.vercel.app';

    // Generate QR Code for Self-Enrollment
    const handleOpenQrModal = () => {
        const enrollUrl = `${PLAYPEAK_BASE_URL}/enroll`;
        QRCode.toDataURL(enrollUrl, { width: 350, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
            .then(url => {
                setQrCodeDataUrl(url);
                setShowQrModal(true);
            })
            .catch(() => {
                setShowQrModal(true);
            });
    };

    // Open Membership Plan QR Poster Modal
    const handleOpenMembershipPlanQr = (plan) => {
        setSelectedPlanQr(plan);
        const planUrl = `${PLAYPEAK_BASE_URL}/enroll?plan=${encodeURIComponent(plan.name)}&sport=${encodeURIComponent(plan.sport || 'All')}`;
        QRCode.toDataURL(planUrl, { width: 350, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
            .then(url => {
                setMembershipQrDataUrl(url);
                setShowMembershipQrModal(true);
            })
            .catch(() => {
                setShowMembershipQrModal(true);
            });
    };

    // Open Athlete ID Card Modal with Dynamic QR
    const handleViewAthleteCard = (ath) => {
        setViewingAthleteCard(ath);
        const passData = `${PLAYPEAK_BASE_URL}/enroll?ref=${ath.id}&sport=${encodeURIComponent(ath.sport)}`;
        QRCode.toDataURL(passData, { width: 300, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
            .then(url => setAthletePassQrDataUrl(url))
            .catch(() => setAthletePassQrDataUrl(''));
    };

    // ==========================================
    // ATHLETES CRUD OPERATIONS (WITH MONTHLY / YEARLY PRICING)
    // ==========================================
    const [athleteForm, setAthleteForm] = useState({
        name: '',
        phone: '',
        email: '',
        age: 15,
        gender: 'Male',
        sport: 'Football',
        batchTime: 'Evening Prime (05:00 PM - 07:00 PM)',
        coach: 'Coach Rajesh Sharma (AFC Pro)',
        planType: 'Monthly',
        membership: 'Pro Academy Monthly',
        feeAmount: 3999,
        amountPaid: 3999,
        dueAmount: 0,
        paymentStatus: 'Paid',
        emergencyContact: '',
        bloodGroup: 'B+'
    });

    const updateAthleteFormSportOrPlan = (sportName, planType) => {
        const sportConfig = sportsList.find(s => s.name === sportName) || sportsList[0];
        const fee = planType === 'Yearly' ? sportConfig.yearly : sportConfig.monthly;
        const paid = Number(athleteForm.amountPaid || 0);
        const due = Math.max(0, fee - paid);

        setAthleteForm({
            ...athleteForm,
            sport: sportConfig.name,
            coach: sportConfig.coach,
            planType: planType,
            membership: `${sportConfig.name} ${planType} Pass`,
            feeAmount: fee,
            dueAmount: due,
            paymentStatus: due === 0 ? 'Paid' : due === fee ? 'Due' : 'Partial'
        });
    };

    const handleSaveAthlete = (e) => {
        e.preventDefault();
        if (!athleteForm.name || !athleteForm.phone) {
            showToast('Please enter athlete name and contact phone.', 'error');
            return;
        }

        const calculatedDue = Math.max(0, Number(athleteForm.feeAmount) - Number(athleteForm.amountPaid || 0));
        const finalStatus = calculatedDue === 0 ? 'Paid' : calculatedDue === Number(athleteForm.feeAmount) ? 'Due' : 'Partial';

        if (editingAthlete) {
            const updatedAth = { ...editingAthlete, ...athleteForm, dueAmount: calculatedDue, paymentStatus: finalStatus };
            setAthletes(athletes.map(a => a.id === editingAthlete.id ? updatedAth : a));
            axios.put(`${API_BASE}athletes/${editingAthlete.id}`, updatedAth).catch(err => console.warn(err));
            showToast(`Athlete profile for "${athleteForm.name}" updated!`);
        } else {
            const newAthlete = {
                id: `ATH-${Math.floor(100 + Math.random() * 900)}`,
                ...athleteForm,
                dueAmount: calculatedDue,
                paymentStatus: finalStatus,
                joinDate: new Date().toISOString().split('T')[0],
                status: 'Active'
            };
            setAthletes([newAthlete, ...athletes]);
            axios.post(`${API_BASE}athletes`, newAthlete).catch(err => console.warn(err));

            // If amount paid > 0, log transaction
            if (Number(athleteForm.amountPaid) > 0) {
                const newPay = {
                    id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
                    athleteId: newAthlete.id,
                    athleteName: newAthlete.name,
                    sport: newAthlete.sport,
                    plan: newAthlete.membership,
                    amount: Number(athleteForm.amountPaid),
                    date: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    method: 'Reception Payment',
                    status: 'Completed',
                    receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`
                };
                setPayments([newPay, ...payments]);
                axios.post(`${API_BASE}payments`, newPay).catch(err => console.warn(err));
            }

            showToast(`Enrolled "${athleteForm.name}" (${athleteForm.sport} - ${athleteForm.planType} Plan)!`);
        }

        setShowAddAthleteModal(false);
        setEditingAthlete(null);
    };

    const handleDeleteAthlete = (id, name) => {
        if (window.confirm(`Are you sure you want to remove athlete "${name}" from academy records?`)) {
            setAthletes(athletes.filter(a => a.id !== id));
            axios.delete(`${API_BASE}athletes/${id}`).catch(err => console.warn(err));
            showToast(`Athlete "${name}" removed from database.`, 'info');
        }
    };

    // ==========================================
    // PAYMENTS CRUD OPERATIONS
    // ==========================================
    const [paymentForm, setPaymentForm] = useState({
        athleteName: '',
        sport: 'Football',
        plan: 'Pro Academy Monthly',
        amount: 3999,
        method: 'UPI (GPay)',
        status: 'Completed',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const handleSavePayment = (e) => {
        e.preventDefault();
        if (!paymentForm.athleteName || !paymentForm.amount) {
            showToast('Please fill all payment fields.', 'error');
            return;
        }

        if (editingPayment) {
            const updatedPay = { ...editingPayment, ...paymentForm };
            setPayments(payments.map(p => p.id === editingPayment.id ? updatedPay : p));
            axios.put(`${API_BASE}payments/${editingPayment.id}`, updatedPay).catch(err => console.warn(err));
            showToast(`Payment transaction updated.`);
        } else {
            const newPay = {
                id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
                athleteId: `ATH-${Math.floor(100 + Math.random() * 900)}`,
                ...paymentForm,
                date: new Date().toISOString().split('T')[0],
                receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`
            };
            setPayments([newPay, ...payments]);
            axios.post(`${API_BASE}payments`, newPay).catch(err => console.warn(err));

            // Update athlete due amount if exists
            setAthletes(athletes.map(a => {
                if (a.name.toLowerCase() === paymentForm.athleteName.toLowerCase()) {
                    const newDue = Math.max(0, a.dueAmount - paymentForm.amount);
                    const updatedAth = { ...a, dueAmount: newDue, paymentStatus: newDue === 0 ? 'Paid' : 'Partial' };
                    axios.put(`${API_BASE}athletes/${a.id}`, updatedAth).catch(e => console.warn(e));
                    return updatedAth;
                }
                return a;
            }));

            showToast(`Fee payment of ₹${paymentForm.amount} recorded for ${paymentForm.athleteName}!`);
        }

        setShowAddPaymentModal(false);
        setEditingPayment(null);
    };

    const handleDeletePayment = (id) => {
        if (window.confirm('Delete this payment transaction record?')) {
            setPayments(payments.filter(p => p.id !== id));
            axios.delete(`${API_BASE}payments/${id}`).catch(err => console.warn(err));
            showToast('Transaction deleted.', 'info');
        }
    };

    // ==========================================
    // COACHES CRUD OPERATIONS
    // ==========================================
    const [coachForm, setCoachForm] = useState({
        name: '',
        sport: 'Football',
        certification: 'AFC Pro License & UEFA-A',
        phone: '',
        email: '',
        experience: 5,
        trainees: 20,
        monthlySalary: '₹60,000',
        rating: 4.8
    });

    const handleSaveCoach = (e) => {
        e.preventDefault();
        if (!coachForm.name || !coachForm.phone) {
            showToast('Please fill coach name and contact.', 'error');
            return;
        }

        if (editingCoach) {
            const updated = { ...editingCoach, ...coachForm };
            setCoaches(coaches.map(c => c.id === editingCoach.id ? updated : c));
            axios.put(`${API_BASE}coaches/${editingCoach.id}`, updated).catch(err => console.warn(err));
            showToast(`Coach "${coachForm.name}" profile updated!`);
        } else {
            const newCoach = {
                id: `COA-${Math.floor(10 + Math.random() * 90)}`,
                ...coachForm,
                status: 'Active'
            };
            setCoaches([newCoach, ...coaches]);
            axios.post(`${API_BASE}coaches`, newCoach).catch(err => console.warn(err));
            showToast(`New coach "${coachForm.name}" registered!`);
        }

        setShowAddCoachModal(false);
        setEditingCoach(null);
    };

    const handleDeleteCoach = (id, name) => {
        if (window.confirm(`Remove coach "${name}" from roster?`)) {
            setCoaches(coaches.filter(c => c.id !== id));
            axios.delete(`${API_BASE}coaches/${id}`).catch(err => console.warn(err));
            showToast(`Coach "${name}" removed.`, 'info');
        }
    };

    // ==========================================
    // INVENTORY CRUD OPERATIONS
    // ==========================================
    const [inventoryForm, setInventoryForm] = useState({
        name: '',
        sport: 'Football',
        category: 'Balls & Turf Gear',
        totalQty: 20,
        availableQty: 20,
        damagedQty: 0,
        location: 'Ground Equipment Shed',
        minThreshold: 5,
        unitCost: '₹1,500'
    });

    const handleSaveInventory = (e) => {
        e.preventDefault();
        if (!inventoryForm.name) {
            showToast('Please enter item name.', 'error');
            return;
        }

        if (editingInventory) {
            const updated = { ...editingInventory, ...inventoryForm };
            setInventory(inventory.map(i => i.id === editingInventory.id ? updated : i));
            axios.put(`${API_BASE}inventory/${editingInventory.id}`, updated).catch(err => console.warn(err));
            showToast(`Inventory item "${inventoryForm.name}" updated!`);
        } else {
            const newItem = {
                id: `EQP-${Math.floor(100 + Math.random() * 900)}`,
                ...inventoryForm
            };
            setInventory([newItem, ...inventory]);
            axios.post(`${API_BASE}inventory`, newItem).catch(err => console.warn(err));
            showToast(`Added "${inventoryForm.name}" to sports inventory!`);
        }

        setShowAddInventoryModal(false);
        setEditingInventory(null);
    };

    const handleDeleteInventory = (id, name) => {
        if (window.confirm(`Delete inventory record "${name}"?`)) {
            setInventory(inventory.filter(i => i.id !== id));
            axios.delete(`${API_BASE}inventory/${id}`).catch(err => console.warn(err));
            showToast(`Item removed from inventory.`, 'info');
        }
    };

    // ==========================================
    // MEMBERSHIP PLANS CRUD OPERATIONS
    // ==========================================
    const [planForm, setPlanForm] = useState({
        name: '',
        sport: 'Football',
        duration: '1 Month',
        price: 3999,
        badge: 'Popular',
        featuresText: '3 Pro Coaching Sessions/Wk\nTurf Access\nJersey Provided'
    });

    const handleSavePlan = (e) => {
        e.preventDefault();
        if (!planForm.name || !planForm.price) {
            showToast('Please enter plan name and price.', 'error');
            return;
        }

        const featuresArray = planForm.featuresText.split('\n').map(f => f.trim()).filter(Boolean);

        if (editingPlan) {
            const updated = { 
                ...editingPlan, 
                name: planForm.name,
                sport: planForm.sport,
                duration: planForm.duration,
                price: Number(planForm.price),
                badge: planForm.badge,
                features: featuresArray
            };
            setMemberships(memberships.map(m => m.id === editingPlan.id ? updated : m));
            axios.put(`${API_BASE}memberships/${editingPlan.id}`, updated).catch(err => console.warn(err));
            showToast(`Membership plan "${planForm.name}" updated!`);
        } else {
            const newPlan = {
                id: `PLN-${Math.floor(10 + Math.random() * 90)}`,
                name: planForm.name,
                sport: planForm.sport,
                duration: planForm.duration,
                price: Number(planForm.price),
                badge: planForm.badge,
                activeAthletes: 0,
                features: featuresArray
            };
            setMemberships([newPlan, ...memberships]);
            axios.post(`${API_BASE}memberships`, newPlan).catch(err => console.warn(err));
            showToast(`New membership plan "${planForm.name}" created!`);
        }

        setShowAddPlanModal(false);
        setEditingPlan(null);
    };

    const handleDeletePlan = (id, name) => {
        if (window.confirm(`Delete membership plan "${name}"?`)) {
            setMemberships(memberships.filter(m => m.id !== id));
            axios.delete(`${API_BASE}memberships/${id}`).catch(err => console.warn(err));
            showToast(`Plan removed.`, 'info');
        }
    };

    // ==========================================
    // TOURNAMENTS CRUD OPERATIONS
    // ==========================================
    const [tournamentForm, setTournamentForm] = useState({
        title: '',
        sport: 'Football',
        ageCategory: 'U-17 Open',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        teamsCount: 16,
        prizePool: '₹1,00,000',
        venue: 'PlayPeak Main Arena',
        status: 'Upcoming'
    });

    const handleSaveTournament = (e) => {
        e.preventDefault();
        if (!tournamentForm.title) {
            showToast('Please enter tournament title.', 'error');
            return;
        }

        if (editingTournament) {
            const updated = { ...editingTournament, ...tournamentForm };
            setTournaments(tournaments.map(t => t.id === editingTournament.id ? updated : t));
            axios.put(`${API_BASE}tournaments/${editingTournament.id}`, updated).catch(err => console.warn(err));
            showToast(`Tournament "${tournamentForm.title}" updated!`);
        } else {
            const newTrn = {
                id: `TRN-${Math.floor(10 + Math.random() * 90)}`,
                ...tournamentForm
            };
            setTournaments([newTrn, ...tournaments]);
            axios.post(`${API_BASE}tournaments`, newTrn).catch(err => console.warn(err));
            showToast(`Tournament "${tournamentForm.title}" scheduled!`);
        }

        setShowAddTournamentModal(false);
        setEditingTournament(null);
    };

    const handleDeleteTournament = (id, title) => {
        if (window.confirm(`Cancel tournament "${title}"?`)) {
            setTournaments(tournaments.filter(t => t.id !== id));
            axios.delete(`${API_BASE}tournaments/${id}`).catch(err => console.warn(err));
            showToast(`Tournament cancelled.`, 'info');
        }
    };

    // ==========================================
    // PHYSIO & RECOVERY LAB CRUD OPERATIONS
    // ==========================================
    const [physioForm, setPhysioForm] = useState({
        athleteName: athletes[0]?.name || '',
        sport: 'Football',
        injuryType: 'Ankle Sprain',
        injuryDate: new Date().toISOString().split('T')[0],
        recoveryStatus: 'In Rehab',
        therapist: 'Dr. Neha Saxena (PT)',
        expectedReturn: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        treatment: 'Ice Bath, Electrotherapy & Resistance Drills'
    });

    const handleSavePhysio = (e) => {
        e.preventDefault();
        if (!physioForm.athleteName || !physioForm.injuryType) {
            showToast('Please fill all physio log fields.', 'error');
            return;
        }

        if (editingPhysio) {
            const updated = { ...editingPhysio, ...physioForm };
            setPhysioLogs(physioLogs.map(p => p.id === editingPhysio.id ? updated : p));
            axios.put(`${API_BASE}physio/${editingPhysio.id}`, updated).catch(err => console.warn(err));
            showToast(`Physio log updated.`);
        } else {
            const newPhy = {
                id: `PHY-${Math.floor(10 + Math.random() * 90)}`,
                ...physioForm
            };
            setPhysioLogs([newPhy, ...physioLogs]);
            axios.post(`${API_BASE}physio`, newPhy).catch(err => console.warn(err));
            showToast(`Injury recovery log added for ${physioForm.athleteName}!`);
        }

        setShowAddPhysioModal(false);
        setEditingPhysio(null);
    };

    const handleDeletePhysio = (id) => {
        if (window.confirm('Delete this physio record?')) {
            setPhysioLogs(physioLogs.filter(p => p.id !== id));
            axios.delete(`${API_BASE}physio/${id}`).catch(err => console.warn(err));
            showToast('Physio log removed.', 'info');
        }
    };

    // ==========================================
    // BIOMECHANICS & FITNESS ASSESSMENTS CRUD OPERATIONS
    // ==========================================
    const [assessmentForm, setAssessmentForm] = useState({
        athleteName: athletes[0]?.name || '',
        sport: 'Football',
        sprint30m: '4.05s',
        verticalJump: '54 cm',
        vo2Max: '52.5 ml/kg',
        deadlift: '100 kg',
        testDate: new Date().toISOString().split('T')[0],
        rating: 'Advanced Prospect'
    });

    const handleSaveAssessment = (e) => {
        e.preventDefault();
        if (!assessmentForm.athleteName) {
            showToast('Please select an athlete.', 'error');
            return;
        }

        if (editingAssessment) {
            const updated = { ...editingAssessment, ...assessmentForm };
            setAssessments(assessments.map(a => a.id === editingAssessment.id ? updated : a));
            axios.put(`${API_BASE}assessments/${editingAssessment.id}`, updated).catch(err => console.warn(err));
            showToast(`Fitness score updated.`);
        } else {
            const newAsm = {
                id: `ASM-${Math.floor(10 + Math.random() * 90)}`,
                ...assessmentForm
            };
            setAssessments([newAsm, ...assessments]);
            axios.post(`${API_BASE}assessments`, newAsm).catch(err => console.warn(err));
            showToast(`Recorded performance assessment for ${assessmentForm.athleteName}!`);
        }

        setShowAddAssessmentModal(false);
        setEditingAssessment(null);
    };

    const handleDeleteAssessment = (id) => {
        if (window.confirm('Delete this fitness assessment?')) {
            setAssessments(assessments.filter(a => a.id !== id));
            axios.delete(`${API_BASE}assessments/${id}`).catch(err => console.warn(err));
            showToast('Assessment removed.', 'info');
        }
    };

    // ==========================================
    // INQUIRIES & TRIAL LEADS CRUD OPERATIONS
    // ==========================================
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        phone: '',
        email: '',
        sport: 'Football',
        ageGroup: 'Ages 10-15',
        message: 'Interested in trial session.'
    });

    const handleSaveInquiry = (e) => {
        e.preventDefault();
        if (!inquiryForm.name || !inquiryForm.phone) {
            showToast('Please fill contact name and phone.', 'error');
            return;
        }

        if (editingInquiry) {
            const updated = { ...editingInquiry, ...inquiryForm };
            setInquiries(inquiries.map(i => i.id === editingInquiry.id ? updated : i));
            axios.put(`${API_BASE}inquiries/${editingInquiry.id}`, updated).catch(err => console.warn(err));
            showToast(`Inquiry for "${inquiryForm.name}" updated!`);
        } else {
            const newInq = {
                id: `INQ-${Math.floor(500 + Math.random() * 400)}`,
                ...inquiryForm,
                date: new Date().toISOString().split('T')[0],
                status: 'New'
            };
            setInquiries([newInq, ...inquiries]);
            axios.post(`${API_BASE}inquiries`, newInq).catch(err => console.warn(err));
            showToast(`Added inquiry for "${inquiryForm.name}"!`);
        }

        setShowAddInquiryModal(false);
        setEditingInquiry(null);
    };

    const handleDeleteInquiry = (id) => {
        if (window.confirm('Delete this inquiry record?')) {
            setInquiries(inquiries.filter(i => i.id !== id));
            axios.delete(`${API_BASE}inquiries/${id}`).catch(err => console.warn(err));
            showToast('Inquiry removed.', 'info');
        }
    };

    // ==========================================
    // BROADCAST AUTO PAYMENT DUE REMINDERS
    // ==========================================
    const dueAthletes = athletes.filter(a => a.dueAmount > 0 || a.paymentStatus === 'Due' || a.paymentStatus === 'Overdue');

    const handleBroadcastDueReminders = () => {
        if (dueAthletes.length === 0) {
            showToast('No athletes have pending fee dues at this moment.', 'info');
            return;
        }

        setBroadcastingNotice(true);
        setTimeout(() => {
            setBroadcastingNotice(false);
            showToast(`🚀 Automated fee reminders dispatched to ${dueAthletes.length} athletes via WhatsApp & SMS!`, 'success');
        }, 1200);
    };

    const handleSendIndividualReminder = (athlete) => {
        const text = encodeURIComponent(`Hi ${athlete.name}, reminder from PlayPeak Sports Academy: Your ${athlete.sport} (${athlete.planType} Plan) fee balance of INR ${athlete.dueAmount} is pending. Please settle via UPI or reception. Thank you!`);
        window.open(`https://wa.me/${athlete.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
        showToast(`Opened WhatsApp reminder for ${athlete.name}`);
    };



    // Calculate Summary Stats
    const totalAthletesCount = athletes.length;
    const activeAthletesCount = athletes.filter(a => a.status === 'Active').length;
    const totalCollectedRevenue = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const totalPendingDues = athletes.reduce((acc, a) => acc + Number(a.dueAmount || 0), 0);
    const totalCoachesCount = coaches.length;

    // Filter athletes
    const filteredAthletes = athletes.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              a.phone.includes(searchTerm) ||
                              a.sport.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSport = filterSport === 'All' || a.sport === filterSport;
        const matchesStatus = filterStatus === 'All' || a.paymentStatus === filterStatus || a.status === filterStatus || a.planType === filterStatus;
        return matchesSearch && matchesSport && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 pb-20 lg:pb-0">
            
            {/* TOAST NOTIFICATION POPUP */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold border ${
                            toastMessage.type === 'error'
                                ? 'bg-red-500 text-white border-red-600'
                                : toastMessage.type === 'info'
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-slate-900 text-white border-slate-800'
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-ping" />
                        <span>{toastMessage.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOP BAR / ADMIN HEADER */}
            <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
                
                {/* Brand & Mobile Hamburger */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                        className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
                        aria-label="Open Navigation Drawer"
                    >
                        <FiMenu className="text-xl" />
                    </button>

                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 100 100" className="w-8 h-8">
                                <circle cx="50" cy="22" r="12" fill="#FF6A1A" />
                                <path d="M48 38 L30 54 L38 68 L48 56 L62 78 L78 74 L60 48 L62 38 Z" fill="#FF6A1A" />
                                <path d="M30 40 L18 52 L26 60 L36 48 Z" fill="#3B82F6" />
                                <path d="M62 48 L76 34 L84 42 L68 56 Z" fill="#3B82F6" />
                            </svg>
                        </div>
                        <div className="leading-tight">
                            <span className="font-display font-extrabold text-lg text-white tracking-tight">
                                Play<span className="text-[#FF6A1A]">Peak</span>
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block -mt-0.5">
                                ADMIN PWA CENTER
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Center Quick Stats */}
                <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-semibold text-slate-200">Academy Hub Live</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Active Athletes:</span>
                        <strong className="text-white">{activeAthletesCount}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Monthly Revenue:</span>
                        <strong className="text-[#FF6A1A]">₹{totalCollectedRevenue.toLocaleString()}</strong>
                    </div>
                </div>

                {/* Right Action & PWA App Download */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleTriggerInstall}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-xs font-bold text-white shadow-sm"
                        title="Install Mobile PWA App"
                    >
                        <FiSmartphone className="text-sm" />
                        <span className="hidden sm:inline">Install App</span>
                    </button>

                    <button
                        onClick={handleOpenQrModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-xs font-bold text-white transition-all shadow-sm"
                    >
                        <FaQrcode />
                        <span className="hidden sm:inline">Enrollment QR</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold transition-all"
                    >
                        <FiLogOut />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </header>

            {/* MAIN ADMIN WORKSPACE WITH SIDEBAR */}
            <div className="flex flex-grow overflow-hidden">
                
                {/* DESKTOP SIDEBAR NAVIGATION */}
                <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 space-y-2 shrink-0 overflow-y-auto">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
                        Management Suite
                    </div>

                    {[
                        { id: 'overview', name: 'Dashboard Overview', icon: <FiGrid /> },
                        { id: 'athletes', name: 'Athletes & Students', icon: <FiUsers />, badge: athletes.length },
                        { id: 'payments', name: 'Payments & Billing', icon: <FiDollarSign />, badge: payments.length },
                        { id: 'reminders', name: 'Fee Due Reminders', icon: <FiBell />, alertBadge: dueAthletes.length },
                        { id: 'coaches', name: 'Coaches & Mentors', icon: <GiWhistle />, badge: coaches.length },
                        { id: 'tournaments', name: 'Leagues & Tournaments', icon: <FaTrophy />, badge: tournaments.length },
                        { id: 'physio', name: 'Physio & Recovery Lab', icon: <GiHealing />, badge: physioLogs.length },
                        { id: 'assessments', name: 'Fitness & Biomechanics', icon: <GiStopwatch />, badge: assessments.length },
                        { id: 'inventory', name: 'Gear & Inventory', icon: <FiBox />, badge: inventory.length },
                        { id: 'memberships', name: 'Membership Plans', icon: <FiAward /> },
                        { id: 'inquiries', name: 'Contact & Trial Leads', icon: <FiMessageSquare />, badge: inquiries.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-[#FF6A1A] text-white shadow-lg shadow-orange-500/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-base">{tab.icon}</span>
                                <span>{tab.name}</span>
                            </div>
                            {tab.alertBadge > 0 ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-bold animate-pulse">
                                    {tab.alertBadge} Due
                                </span>
                            ) : tab.badge !== undefined ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                                    {tab.badge}
                                </span>
                            ) : null}
                        </button>
                    ))}

                    <div className="pt-4 mt-auto border-t border-slate-800 space-y-2">
                        <button
                            onClick={handleTriggerInstall}
                            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs hover:bg-emerald-500/30 transition-all"
                        >
                            <FiSmartphone /> Download Mobile App
                        </button>
                    </div>
                </aside>

                {/* MOBILE DRAWER NAVIGATION */}
                <AnimatePresence>
                    {mobileDrawerOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileDrawerOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ x: -280 }}
                                animate={{ x: 0 }}
                                exit={{ x: -280 }}
                                className="relative w-72 bg-slate-900 text-white p-5 flex flex-col space-y-2 z-10 shadow-2xl overflow-y-auto"
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                    <span className="font-display font-black text-lg text-white">
                                        Play<span className="text-[#FF6A1A]">Peak</span> Admin
                                    </span>
                                    <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                                        <FiX className="text-xl" />
                                    </button>
                                </div>

                                {[
                                    { id: 'overview', name: 'Dashboard Overview', icon: <FiGrid /> },
                                    { id: 'athletes', name: 'Athletes & Students', icon: <FiUsers /> },
                                    { id: 'payments', name: 'Payments & Billing', icon: <FiDollarSign /> },
                                    { id: 'reminders', name: 'Fee Due Reminders', icon: <FiBell /> },
                                    { id: 'coaches', name: 'Coaches & Mentors', icon: <GiWhistle /> },
                                    { id: 'tournaments', name: 'Leagues & Tournaments', icon: <FaTrophy /> },
                                    { id: 'physio', name: 'Physio & Recovery Lab', icon: <GiHealing /> },
                                    { id: 'assessments', name: 'Fitness & Biomechanics', icon: <GiStopwatch /> },
                                    { id: 'inventory', name: 'Gear & Inventory', icon: <FiBox /> },
                                    { id: 'memberships', name: 'Membership Plans', icon: <FiAward /> },
                                    { id: 'inquiries', name: 'Contact & Trial Leads', icon: <FiMessageSquare /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveTab(tab.id); setMobileDrawerOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left ${
                                            activeTab === tab.id
                                                ? 'bg-[#FF6A1A] text-white shadow-lg'
                                                : 'text-slate-300 hover:bg-slate-800'
                                        }`}
                                    >
                                        <span className="text-base">{tab.icon}</span>
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    
                    {/* ========================================================================= */}
                    {/* TAB 1: DASHBOARD OVERVIEW */}
                    {/* ========================================================================= */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            
                            {/* Title & Quick Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Academy Dashboard
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Real-time overview of active athletes, coaching rosters, fee revenue, and pending dues.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        onClick={handleOpenQrModal}
                                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                                    >
                                        <FaQrcode /> Self-Registration QR
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingAthlete(null);
                                            updateAthleteFormSportOrPlan('Football', 'Monthly');
                                            setShowAddAthleteModal(true);
                                        }}
                                        className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-transform active:scale-98"
                                    >
                                        <FiPlus /> Add Athlete
                                    </button>
                                </div>
                            </div>

                            {/* Key Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                
                                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Athletes</span>
                                        <div className="font-display font-black text-2xl text-slate-900">{athletes.length}</div>
                                        <span className="text-[11px] text-emerald-600 font-semibold">{activeAthletesCount} Active on Turf</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-2xl">
                                        <FiUsers />
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Fee Collected</span>
                                        <div className="font-display font-black text-2xl text-slate-900">₹{totalCollectedRevenue.toLocaleString()}</div>
                                        <span className="text-[11px] text-emerald-600 font-semibold">{payments.length} Transactions</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                                        <FiDollarSign />
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Dues</span>
                                        <div className="font-display font-black text-2xl text-red-600">₹{totalPendingDues.toLocaleString()}</div>
                                        <span className="text-[11px] text-red-500 font-semibold">{dueAthletes.length} Athletes Pending</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl">
                                        <FiAlertCircle />
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Certified Coaches</span>
                                        <div className="font-display font-black text-2xl text-slate-900">{totalCoachesCount}</div>
                                        <span className="text-[11px] text-blue-600 font-semibold">Across {sportsList.length} Sports</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                                        <GiWhistle />
                                    </div>
                                </div>

                            </div>

                            {/* Dues Alert Banner */}
                            {dueAthletes.length > 0 && (
                                <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500 to-[#FF6A1A] text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-display font-black text-base flex items-center gap-2">
                                            <FiBell className="text-xl animate-bounce" /> {dueAthletes.length} Athletes Have Pending Academy Dues (₹{totalPendingDues.toLocaleString()})
                                        </h4>
                                        <p className="text-xs text-orange-100">
                                            Send automated WhatsApp & SMS reminders directly with a single click.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleBroadcastDueReminders}
                                        disabled={broadcastingNotice}
                                        className="py-2.5 px-5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-md shrink-0 flex items-center gap-2 transition-transform active:scale-95"
                                    >
                                        <FaWhatsapp className="text-emerald-400 text-base" />
                                        <span>{broadcastingNotice ? 'Dispatching Reminders...' : 'Broadcast Due Reminders'}</span>
                                    </button>
                                </div>
                            )}

                            {/* Sports Breakdown & Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                
                                {/* Sports Distribution */}
                                <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                                    <h3 className="font-display font-bold text-base text-slate-900 flex items-center justify-between">
                                        <span>Sport Enrollment Distribution</span>
                                        <span className="text-xs text-slate-400 font-medium">{athletes.length} Total</span>
                                    </h3>

                                    <div className="space-y-3 pt-2">
                                        {['Football', 'Cricket', 'Badminton', 'Basketball', 'Swimming', 'Combat / MMA'].map((sport) => {
                                            const count = athletes.filter(a => a.sport === sport).length;
                                            const percentage = athletes.length > 0 ? Math.round((count / athletes.length) * 100) : 0;
                                            return (
                                                <div key={sport} className="space-y-1">
                                                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                                                        <span>{sport}</span>
                                                        <span className="text-slate-500">{count} Athletes ({percentage}%)</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#FF6A1A] rounded-full transition-all duration-500"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent Payments Stream */}
                                <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-display font-bold text-base text-slate-900">
                                            Recent Transactions
                                        </h3>
                                        <button
                                            onClick={() => setActiveTab('payments')}
                                            className="text-xs font-bold text-[#FF6A1A] hover:underline"
                                        >
                                            View All
                                        </button>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                        {payments.slice(0, 4).map((pay) => (
                                            <div key={pay.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-bold text-xs text-slate-900">{pay.athleteName}</div>
                                                    <div className="text-[11px] text-slate-500">{pay.sport} • {pay.plan}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-xs text-emerald-600">+₹{pay.amount?.toLocaleString()}</div>
                                                    <div className="text-[10px] text-slate-400">{pay.date}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 2: ATHLETES & STUDENTS MANAGEMENT (WITH MONTHLY / YEARLY & QR) */}
                    {/* ========================================================================= */}
                    {activeTab === 'athletes' && (
                        <div className="space-y-6">
                            
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Athlete & Student Roster
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Manage student profiles, monthly/yearly billing options, fees, and QR self-registration.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <button
                                        onClick={handleOpenQrModal}
                                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                                    >
                                        <FaQrcode /> Self-Registration QR
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingAthlete(null);
                                            updateAthleteFormSportOrPlan('Football', 'Monthly');
                                            setShowAddAthleteModal(true);
                                        }}
                                        className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5 self-start sm:self-auto"
                                    >
                                        <FiPlus /> Enroll New Athlete
                                    </button>
                                </div>
                            </div>

                            {/* Filters & Search Toolbar */}
                            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                                
                                <div className="relative w-full md:w-80">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by student name, phone, or sport..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    <select
                                        value={filterSport}
                                        onChange={(e) => setFilterSport(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6A1A]"
                                    >
                                        <option value="All">All Sports</option>
                                        {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                    </select>

                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6A1A]"
                                    >
                                        <option value="All">All Statuses & Plans</option>
                                        <option value="Monthly">Monthly Plan</option>
                                        <option value="Yearly">Yearly Plan</option>
                                        <option value="Paid">Paid Fees</option>
                                        <option value="Due">Due Fees</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>

                            {/* Athletes Table */}
                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-5 py-4">Athlete ID & Name</th>
                                                <th className="px-5 py-4">Sport & Batch</th>
                                                <th className="px-5 py-4">Billing & Plan</th>
                                                <th className="px-5 py-4">Fee / Due Balance</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAthletes.map((athlete) => (
                                                <tr key={athlete.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900 text-sm">{athlete.name}</div>
                                                        <div className="text-[11px] text-slate-400">{athlete.id} • {athlete.phone} • {athlete.age} Yrs ({athlete.gender})</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                                            <span>{athlete.sport}</span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{athlete.batchTime}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase inline-block mb-1 ${
                                                            athlete.planType === 'Yearly'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {athlete.planType || 'Monthly'} Pass
                                                        </span>
                                                        <div className="text-[11px] text-slate-500 font-medium">{athlete.membership}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900">Total: ₹{athlete.feeAmount?.toLocaleString()}</div>
                                                        <div className={`text-[11px] font-semibold ${athlete.dueAmount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                            {athlete.dueAmount > 0 ? `Due: ₹${athlete.dueAmount.toLocaleString()}` : '✓ Fully Paid'}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                            athlete.paymentStatus === 'Paid'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : athlete.paymentStatus === 'Due'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {athlete.paymentStatus}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => handleViewAthleteCard(athlete)}
                                                                title="View ID Badge (QR & Download)"
                                                                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6A1A] transition-colors"
                                                            >
                                                                <FaQrcode className="text-xs" />
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setEditingAthlete(athlete);
                                                                    setAthleteForm(athlete);
                                                                    setShowAddAthleteModal(true);
                                                                }}
                                                                title="Edit Profile"
                                                                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                                            >
                                                                <FiEdit2 className="text-xs" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteAthlete(athlete.id, athlete.name)}
                                                                title="Delete Athlete"
                                                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                            >
                                                                <FiTrash2 className="text-xs" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 3: PAYMENTS & BILLING CRUD */}
                    {/* ========================================================================= */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Payments & Fee Records
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Track fee collections, membership dues, issue PDF receipts, and edit payment logs.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingPayment(null);
                                        setPaymentForm({
                                            athleteName: athletes[0]?.name || '',
                                            sport: athletes[0]?.sport || 'Football',
                                            plan: 'Pro Academy Monthly',
                                            amount: 3999,
                                            method: 'UPI (GPay)',
                                            status: 'Completed',
                                            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                        });
                                        setShowAddPaymentModal(true);
                                    }}
                                    className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                >
                                    <FiPlus /> Record Fee Payment
                                </button>
                            </div>

                            {/* Payments Table */}
                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-5 py-4">Receipt / ID</th>
                                                <th className="px-5 py-4">Athlete & Sport</th>
                                                <th className="px-5 py-4">Plan & Amount</th>
                                                <th className="px-5 py-4">Date & Method</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {payments.map((pay) => (
                                                <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="font-mono font-bold text-slate-900">{pay.receiptNo || pay.id}</div>
                                                        <div className="text-[11px] text-slate-400">{pay.id}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900">{pay.athleteName}</div>
                                                        <div className="text-[11px] text-[#FF6A1A] font-semibold">{pay.sport}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-emerald-600 text-sm">₹{pay.amount?.toLocaleString()}</div>
                                                        <div className="text-[11px] text-slate-400">{pay.plan}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-800">{pay.date}</div>
                                                        <div className="text-[11px] text-slate-400">{pay.method}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                                                            {pay.status}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => handleDownloadReceiptPDF(pay)}
                                                                title="Download PDF Receipt"
                                                                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6A1A] transition-colors"
                                                            >
                                                                <FiDownload className="text-xs" />
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setEditingPayment(pay);
                                                                    setPaymentForm(pay);
                                                                    setShowAddPaymentModal(true);
                                                                }}
                                                                title="Edit Payment"
                                                                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                                            >
                                                                <FiEdit2 className="text-xs" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeletePayment(pay.id)}
                                                                title="Delete Transaction"
                                                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                            >
                                                                <FiTrash2 className="text-xs" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 4: FEE DUE & BROADCAST AUTO REMINDERS */}
                    {/* ========================================================================= */}
                    {activeTab === 'reminders' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Fee Due & Payment Reminders
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Automated monthly & yearly fee collection reminders via WhatsApp & SMS.
                                    </p>
                                </div>

                                <button
                                    onClick={handleBroadcastDueReminders}
                                    disabled={broadcastingNotice}
                                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-transform active:scale-95"
                                >
                                    <FaWhatsapp className="text-base" />
                                    <span>{broadcastingNotice ? 'Dispatching...' : 'Broadcast Auto Reminder to All'}</span>
                                </button>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pending Collection</span>
                                    <div className="font-display font-black text-3xl text-red-600">₹{totalPendingDues.toLocaleString()}</div>
                                    <p className="text-xs text-slate-500">{dueAthletes.length} students currently have pending balance.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right text-xs text-slate-400">
                                        <p>Auto Reminder System: <strong className="text-emerald-600">Active</strong></p>
                                        <p>Schedule: 1st & 15th of Every Month</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dues Roster */}
                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-5 py-4">Athlete Name & Phone</th>
                                                <th className="px-5 py-4">Sport & Billing Duration</th>
                                                <th className="px-5 py-4">Due Balance</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-right">Remind & Collect</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dueAthletes.map((athlete) => (
                                                <tr key={athlete.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900">{athlete.name}</div>
                                                        <div className="text-[11px] text-slate-400">{athlete.phone} • {athlete.id}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-800">{athlete.sport}</div>
                                                        <div className="text-[11px] text-slate-400">{athlete.planType || 'Monthly'} Plan • {athlete.membership}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-red-600 text-sm">₹{athlete.dueAmount?.toLocaleString()}</div>
                                                        <div className="text-[10px] text-slate-400">Total: ₹{athlete.feeAmount?.toLocaleString()}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                                                            {athlete.paymentStatus}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleSendIndividualReminder(athlete)}
                                                                className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                                                            >
                                                                <FaWhatsapp />
                                                                <span>WhatsApp</span>
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setAthletes(athletes.map(a => a.id === athlete.id ? { ...a, dueAmount: 0, paymentStatus: 'Paid' } : a));
                                                                    showToast(`Marked ${athlete.name} fee balance as fully paid!`);
                                                                }}
                                                                className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
                                                            >
                                                                <FiCheck />
                                                                <span>Mark Paid</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 5: COACHES & TECHNICAL STAFF (FULL CRUD) */}
                    {/* ========================================================================= */}
                    {activeTab === 'coaches' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Coaches & Mentors Management
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Certified head coaches, training batch assignments, and compensation records.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingCoach(null);
                                        setCoachForm({
                                            name: '',
                                            sport: 'Football',
                                            certification: 'AFC Pro License & UEFA-A',
                                            phone: '',
                                            email: '',
                                            experience: 5,
                                            trainees: 20,
                                            monthlySalary: '₹60,000',
                                            rating: 4.8
                                        });
                                        setShowAddCoachModal(true);
                                    }}
                                    className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                >
                                    <FiPlus /> Add New Coach
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {coaches.map((coach) => (
                                    <div key={coach.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6A1A] font-bold text-[10px] uppercase">
                                                    {coach.sport}
                                                </span>
                                                <span className="text-xs font-bold text-amber-500">★ {coach.rating}</span>
                                            </div>

                                            <h3 className="font-display font-bold text-lg text-slate-900">{coach.name}</h3>
                                            <p className="text-xs text-slate-500 font-semibold">{coach.certification}</p>
                                        </div>

                                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
                                            <div className="flex justify-between">
                                                <span>Experience:</span>
                                                <strong className="text-slate-800">{coach.experience} Years</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Active Trainees:</span>
                                                <strong className="text-[#FF6A1A]">{coach.trainees} Athletes</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Phone:</span>
                                                <strong className="text-slate-800">{coach.phone}</strong>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <span className="text-xs font-bold text-slate-700">{coach.monthlySalary} / mo</span>
                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        setEditingCoach(coach);
                                                        setCoachForm(coach);
                                                        setShowAddCoachModal(true);
                                                    }}
                                                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Remove coach ${coach.name}?`)) {
                                                            setCoaches(coaches.filter(c => c.id !== coach.id));
                                                            showToast(`Coach ${coach.name} removed.`, 'info');
                                                        }
                                                    }}
                                                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 6: TOURNAMENTS & LEAGUE EVENTS (NEW TAB WITH FULL CRUD) */}
                    {/* ========================================================================= */}
                    {activeTab === 'tournaments' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Leagues & Tournaments Management
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Organize inter-academy tournaments, match fixtures, prize pools, and team registrations.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingTournament(null);
                                        setShowAddTournamentModal(true);
                                    }}
                                    className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                >
                                    <FiPlus /> Host New Tournament
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tournaments.map((trn) => (
                                    <div key={trn.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6A1A] font-bold text-[10px] uppercase">
                                                    {trn.sport}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                                    trn.status === 'In Progress' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {trn.status}
                                                </span>
                                            </div>

                                            <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                                                {trn.title}
                                            </h3>
                                            <p className="text-xs text-slate-400">{trn.ageCategory} • {trn.venue}</p>
                                        </div>

                                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
                                            <div className="flex justify-between">
                                                <span>Dates:</span>
                                                <strong className="text-slate-800">{trn.startDate} to {trn.endDate}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Registered Teams:</span>
                                                <strong className="text-slate-800">{trn.teamsCount} Teams</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Prize Pool:</span>
                                                <strong className="text-[#FF6A1A] font-bold">{trn.prizePool}</strong>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                            <button
                                                onClick={() => {
                                                    setEditingTournament(trn);
                                                    setTournamentForm(trn);
                                                    setShowAddTournamentModal(true);
                                                }}
                                                className="py-1.5 px-3 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Delete tournament "${trn.title}"?`)) {
                                                        setTournaments(tournaments.filter(t => t.id !== trn.id));
                                                        showToast(`Tournament removed.`, 'info');
                                                    }
                                                }}
                                                className="py-1.5 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 7: PHYSIO & INJURY RECOVERY LAB (NEW TAB WITH FULL CRUD) */}
                    {/* ========================================================================= */}
                    {activeTab === 'physio' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Sports Physio & Injury Recovery Lab
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Track athlete rehabilitation logs, ice bath sessions, and match-fitness clearances.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingPhysio(null);
                                        setShowAddPhysioModal(true);
                                    }}
                                    className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                >
                                    <FiPlus /> Log Injury / Rehab Session
                                </button>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-5 py-4">Athlete & Sport</th>
                                                <th className="px-5 py-4">Injury Diagnosis</th>
                                                <th className="px-5 py-4">Physiotherapist & Therapy</th>
                                                <th className="px-5 py-4">Expected Return</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {physioLogs.map((phy) => (
                                                <tr key={phy.id} className="hover:bg-slate-50/70">
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900 text-sm">{phy.athleteName}</div>
                                                        <div className="text-[11px] text-[#FF6A1A] font-semibold">{phy.sport}</div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-800">{phy.injuryType}</div>
                                                        <div className="text-[10px] text-slate-400">Date: {phy.injuryDate}</div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-700">{phy.therapist}</div>
                                                        <div className="text-[11px] text-slate-500">{phy.treatment}</div>
                                                    </td>
                                                    <td className="px-5 py-4 font-mono font-bold text-slate-800">{phy.expectedReturn}</td>
                                                    <td className="px-5 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                            phy.recoveryStatus === 'Match Fit'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : phy.recoveryStatus === 'Light Training'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {phy.recoveryStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingPhysio(phy);
                                                                    setPhysioForm(phy);
                                                                    setShowAddPhysioModal(true);
                                                                }}
                                                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600"
                                                            >
                                                                <FiEdit2 />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('Delete this physio record?')) {
                                                                        setPhysioLogs(physioLogs.filter(p => p.id !== phy.id));
                                                                        showToast('Physio log removed.', 'info');
                                                                    }
                                                                }}
                                                                className="p-1.5 rounded-lg bg-red-50 text-red-600"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 8: FITNESS & BIOMECHANICS ASSESSMENTS (NEW TAB WITH FULL CRUD) */}
                    {/* ========================================================================= */}
                    {activeTab === 'assessments' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Fitness & Biomechanics Lab Metrics
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Laser sprint timings, vertical jump, VO2 Max, and scouting prospects.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingAssessment(null);
                                        setShowAddAssessmentModal(true);
                                    }}
                                    className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                >
                                    <FiPlus /> Record Test Score
                                </button>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-5 py-4">Athlete & Sport</th>
                                                <th className="px-5 py-4">30m Speed Gate</th>
                                                <th className="px-5 py-4">Vertical Leap</th>
                                                <th className="px-5 py-4">VO2 Max</th>
                                                <th className="px-5 py-4">Max Deadlift</th>
                                                <th className="px-5 py-4">Scout Rating</th>
                                                <th className="px-5 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {assessments.map((asm) => (
                                                <tr key={asm.id} className="hover:bg-slate-50/70">
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900 text-sm">{asm.athleteName}</div>
                                                        <div className="text-[11px] text-[#FF6A1A] font-semibold">{asm.sport}</div>
                                                    </td>
                                                    <td className="px-5 py-4 font-mono font-bold text-slate-900">{asm.sprint30m}</td>
                                                    <td className="px-5 py-4 font-mono font-bold text-slate-900">{asm.verticalJump}</td>
                                                    <td className="px-5 py-4 font-mono font-bold text-slate-900">{asm.vo2Max}</td>
                                                    <td className="px-5 py-4 font-mono font-bold text-slate-900">{asm.deadlift}</td>
                                                    <td className="px-5 py-4">
                                                        <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#FF6A1A] font-bold text-[10px] uppercase">
                                                            {asm.rating}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingAssessment(asm);
                                                                    setAssessmentForm(asm);
                                                                    setShowAddAssessmentModal(true);
                                                                }}
                                                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600"
                                                            >
                                                                <FiEdit2 />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('Delete this assessment record?')) {
                                                                        setAssessments(assessments.filter(a => a.id !== asm.id));
                                                                        showToast('Assessment score removed.', 'info');
                                                                    }
                                                                }}
                                                                className="p-1.5 rounded-lg bg-red-50 text-red-600"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 9: SPORTS EQUIPMENT & INVENTORY */}
                    {/* ========================================================================= */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Sports Equipment & Facility Gear
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Monitor balls, training gear, racquets, safety equipment, and threshold reorders.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingInventory(null);
                                        setInventoryForm({
                                            name: '',
                                            sport: 'Football',
                                            category: 'Balls & Turf Gear',
                                            totalQty: 20,
                                            availableQty: 20,
                                            damagedQty: 0,
                                            location: 'Ground Equipment Shed',
                                            minThreshold: 5,
                                            unitCost: '₹1,500'
                                        });
                                        setShowAddInventoryModal(true);
                                    }}
                                    className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                >
                                    <FiPlus /> Add Equipment Item
                                </button>
                            </div>

                            {/* Inventory Table */}
                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-5 py-4">Item & Sport</th>
                                                <th className="px-5 py-4">Category & Location</th>
                                                <th className="px-5 py-4">Stock Status</th>
                                                <th className="px-5 py-4">Unit Value</th>
                                                <th className="px-5 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {inventory.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                                                        <div className="text-[11px] text-[#FF6A1A] font-semibold">{item.sport} • {item.id}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-800">{item.category}</div>
                                                        <div className="text-[11px] text-slate-400">{item.location}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <strong className="text-slate-900 text-sm">{item.availableQty}</strong>
                                                            <span className="text-slate-400">/ {item.totalQty} Total</span>
                                                        </div>
                                                        <span className={`text-[10px] font-bold uppercase ${
                                                            item.availableQty <= item.minThreshold
                                                                ? 'text-red-500'
                                                                : 'text-emerald-600'
                                                        }`}>
                                                            {item.availableQty <= item.minThreshold ? 'Low Stock Alert' : 'Stock Optimal'}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-800">{item.unitCost}</div>
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => {
                                                                    setInventory(inventory.map(i => i.id === item.id ? { ...i, availableQty: i.availableQty + 5, totalQty: i.totalQty + 5 } : i));
                                                                    showToast(`Added +5 stock to ${item.name}`);
                                                                }}
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs"
                                                            >
                                                                +5
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setEditingInventory(item);
                                                                    setInventoryForm(item);
                                                                    setShowAddInventoryModal(true);
                                                                }}
                                                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs"
                                                            >
                                                                <FiEdit2 />
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm(`Delete ${item.name}?`)) {
                                                                        setInventory(inventory.filter(i => i.id !== item.id));
                                                                        showToast(`${item.name} removed from inventory.`, 'info');
                                                                    }
                                                                }}
                                                                className="p-1.5 rounded-lg bg-red-50 text-red-600 text-xs"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 10: MEMBERSHIP PLANS MANAGEMENT */}
                    {/* ========================================================================= */}
                    {activeTab === 'memberships' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Academy Membership Plans
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Configure subscription packages, cohort fees, and athlete perks.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleOpenQrModal}
                                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                                    >
                                        <FaQrcode /> Membership QR Posters
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingPlan(null);
                                            setPlanForm({
                                                name: '',
                                                sport: 'Football',
                                                duration: '1 Month',
                                                price: 3999,
                                                badge: 'Popular',
                                                featuresText: '3 Pro Coaching Sessions/Wk\nTurf Access\nJersey Provided'
                                            });
                                            setShowAddPlanModal(true);
                                        }}
                                        className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                    >
                                        <FiPlus /> Create New Plan
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {memberships.map((plan) => (
                                    <div key={plan.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full">
                                                    {plan.badge}
                                                </span>
                                                <span className="text-xs text-slate-400 font-semibold">{plan.activeAthletes || 0} Enrolled</span>
                                            </div>

                                            <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
                                                {plan.name}
                                            </h3>

                                            <div className="font-display font-black text-2xl text-slate-900">
                                                ₹{plan.price.toLocaleString()}
                                                <span className="text-xs font-normal text-slate-400"> / {plan.duration}</span>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 space-y-2">
                                                <span className="text-[10px] font-bold uppercase text-slate-400 block">Features Included:</span>
                                                <ul className="space-y-1.5 text-xs text-slate-600">
                                                    {plan.features.map((f, idx) => (
                                                        <li key={idx} className="flex items-center gap-2">
                                                            <FiCheck className="text-emerald-500 shrink-0 text-xs" />
                                                            <span>{f}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleOpenMembershipPlanQr(plan)}
                                                className="w-full py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6A1A] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                                                title="Get QR code for this membership plan"
                                            >
                                                <FaQrcode /> Plan QR (PNG / PDF)
                                            </button>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingPlan(plan);
                                                        setPlanForm({
                                                            name: plan.name,
                                                            sport: plan.sport,
                                                            duration: plan.duration,
                                                            price: plan.price,
                                                            badge: plan.badge,
                                                            featuresText: plan.features.join('\n')
                                                        });
                                                        setShowAddPlanModal(true);
                                                    }}
                                                    className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Delete membership plan "${plan.name}"?`)) {
                                                            setMemberships(memberships.filter(m => m.id !== plan.id));
                                                            showToast(`Plan ${plan.name} removed.`, 'info');
                                                        }
                                                    }}
                                                    className="py-2 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 11: CONTACT INQUIRIES & TRIAL LEADS */}
                    {/* ========================================================================= */}
                    {activeTab === 'inquiries' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Contact Inquiries & Trial Leads
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Incoming trial requests, parent queries, and enrollment opportunities.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setEditingInquiry(null);
                                        setInquiryForm({
                                            name: '',
                                            phone: '',
                                            email: '',
                                            sport: 'Football',
                                            ageGroup: 'Ages 10-15',
                                            message: 'Interested in trial session.'
                                        });
                                        setShowAddInquiryModal(true);
                                    }}
                                    className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                >
                                    <FiPlus /> Add New Lead
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {inquiries.map((inq) => (
                                    <div key={inq.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider">
                                                    {inq.sport} • {inq.ageGroup}
                                                </span>
                                                <h3 className="font-display font-bold text-lg text-slate-900">{inq.name}</h3>
                                                <p className="text-xs text-slate-400">{inq.phone} • {inq.email}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                inq.status === 'New' ? 'bg-orange-100 text-[#FF6A1A]' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {inq.status}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                                            "{inq.message}"
                                        </p>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                            <span className="text-slate-400">{inq.date}</span>
                                            
                                            <div className="flex gap-2">
                                                <a
                                                    href={`tel:${inq.phone}`}
                                                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
                                                >
                                                    <FiPhone className="text-xs" /> Call
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        const next = inq.status === 'New' ? 'Trial Scheduled' : inq.status === 'Trial Scheduled' ? 'Enrolled' : 'Closed';
                                                        setInquiries(inquiries.map(i => i.id === inq.id ? { ...i, status: next } : i));
                                                        showToast(`Updated status to "${next}"`);
                                                    }}
                                                    className="py-1.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold"
                                                >
                                                    Advance Status
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Delete inquiry for ${inq.name}?`)) {
                                                            setInquiries(inquiries.filter(i => i.id !== inq.id));
                                                            showToast(`Inquiry deleted.`, 'info');
                                                        }
                                                    }}
                                                    className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                </main>
            </div>

            {/* ========================================================================= */}
            {/* MOBILE BOTTOM PWA NAVIGATION BAR */}
            {/* ========================================================================= */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white px-2 py-2 flex items-center justify-around shadow-2xl">
                {[
                    { id: 'overview', name: 'Dashboard', icon: <FiGrid /> },
                    { id: 'athletes', name: 'Athletes', icon: <FiUsers /> },
                    { id: 'payments', name: 'Payments', icon: <FiDollarSign /> },
                    { id: 'reminders', name: 'Dues', icon: <FiBell /> }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                            activeTab === item.id
                                ? 'text-[#FF6A1A] font-bold scale-105'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-[10px]">{item.name}</span>
                    </button>
                ))}

                <button
                    onClick={() => setMobileDrawerOpen(true)}
                    className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-white"
                >
                    <span className="text-lg"><FiMenu /></span>
                    <span className="text-[10px]">More Tabs</span>
                </button>
            </nav>

            {/* ========================================================================= */}
            {/* MODAL 1: ADD / EDIT ATHLETE */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddAthleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <h3 className="font-display font-bold text-lg">
                                    {editingAthlete ? 'Edit Athlete Profile' : 'Enroll New Athlete'}
                                </h3>
                                <button onClick={() => setShowAddAthleteModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveAthlete} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={athleteForm.name}
                                        onChange={(e) => setAthleteForm({ ...athleteForm, name: e.target.value })}
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={athleteForm.phone}
                                            onChange={(e) => setAthleteForm({ ...athleteForm, phone: e.target.value })}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Age & Gender</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={athleteForm.age}
                                                onChange={(e) => setAthleteForm({ ...athleteForm, age: Number(e.target.value) })}
                                                className="w-20 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            />
                                            <select
                                                value={athleteForm.gender}
                                                onChange={(e) => setAthleteForm({ ...athleteForm, gender: e.target.value })}
                                                className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport Discipline</label>
                                        <select
                                            value={athleteForm.sport}
                                            onChange={(e) => updateAthleteFormSportOrPlan(e.target.value, athleteForm.planType || 'Monthly')}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Membership Duration</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateAthleteFormSportOrPlan(athleteForm.sport, 'Monthly')}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                                                    (athleteForm.planType || 'Monthly') === 'Monthly'
                                                        ? 'bg-[#FF6A1A] text-white'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateAthleteFormSportOrPlan(athleteForm.sport, 'Yearly')}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                                                    athleteForm.planType === 'Yearly'
                                                        ? 'bg-[#FF6A1A] text-white'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                Yearly
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Total Plan Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={athleteForm.feeAmount}
                                            onChange={(e) => {
                                                const fee = Number(e.target.value);
                                                const paid = Number(athleteForm.amountPaid || 0);
                                                setAthleteForm({ ...athleteForm, feeAmount: fee, dueAmount: Math.max(0, fee - paid) });
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Amount Paid Now (₹)</label>
                                        <input
                                            type="number"
                                            value={athleteForm.amountPaid}
                                            onChange={(e) => {
                                                const paid = Number(e.target.value);
                                                const fee = Number(athleteForm.feeAmount || 0);
                                                setAthleteForm({ ...athleteForm, amountPaid: paid, dueAmount: Math.max(0, fee - paid) });
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-600"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-orange-50/70 p-3 rounded-xl border border-orange-200 text-xs">
                                    <span className="font-semibold text-slate-700">Calculated Due Amount:</span>
                                    <strong className="text-red-600 font-bold text-sm">
                                        ₹{Math.max(0, Number(athleteForm.feeAmount || 0) - Number(athleteForm.amountPaid || 0)).toLocaleString()}
                                    </strong>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAthleteModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingAthlete ? 'Save Changes' : 'Enroll Athlete'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 2: SELF-REGISTRATION QR CODE MODAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showQrModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden text-center p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">ATHLETE ONBOARDING</span>
                                    <h3 className="font-display font-black text-lg text-slate-900">Registration QR Code</h3>
                                </div>
                                <button onClick={() => setShowQrModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                Students or parents can scan this QR code on their smartphone to fill out their details and register into PlayPeak academy in real-time!
                            </p>

                            <div className="bg-slate-950 p-4 rounded-3xl inline-block shadow-xl">
                                {qrCodeDataUrl ? (
                                    <img src={qrCodeDataUrl} alt="Athlete Enrollment QR Code" className="w-48 h-48 mx-auto rounded-xl bg-white p-2" />
                                ) : (
                                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                                        <FaQrcode className="text-7xl text-slate-900" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2.5 pt-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => downloadQrImage(qrCodeDataUrl, 'PlayPeak_Student_Enrollment_QR.png')}
                                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                    >
                                        <FiDownload /> Download PNG
                                    </button>
                                    <button
                                        onClick={() => downloadQrPdf({
                                            title: "STUDENT & ATHLETE REGISTRATION QR POSTER",
                                            subtitle: "Scan with your smartphone camera to self-enroll in PlayPeak Sports Academy cohorts.",
                                            qrDataUrl: qrCodeDataUrl,
                                            fileName: "PlayPeak_Registration_QR_Poster.pdf",
                                            instructions: "1. Open Camera or Scanner App  2. Point at QR Code  3. Fill Athlete Details & Select Coaching Batch"
                                        })}
                                        className="py-2.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
                                    >
                                        <FiPrinter /> Download PDF
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/enroll`);
                                        showToast('Enrollment link copied to clipboard!');
                                    }}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FiCopy /> Copy Public Link
                                </button>

                                <button
                                    onClick={() => window.open('/enroll', '_blank')}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    <FiExternalLink /> Open Registration Page
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3A: ADD / EDIT FEE PAYMENT */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">FEES & BILLING</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingPayment ? 'Edit Payment Record' : 'Record Fee Payment'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddPaymentModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePayment} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Athlete or Enter Name *</label>
                                    <div className="space-y-2">
                                        <select
                                            onChange={(e) => {
                                                const selected = athletes.find(a => a.name === e.target.value);
                                                if (selected) {
                                                    setPaymentForm({
                                                        ...paymentForm,
                                                        athleteName: selected.name,
                                                        sport: selected.sport,
                                                        plan: selected.membership || `${selected.sport} ${selected.planType || 'Monthly'} Pass`,
                                                        amount: selected.dueAmount > 0 ? selected.dueAmount : selected.feeAmount || 3999
                                                    });
                                                }
                                            }}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="">-- Choose Registered Athlete --</option>
                                            {athletes.map(a => (
                                                <option key={a.id} value={a.name}>
                                                    {a.name} ({a.sport} - {a.dueAmount > 0 ? `Due: ₹${a.dueAmount}` : 'Paid'})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={paymentForm.athleteName}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, athleteName: e.target.value })}
                                            placeholder="Athlete Full Name *"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport Discipline</label>
                                        <select
                                            value={paymentForm.sport}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Membership / Pass Plan</label>
                                        <input
                                            type="text"
                                            value={paymentForm.plan}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, plan: e.target.value })}
                                            placeholder="e.g. Pro Academy Monthly"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid (₹) *</label>
                                        <input
                                            type="number"
                                            value={paymentForm.amount}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                                            placeholder="3999"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-600 focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                                        <select
                                            value={paymentForm.method}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="UPI (GPay / PhonePe / Paytm)">UPI (GPay / PhonePe / Paytm)</option>
                                            <option value="Reception Cash Desk">Reception Cash Desk</option>
                                            <option value="Credit / Debit Card POS">Credit / Debit Card POS</option>
                                            <option value="Net Banking / NEFT / IMPS">Net Banking / NEFT / IMPS</option>
                                            <option value="Online QR Pass">Online QR Pass</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Payment Status</label>
                                        <select
                                            value={paymentForm.status}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Completed">Completed</option>
                                            <option value="Pending">Pending Verification</option>
                                            <option value="Partial">Partial Installment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Next Renewal / Due Date</label>
                                        <input
                                            type="date"
                                            value={paymentForm.dueDate}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddPaymentModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingPayment ? 'Update Payment' : 'Save & Issue Receipt'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3B: ADD / EDIT COACH */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddCoachModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">TECHNICAL STAFF</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingCoach ? 'Edit Coach Profile' : 'Add New Coach / Mentor'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddCoachModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveCoach} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Coach Full Name *</label>
                                    <input
                                        type="text"
                                        value={coachForm.name}
                                        onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                                        placeholder="e.g. Coach Rajesh Sharma"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport Discipline</label>
                                        <select
                                            value={coachForm.sport}
                                            onChange={(e) => setCoachForm({ ...coachForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Certification / License *</label>
                                        <input
                                            type="text"
                                            value={coachForm.certification}
                                            onChange={(e) => setCoachForm({ ...coachForm, certification: e.target.value })}
                                            placeholder="AFC Pro License & UEFA-A"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={coachForm.phone}
                                            onChange={(e) => setCoachForm({ ...coachForm, phone: e.target.value })}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={coachForm.email}
                                            onChange={(e) => setCoachForm({ ...coachForm, email: e.target.value })}
                                            placeholder="coach@playpeaksports.com"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Yrs)</label>
                                        <input
                                            type="number"
                                            value={coachForm.experience}
                                            onChange={(e) => setCoachForm({ ...coachForm, experience: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Active Trainees</label>
                                        <input
                                            type="number"
                                            value={coachForm.trainees}
                                            onChange={(e) => setCoachForm({ ...coachForm, trainees: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Rating (★)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            max="5.0"
                                            min="1.0"
                                            value={coachForm.rating}
                                            onChange={(e) => setCoachForm({ ...coachForm, rating: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-amber-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Compensation</label>
                                    <input
                                        type="text"
                                        value={coachForm.monthlySalary}
                                        onChange={(e) => setCoachForm({ ...coachForm, monthlySalary: e.target.value })}
                                        placeholder="₹60,000"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCoachModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingCoach ? 'Save Changes' : 'Register Coach'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3C: ADD / EDIT INVENTORY */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddInventoryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">FACILITY ASSETS</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingInventory ? 'Edit Equipment Item' : 'Add Equipment Item'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddInventoryModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveInventory} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Name *</label>
                                    <input
                                        type="text"
                                        value={inventoryForm.name}
                                        onChange={(e) => setInventoryForm({ ...inventoryForm, name: e.target.value })}
                                        placeholder="e.g. FIFA Quality Pro Match Balls"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport</label>
                                        <select
                                            value={inventoryForm.sport}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                                        <select
                                            value={inventoryForm.category}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, category: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Balls & Turf Gear">Balls & Turf Gear</option>
                                            <option value="Rackets & Bats">Rackets & Bats</option>
                                            <option value="Protective & Safety Gear">Protective & Safety Gear</option>
                                            <option value="Fitness & Conditioning">Fitness & Conditioning</option>
                                            <option value="Electronics & Timing Sensors">Electronics & Timing Sensors</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Total Stock</label>
                                        <input
                                            type="number"
                                            value={inventoryForm.totalQty}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, totalQty: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Available Qty</label>
                                        <input
                                            type="number"
                                            value={inventoryForm.availableQty}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, availableQty: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Low Alert Limit</label>
                                        <input
                                            type="number"
                                            value={inventoryForm.minThreshold}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, minThreshold: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Storage Location</label>
                                        <input
                                            type="text"
                                            value={inventoryForm.location}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, location: e.target.value })}
                                            placeholder="Ground Equipment Shed"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Unit Cost</label>
                                        <input
                                            type="text"
                                            value={inventoryForm.unitCost}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, unitCost: e.target.value })}
                                            placeholder="₹1,500"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddInventoryModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingInventory ? 'Update Item' : 'Add Item'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3D: ADD / EDIT MEMBERSHIP PLAN */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddPlanModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">MEMBERSHIP PACKAGE</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddPlanModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePlan} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Plan Title *</label>
                                    <input
                                        type="text"
                                        value={planForm.name}
                                        onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                                        placeholder="e.g. Pro Cricket Academy Annual"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport Cohort</label>
                                        <select
                                            value={planForm.sport}
                                            onChange={(e) => setPlanForm({ ...planForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="All">All Disciplines</option>
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                                        <select
                                            value={planForm.duration}
                                            onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="1 Month">1 Month</option>
                                            <option value="3 Months">3 Months (Quarterly)</option>
                                            <option value="6 Months">6 Months (Half-Yearly)</option>
                                            <option value="1 Year">1 Year (Annual VIP)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Package Fee (₹) *</label>
                                        <input
                                            type="number"
                                            value={planForm.price}
                                            onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                                            placeholder="3999"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                                        <select
                                            value={planForm.badge}
                                            onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Popular">Popular</option>
                                            <option value="Best Value">Best Value</option>
                                            <option value="Elite Pro">Elite Pro</option>
                                            <option value="Weekend Special">Weekend Special</option>
                                            <option value="Starter">Starter</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Included Perks & Features (1 per line)</label>
                                    <textarea
                                        rows="4"
                                        value={planForm.featuresText}
                                        onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
                                        placeholder="3 Pro Coaching Sessions/Wk&#10;Turf Floodlight Access&#10;Official Jersey Kit&#10;Physio Lab Discount"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddPlanModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingPlan ? 'Save Plan Changes' : 'Create Plan'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3E: ADD / EDIT INQUIRY LEAD */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddInquiryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">CRM LEADS</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingInquiry ? 'Edit Inquiry / Lead' : 'Add Trial Lead / Inquiry'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddInquiryModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveInquiry} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Prospect / Parent Name *</label>
                                    <input
                                        type="text"
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                        placeholder="e.g. Manish Rawat"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={inquiryForm.phone}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                            placeholder="+91 98260 99887"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={inquiryForm.email}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                            placeholder="manish@gmail.com"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport Interested</label>
                                        <select
                                            value={inquiryForm.sport}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Age Group</label>
                                        <input
                                            type="text"
                                            value={inquiryForm.ageGroup}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, ageGroup: e.target.value })}
                                            placeholder="Under 14 (Son)"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Message / Training Requirements</label>
                                    <textarea
                                        rows="3"
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                        placeholder="Looking for trial coaching session on Saturday..."
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddInquiryModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingInquiry ? 'Update Lead' : 'Save Lead'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 4: ADD / EDIT TOURNAMENT */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddTournamentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <h3 className="font-display font-bold text-lg">{editingTournament ? 'Edit Tournament' : 'Host Tournament'}</h3>
                                <button onClick={() => setShowAddTournamentModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveTournament} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Tournament Title *</label>
                                    <input
                                        type="text"
                                        value={tournamentForm.title}
                                        onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                                        placeholder="e.g. Indore Inter-Academy Cup"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport</label>
                                        <select
                                            value={tournamentForm.sport}
                                            onChange={(e) => setTournamentForm({ ...tournamentForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Prize Pool</label>
                                        <input
                                            type="text"
                                            value={tournamentForm.prizePool}
                                            onChange={(e) => setTournamentForm({ ...tournamentForm, prizePool: e.target.value })}
                                            placeholder="₹1,00,000"
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={tournamentForm.startDate}
                                            onChange={(e) => setTournamentForm({ ...tournamentForm, startDate: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={tournamentForm.endDate}
                                            onChange={(e) => setTournamentForm({ ...tournamentForm, endDate: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => setShowAddTournamentModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                                        Save Tournament
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 5: ADD / EDIT PHYSIO LOG */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddPhysioModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <h3 className="font-display font-bold text-lg">{editingPhysio ? 'Edit Physio Log' : 'Log Injury / Rehab'}</h3>
                                <button onClick={() => setShowAddPhysioModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePhysio} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Athlete Name *</label>
                                    <input
                                        type="text"
                                        value={physioForm.athleteName}
                                        onChange={(e) => setPhysioForm({ ...physioForm, athleteName: e.target.value })}
                                        placeholder="e.g. Kabir Patel"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport</label>
                                        <select
                                            value={physioForm.sport}
                                            onChange={(e) => setPhysioForm({ ...physioForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                                        <select
                                            value={physioForm.recoveryStatus}
                                            onChange={(e) => setPhysioForm({ ...physioForm, recoveryStatus: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="In Rehab">In Rehab</option>
                                            <option value="Light Training">Light Training</option>
                                            <option value="Match Fit">Match Fit (Cleared)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Injury Diagnosis</label>
                                    <input
                                        type="text"
                                        value={physioForm.injuryType}
                                        onChange={(e) => setPhysioForm({ ...physioForm, injuryType: e.target.value })}
                                        placeholder="e.g. Ankle Sprain Grade 1"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Prescribed Therapy / Exercises</label>
                                    <textarea
                                        rows="2"
                                        value={physioForm.treatment}
                                        onChange={(e) => setPhysioForm({ ...physioForm, treatment: e.target.value })}
                                        placeholder="Cryotherapy, Ice Bath & Balance"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>

                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => setShowAddPhysioModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                                        Save Physio Log
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 6: ADD / EDIT FITNESS ASSESSMENT */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddAssessmentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <h3 className="font-display font-bold text-lg">{editingAssessment ? 'Edit Assessment' : 'Record Test Metrics'}</h3>
                                <button onClick={() => setShowAddAssessmentModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveAssessment} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Athlete Name *</label>
                                    <input
                                        type="text"
                                        value={assessmentForm.athleteName}
                                        onChange={(e) => setAssessmentForm({ ...assessmentForm, athleteName: e.target.value })}
                                        placeholder="e.g. Aarav Sharma"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">30m Sprint Time</label>
                                        <input
                                            type="text"
                                            value={assessmentForm.sprint30m}
                                            onChange={(e) => setAssessmentForm({ ...assessmentForm, sprint30m: e.target.value })}
                                            placeholder="3.95s"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Vertical Jump</label>
                                        <input
                                            type="text"
                                            value={assessmentForm.verticalJump}
                                            onChange={(e) => setAssessmentForm({ ...assessmentForm, verticalJump: e.target.value })}
                                            placeholder="56 cm"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">VO2 Max</label>
                                        <input
                                            type="text"
                                            value={assessmentForm.vo2Max}
                                            onChange={(e) => setAssessmentForm({ ...assessmentForm, vo2Max: e.target.value })}
                                            placeholder="54.2 ml/kg"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Scout Prospect Rating</label>
                                        <select
                                            value={assessmentForm.rating}
                                            onChange={(e) => setAssessmentForm({ ...assessmentForm, rating: e.target.value })}
                                            className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Elite Prospect">Elite Prospect</option>
                                            <option value="State Level">State Level</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Developing">Developing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => setShowAddAssessmentModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                                        Save Test Metrics
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 7: VIEW ATHLETE ID CARD */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {viewingAthleteCard && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-950 rounded-3xl max-w-sm w-full shadow-2xl border border-slate-800 text-white overflow-hidden p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">OFFICIAL ATHLETE PASS</span>
                                    <h3 className="font-display font-black text-lg text-white">{viewingAthleteCard.name}</h3>
                                </div>
                                <button onClick={() => setViewingAthleteCard(null)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Pass ID:</span>
                                    <strong className="font-mono text-[#FF6A1A]">{viewingAthleteCard.id}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Sport Discipline:</span>
                                    <strong className="text-white">{viewingAthleteCard.sport}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Billing Duration:</span>
                                    <strong className="text-purple-400">{viewingAthleteCard.planType || 'Monthly'} Plan</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Batch Timing:</span>
                                    <strong className="text-slate-300 truncate max-w-[150px]">{viewingAthleteCard.batchTime}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Blood Group:</span>
                                    <strong className="text-white">{viewingAthleteCard.bloodGroup}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Emergency Contact:</span>
                                    <strong className="text-slate-300">{viewingAthleteCard.emergencyContact || viewingAthleteCard.phone}</strong>
                                </div>
                            </div>

                            <div className="text-center pt-2">
                                <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center text-slate-900 shadow-lg">
                                    {athletePassQrDataUrl ? (
                                        <img src={athletePassQrDataUrl} alt="Athlete Pass QR" className="w-full h-full rounded-lg" />
                                    ) : (
                                        <FaQrcode className="text-6xl text-slate-900" />
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 block mt-2">Scan at Arena Gates for Automated Access</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={() => downloadQrImage(athletePassQrDataUrl || qrCodeDataUrl, `PlayPeak_Pass_${viewingAthleteCard.name.replace(/\s+/g, '_')}.png`)}
                                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                                >
                                    <FiDownload /> Download PNG
                                </button>
                                <button
                                    onClick={() => downloadQrPdf({
                                        title: `OFFICIAL ATHLETE PASS: ${viewingAthleteCard.name}`,
                                        subtitle: `PlayPeak Verified Member Pass • ${viewingAthleteCard.sport} Arena`,
                                        qrDataUrl: athletePassQrDataUrl || qrCodeDataUrl,
                                        fileName: `PlayPeak_Pass_${viewingAthleteCard.name.replace(/\s+/g, '_')}.pdf`,
                                        instructions: "Present this digital / printed QR badge at arena security turnstiles for gate access.",
                                        metaData: [
                                            { label: "Athlete ID", value: viewingAthleteCard.id },
                                            { label: "Full Name", value: viewingAthleteCard.name },
                                            { label: "Sport Discipline", value: viewingAthleteCard.sport },
                                            { label: "Membership Plan", value: `${viewingAthleteCard.planType || 'Monthly'} Plan` },
                                            { label: "Batch Schedule", value: viewingAthleteCard.batchTime },
                                            { label: "Emergency Contact", value: viewingAthleteCard.emergencyContact || viewingAthleteCard.phone }
                                        ]
                                    })}
                                    className="py-2.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                                >
                                    <FiPrinter /> Download PDF
                                </button>
                            </div>

                            <button
                                onClick={() => setViewingAthleteCard(null)}
                                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                            >
                                Close Badge
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 8: PWA APP INSTALL & DOWNLOAD GUIDE */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showInstallModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-800 text-white overflow-hidden p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6A1A] to-amber-500 p-2.5 shadow-lg flex items-center justify-center">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <circle cx="50" cy="22" r="12" fill="#FFFFFF" />
                                            <path d="M48 38 L30 54 L38 68 L48 56 L62 78 L78 74 L60 48 L62 38 Z" fill="#FFFFFF" />
                                            <path d="M30 40 L18 52 L26 60 L36 48 Z" fill="#1E293B" />
                                            <path d="M62 48 L76 34 L84 42 L68 56 Z" fill="#1E293B" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-display font-black text-lg text-white">PlayPeak Admin App</h3>
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">PWA Mobile & Desktop Edition</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowInstallModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                                Install PlayPeak Command Center directly on your home screen or desktop taskbar for instant offline access, real-time sync, and native app performance.
                            </p>

                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                                    <div className="font-bold text-slate-100 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
                                        On Android (Chrome / Brave)
                                    </div>
                                    <p className="text-slate-400 text-[11px] pl-7">
                                        Tap the <strong>three dots menu (⋮)</strong> at top-right & select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                                    <div className="font-bold text-slate-100 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">2</span>
                                        On iOS / iPhone (Safari)
                                    </div>
                                    <p className="text-slate-400 text-[11px] pl-7">
                                        Tap the <strong>Share button (⎋)</strong> at the bottom bar & select <strong>"Add to Home Screen"</strong>.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                                    <div className="font-bold text-slate-100 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">3</span>
                                        On Windows / Mac Desktop (Chrome / Edge)
                                    </div>
                                    <p className="text-slate-400 text-[11px] pl-7">
                                        Click the <strong>Install icon (⊞)</strong> inside your browser address bar.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                                <button
                                    onClick={() => {
                                        if (deferredPrompt) {
                                            deferredPrompt.prompt();
                                            deferredPrompt.userChoice.then((choice) => {
                                                if (choice.outcome === 'accepted') {
                                                    showToast('🎉 PlayPeak App installed successfully!');
                                                }
                                            });
                                        }
                                        setShowInstallModal(false);
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
                                >
                                    <FiSmartphone className="text-base" />
                                    <span>Install App on Device</span>
                                </button>
                                <button
                                    onClick={() => setShowInstallModal(false)}
                                    className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                                >
                                    Close
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 9: MEMBERSHIP PLAN QR CODE & PDF POSTER MODAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showMembershipQrModal && selectedPlanQr && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden text-center p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">MEMBERSHIP PLAN QR PASS</span>
                                    <h3 className="font-display font-black text-lg text-slate-900">{selectedPlanQr.name}</h3>
                                </div>
                                <button onClick={() => setShowMembershipQrModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                                <span className="font-semibold text-slate-600">{selectedPlanQr.duration} Pass</span>
                                <strong className="font-display font-bold text-[#FF6A1A] text-sm">₹{selectedPlanQr.price?.toLocaleString()}</strong>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-3xl inline-block shadow-xl">
                                {membershipQrDataUrl ? (
                                    <img src={membershipQrDataUrl} alt="Plan QR Code" className="w-48 h-48 mx-auto rounded-xl bg-white p-2" />
                                ) : (
                                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                                        <FaQrcode className="text-7xl text-slate-900" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2.5 pt-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => downloadQrImage(membershipQrDataUrl, `PlayPeak_${selectedPlanQr.name.replace(/\s+/g, '_')}_QR.png`)}
                                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                    >
                                        <FiDownload /> Download PNG
                                    </button>
                                    <button
                                        onClick={() => downloadQrPdf({
                                            title: `MEMBERSHIP PASS: ${selectedPlanQr.name.toUpperCase()}`,
                                            subtitle: `Scan to enroll directly in ${selectedPlanQr.name} (${selectedPlanQr.duration} - ₹${selectedPlanQr.price?.toLocaleString()})`,
                                            qrDataUrl: membershipQrDataUrl,
                                            fileName: `PlayPeak_${selectedPlanQr.name.replace(/\s+/g, '_')}_Poster.pdf`,
                                            instructions: "1. Open camera on phone  2. Scan QR code  3. Confirm membership plan and coaching timing.",
                                            metaData: [
                                                { label: "Plan Name", value: selectedPlanQr.name },
                                                { label: "Sport Cohort", value: selectedPlanQr.sport || "All Disciplines" },
                                                { label: "Pass Duration", value: selectedPlanQr.duration },
                                                { label: "Package Fee", value: `₹${selectedPlanQr.price?.toLocaleString()}` },
                                                { label: "Perks Included", value: (selectedPlanQr.features || []).slice(0, 3).join(", ") }
                                            ]
                                        })}
                                        className="py-2.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
                                    >
                                        <FiPrinter /> Download PDF
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/enroll?plan=${encodeURIComponent(selectedPlanQr.name)}`;
                                        navigator.clipboard.writeText(url);
                                        showToast('Plan enrollment link copied!');
                                    }}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FiCopy /> Copy Plan Link
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;