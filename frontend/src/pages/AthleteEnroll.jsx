// pages/AthleteEnroll.jsx - PlayPeak Sports Academy Public Athlete Self-Enrollment Form
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiUser,
    FiPhone,
    FiMail,
    FiCalendar,
    FiCheckCircle,
    FiShield,
    FiArrowRight,
    FiArrowLeft,
    FiCheck,
    FiClock,
    FiAward,
    FiDollarSign,
    FiAlertCircle,
    FiActivity,
    FiMapPin,
    FiDownload,
    FiPrinter
} from 'react-icons/fi';
import { FaFutbol, FaQrcode } from 'react-icons/fa';
import { GiWhistle, GiMedal } from 'react-icons/gi';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import axios from 'axios';

const AthleteEnroll = () => {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [enrolledPass, setEnrolledPass] = useState(null);
    const [passQrDataUrl, setPassQrDataUrl] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        age: 15,
        gender: 'Male',
        sport: 'Football',
        batchTime: 'Evening Prime (05:00 PM - 07:00 PM)',
        coach: 'Coach Rajesh Sharma (AFC Pro)',
        planType: 'Monthly', // Monthly, Yearly, Quarterly
        membership: 'Pro Academy Membership',
        amountPaid: 0,
        emergencyContact: '',
        bloodGroup: 'B+',
        notes: ''
    });

    const sportsOptions = [
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

    // Current Sport Pricing
    const currentSportConfig = sportsOptions.find(s => s.sport === formData.sport) || sportsOptions[0];
    const totalFee = formData.planType === 'Yearly' 
        ? currentSportConfig.yearly 
        : formData.planType === 'Quarterly' 
        ? currentSportConfig.quarterly 
        : currentSportConfig.monthly;

    const dueAmount = Math.max(0, totalFee - Number(formData.amountPaid || 0));

    const handleSportChange = (sportName) => {
        const selected = sportsOptions.find(s => s.name === sportName) || sportsOptions[0];
        setFormData({
            ...formData,
            sport: selected.name,
            coach: selected.coach
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.phone.trim()) {
            alert('Please enter your full name and contact number.');
            return;
        }

        const newId = `ATH-${Math.floor(100 + Math.random() * 900)}`;
        const newAthlete = {
            id: newId,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            age: Number(formData.age),
            gender: formData.gender,
            sport: formData.sport,
            batchTime: formData.batchTime,
            coach: formData.coach,
            planType: formData.planType,
            membership: `${formData.sport} ${formData.planType} Pass`,
            feeAmount: totalFee,
            dueAmount: dueAmount,
            paymentStatus: dueAmount === 0 ? 'Paid' : dueAmount === totalFee ? 'Due' : 'Partial',
            joinDate: new Date().toISOString().split('T')[0],
            emergencyContact: formData.emergencyContact || formData.phone,
            bloodGroup: formData.bloodGroup,
            status: 'Active'
        };

        // Save into localStorage
        try {
            const existing = JSON.parse(localStorage.getItem('playpeak_athletes') || '[]');
            const updated = [newAthlete, ...existing];
            localStorage.setItem('playpeak_athletes', JSON.stringify(updated));

            // Send to MongoDB Atlas API
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';
            axios.post(`${API_BASE}athletes`, newAthlete).catch(e => console.warn(e));

            // If amount was paid, also create payment record
            if (formData.amountPaid > 0) {
                const existingPay = JSON.parse(localStorage.getItem('playpeak_payments') || '[]');
                const newPay = {
                    id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
                    athleteId: newId,
                    athleteName: newAthlete.name,
                    sport: newAthlete.sport,
                    plan: newAthlete.membership,
                    amount: Number(formData.amountPaid),
                    date: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    method: 'Online UPI / QR Payment',
                    status: 'Completed',
                    receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`
                };
                localStorage.setItem('playpeak_payments', JSON.stringify([newPay, ...existingPay]));
                axios.post(`${API_BASE}payments`, newPay).catch(e => console.warn(e));
            }

            // Generate QR code for athlete gate pass
            const passData = `https://playpeak.vercel.app/enroll?ref=${newAthlete.id}&sport=${encodeURIComponent(newAthlete.sport)}`;
            QRCode.toDataURL(passData, { width: 320, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
                .then(url => setPassQrDataUrl(url))
                .catch(() => setPassQrDataUrl(''));

            // Dispatch custom window event for real-time dashboard refresh
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('playpeak_athlete_enrolled', { detail: newAthlete }));
        } catch (err) {
            console.error(err);
        }

        setEnrolledPass(newAthlete);
        setIsSubmitted(true);
    };

    const downloadPassImage = () => {
        if (!passQrDataUrl) return;
        const link = document.createElement('a');
        link.href = passQrDataUrl;
        link.download = `PlayPeak_Pass_${(enrolledPass?.name || 'Athlete').replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPassPdf = () => {
        if (!enrolledPass) return;
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            // Header
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 210, 48, 'F');
            doc.setFillColor(255, 106, 26);
            doc.rect(0, 48, 210, 3, 'F');

            doc.setFontSize(22);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text("PLAYPEAK SPORTS ACADEMY", 105, 22, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(255, 106, 26);
            doc.text("OFFICIAL ATHLETE ADMISSION & GATE PASS", 105, 32, { align: "center" });

            // Pass Card Box
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, 58, 170, 200, 4, 4, 'FD');

            doc.setFontSize(18);
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text(enrolledPass.name.toUpperCase(), 105, 75, { align: "center" });

            doc.setFontSize(11);
            doc.setTextColor(255, 106, 26);
            doc.text(`PASS ID: ${enrolledPass.id} • ${enrolledPass.sport} Arena`, 105, 83, { align: "center" });

            // QR Code in center
            if (passQrDataUrl) {
                doc.addImage(passQrDataUrl, 'PNG', 65, 92, 80, 80);
            }

            // Athlete Details
            let yPos = 182;
            const details = [
                { label: "Sport Discipline", val: enrolledPass.sport },
                { label: "Membership Tier", val: `${enrolledPass.planType} Subscription` },
                { label: "Training Schedule", val: enrolledPass.batchTime },
                { label: "Assigned Head Coach", val: enrolledPass.coach },
                { label: "Contact / Phone", val: enrolledPass.phone },
                { label: "Payment Status", val: `${enrolledPass.paymentStatus} (₹${enrolledPass.feeAmount})` }
            ];

            doc.setFontSize(9);
            details.forEach(d => {
                doc.setTextColor(71, 85, 105);
                doc.setFont('helvetica', 'bold');
                doc.text(`${d.label}:`, 35, yPos);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(15, 23, 42);
                doc.text(`${d.val}`, 85, yPos);
                yPos += 7;
            });

            // Instructions
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text("Present this QR admission pass at academy turnstiles for automatic gate check-in.", 105, 245, { align: "center" });

            // Footer
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("PlayPeak Sports Arena, Olympic Complex Road | Helpline: +91 98765 43210", 105, 287, { align: "center" });

            doc.save(`PlayPeak_Admission_Pass_${enrolledPass.name.replace(/\s+/g, '_')}.pdf`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
            
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6A1A]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl w-full relative z-10">
                
                {/* Brand Header */}
                <div className="text-center space-y-2 mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 group">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 100 100" className="w-10 h-10">
                                <circle cx="50" cy="22" r="12" fill="#FF6A1A" />
                                <path d="M48 38 L30 54 L38 68 L48 56 L62 78 L78 74 L60 48 L62 38 Z" fill="#FF6A1A" />
                                <path d="M30 40 L18 52 L26 60 L36 48 Z" fill="#3B82F6" />
                                <path d="M62 48 L76 34 L84 42 L68 56 Z" fill="#3B82F6" />
                            </svg>
                        </div>
                        <div className="text-left leading-tight">
                            <span className="font-display font-black text-2xl text-white tracking-tight">
                                Play<span className="text-[#FF6A1A]">Peak</span>
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                                SPORTS ACADEMY
                            </span>
                        </div>
                    </Link>

                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                        Athlete Self-Registration
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400">
                        Scan QR & Enroll directly into our training cohorts and international sports arenas.
                    </p>
                </div>

                {/* SUCCESS PASS CARD */}
                {isSubmitted && enrolledPass ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl space-y-6"
                    >
                        <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
                                <FiCheckCircle />
                            </div>
                            <h2 className="font-display font-extrabold text-2xl text-slate-900">
                                Enrollment Successful!
                            </h2>
                            <p className="text-xs text-slate-500">
                                Welcome to PlayPeak Sports Academy! Your digital athlete pass is active.
                            </p>
                        </div>

                        {/* Digital ID Pass */}
                        <div className="bg-slate-950 rounded-2xl p-5 text-white space-y-4 relative overflow-hidden shadow-lg">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">DIGITAL ATHLETE PASS</span>
                                    <h3 className="font-display font-bold text-lg">{enrolledPass.name}</h3>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-[#FF6A1A]/20 text-[#FF6A1A] text-xs font-mono font-bold">
                                    {enrolledPass.id}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-slate-400 text-[11px] block">Sport & Discipline</span>
                                    <strong className="text-white font-bold">{enrolledPass.sport}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px] block">Plan Duration</span>
                                    <strong className="text-emerald-400 font-bold">{enrolledPass.planType} Plan</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px] block">Batch Schedule</span>
                                    <strong className="text-slate-200">{enrolledPass.batchTime}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px] block">Assigned Mentor</span>
                                    <strong className="text-slate-200">{enrolledPass.coach}</strong>
                                </div>
                            </div>

                            {/* QR Code Graphic in Pass */}
                            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                                <div className="text-left space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Arena Access Code</span>
                                    <span className="text-xs font-semibold text-emerald-400">Verified Member Pass</span>
                                </div>
                                <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
                                    {passQrDataUrl ? (
                                        <img src={passQrDataUrl} alt="Pass QR" className="w-full h-full" />
                                    ) : (
                                        <FaQrcode className="text-slate-900 text-3xl" />
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Fee Status: <strong className="text-white">{enrolledPass.paymentStatus} (₹{enrolledPass.feeAmount})</strong></span>
                                <span className="text-[11px] text-emerald-400 font-semibold">Active Member</span>
                            </div>
                        </div>

                        {/* Download Buttons: PNG and PDF */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={downloadPassImage}
                                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <FiDownload /> Download Pass (PNG)
                            </button>
                            <button
                                onClick={downloadPassPdf}
                                className="py-3 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
                            >
                                <FiPrinter /> Download PDF Slip
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                            <Link
                                to="/"
                                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider text-center transition-colors"
                            >
                                Back to Home
                            </Link>
                            <button
                                onClick={() => { setIsSubmitted(false); }}
                                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors"
                            >
                                Register Another Student
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    /* ENROLLMENT FORM */
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl space-y-5">
                        
                        {/* Section 1: Personal Details */}
                        <div className="space-y-4">
                            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                <span>1. Athlete Information</span>
                            </h3>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Aarav Sharma"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="aarav@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        min="5"
                                        max="60"
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                                    <select
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        className="w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    >
                                        <option value="A+">A+</option>
                                        <option value="B+">B+</option>
                                        <option value="O+">O+</option>
                                        <option value="AB+">AB+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Sport & Membership Duration */}
                        <div className="space-y-4 pt-2">
                            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                <span>2. Sport & Membership Plan</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Sport *</label>
                                    <select
                                        value={formData.sport}
                                        onChange={(e) => handleSportChange(e.target.value)}
                                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    >
                                        {sportsOptions.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Batch Timing</label>
                                    <select
                                        value={formData.batchTime}
                                        onChange={(e) => setFormData({ ...formData, batchTime: e.target.value })}
                                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    >
                                        <option value="Morning Dawn (06:00 AM - 08:00 AM)">Morning Dawn (06:00 AM - 08:00 AM)</option>
                                        <option value="Evening Prime (05:00 PM - 07:00 PM)">Evening Prime (05:00 PM - 07:00 PM)</option>
                                        <option value="Night Floodlights (07:30 PM - 09:30 PM)">Night Floodlights (07:30 PM - 09:30 PM)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Plan Duration Selector (Monthly vs Yearly vs Quarterly) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Choose Membership Billing Cycle
                                </label>
                                
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, planType: 'Monthly' })}
                                        className={`p-3.5 rounded-2xl border text-center transition-all ${
                                            formData.planType === 'Monthly'
                                                ? 'bg-orange-50 border-[#FF6A1A] text-slate-900 shadow-sm ring-2 ring-[#FF6A1A]/30'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-wider block text-[#FF6A1A]">Monthly</span>
                                        <div className="font-display font-black text-sm sm:text-base text-slate-900">
                                            ₹{currentSportConfig.monthly}
                                        </div>
                                        <span className="text-[10px] text-slate-500">Per Month</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, planType: 'Quarterly' })}
                                        className={`p-3.5 rounded-2xl border text-center transition-all ${
                                            formData.planType === 'Quarterly'
                                                ? 'bg-orange-50 border-[#FF6A1A] text-slate-900 shadow-sm ring-2 ring-[#FF6A1A]/30'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-wider block text-blue-600">Quarterly</span>
                                        <div className="font-display font-black text-sm sm:text-base text-slate-900">
                                            ₹{currentSportConfig.quarterly}
                                        </div>
                                        <span className="text-[10px] text-slate-500">3 Months</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, planType: 'Yearly' })}
                                        className={`p-3.5 rounded-2xl border text-center relative transition-all ${
                                            formData.planType === 'Yearly'
                                                ? 'bg-orange-50 border-[#FF6A1A] text-slate-900 shadow-sm ring-2 ring-[#FF6A1A]/30'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[8px] uppercase">
                                            Save 17%
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-600">Yearly</span>
                                        <div className="font-display font-black text-sm sm:text-base text-slate-900">
                                            ₹{currentSportConfig.yearly}
                                        </div>
                                        <span className="text-[10px] text-slate-500">Annual Pass</span>
                                    </button>
                                </div>
                            </div>

                            {/* Fee Calculation Summary Box */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                                <div className="flex justify-between text-slate-600">
                                    <span>Selected Sport & Mentor:</span>
                                    <strong className="text-slate-900">{formData.sport} ({formData.coach})</strong>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Total {formData.planType} Academy Fee:</span>
                                    <strong className="text-[#FF6A1A] font-bold text-sm">₹{totalFee.toLocaleString()}</strong>
                                </div>
                                <p className="text-[11px] text-slate-400 pt-1">
                                    * Fees can be paid now via UPI or upon arrival at academy entrance.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6A1A] via-orange-500 to-amber-500 hover:opacity-95 text-white font-display font-bold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-transform active:scale-98"
                        >
                            <span>Complete Athlete Registration</span>
                            <FiArrowRight />
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default AthleteEnroll;
