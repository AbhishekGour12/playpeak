// pages/Payments.jsx - PlayPeak Sports Academy Passes & Memberships Hub
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiCheckCircle, 
    FiArrowRight, 
    FiShield, 
    FiX, 
    FiClock, 
    FiCheck, 
    FiDownload,
    FiAward,
    FiPrinter,
    FiCopy,
    FiExternalLink
} from 'react-icons/fi';
import { FaFutbol, FaTrophy, FaRunning, FaQrcode } from 'react-icons/fa';
import { GiCricketBat, GiWhistle, GiLaurelCrown } from 'react-icons/gi';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { useSelector } from 'react-redux';

const Payments = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, quarterly, annual
    const [selectedShift, setSelectedShift] = useState('evening'); // morning, evening, weekend, all-access
    const [selectedAddons, setSelectedAddons] = useState({ locker: false, nutrition: false, privateCoach: false });
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // QR Plan Modal state
    const [showPlanQrModal, setShowPlanQrModal] = useState(false);
    const [selectedQrPlan, setSelectedQrPlan] = useState(null);
    const [planQrDataUrl, setPlanQrDataUrl] = useState('');
    const [toastMessage, setToastMessage] = useState(null);

    const user = useSelector((state) => state.user?.value) || JSON.parse(localStorage.getItem('libraryUser') || '{}');

    const cycleMultipliers = {
        monthly: { mult: 1, label: '/month', discount: 0, tag: 'Standard' },
        quarterly: { mult: 2.7, label: '/3 months', discount: 10, tag: 'Save 10%' },
        annual: { mult: 9.6, label: '/year', discount: 20, tag: 'Best Value - Save 20%' }
    };

    const membershipPlans = [
        { 
            id: 'rookie',
            name: 'Grassroots Sports Pass', 
            basePrice: 1499, 
            popular: false,
            badge: 'Beginner',
            desc: 'Foundational training drills and weekly weekend practice games for young athletes.',
            features: [
                'Access to chosen Primary Sport Academy program',
                '3 coached training sessions per week (1.5 hrs each)',
                'Automated QR Gate Attendance & Locker Room Access',
                'Academy Training Jersey & Kit Bag included',
                'Quarterly skill progress report card from head coach'
            ]
        },
        { 
            id: 'champion',
            name: 'Champion All-Access Pass', 
            basePrice: 2999, 
            popular: true,
            badge: 'Most Popular',
            desc: 'Comprehensive multi-sport training with dedicated coach mentorship and tournament entry.',
            features: [
                'Access to Primary Sport + 1 Secondary Sport program',
                '5 coached training sessions per week with video drills',
                'Unlimited access to practice nets & swimming pool',
                'Guaranteed participation in District & State Youth Leagues',
                'Dedicated equipment locker & nutrition hydration pack',
                'Bi-monthly parent-coach strategy review session'
            ]
        },
        { 
            id: 'elite-gold',
            name: 'Elite Gold Athlete Card', 
            basePrice: 4999, 
            popular: false,
            badge: 'VIP Pro Tier',
            desc: 'Unlimited all-sport training, 1-on-1 private coaching, and national tournament scouting.',
            features: [
                'Unlimited 7-day access to all 6 sports disciplines & facilities',
                'Weekly 1-on-1 private technical coaching session (1 hr)',
                'Priority court/pitch reservation and personal gear locker',
                'Custom PlayPeak Official Championship Match Kit & Tracksuit',
                'Direct talent scouting trials for state & national teams',
                'Sports physiotherapist consult & recovery sessions'
            ]
        }
    ];

    const trainingShifts = [
        { id: 'morning', name: 'Morning Batches', time: '06:00 AM - 08:30 AM', desc: 'Focus & conditioning before school' },
        { id: 'evening', name: 'Evening Batches', time: '04:30 PM - 07:30 PM', desc: 'Prime training & tactical scrims' },
        { id: 'weekend', name: 'Weekend Intensive', time: 'Sat & Sun Batches', desc: 'High-intensity weekend drills' },
        { id: 'all-access', name: 'Flexible All-Shift', time: 'Anytime Access', desc: 'Attend any scheduled batch' }
    ];

    const calculatePrice = (plan) => {
        if (!plan) return 0;
        const multiplier = cycleMultipliers[billingCycle].mult;
        let price = Math.round(plan.basePrice * multiplier);

        if (selectedAddons.locker) price += billingCycle === 'monthly' ? 300 : billingCycle === 'quarterly' ? 800 : 2500;
        if (selectedAddons.nutrition) price += billingCycle === 'monthly' ? 600 : billingCycle === 'quarterly' ? 1600 : 5000;
        if (selectedAddons.privateCoach) price += billingCycle === 'monthly' ? 1200 : billingCycle === 'quarterly' ? 3200 : 10000;

        return price;
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const openPlanQrModal = (plan) => {
        setSelectedQrPlan(plan);
        const planUrl = `https://playpeak.vercel.app/enroll?plan=${encodeURIComponent(plan.name)}`;
        QRCode.toDataURL(planUrl, { width: 320, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
            .then(url => {
                setPlanQrDataUrl(url);
                setShowPlanQrModal(true);
            })
            .catch(() => {
                setShowPlanQrModal(true);
            });
    };

    const downloadPlanQrImage = () => {
        if (!planQrDataUrl || !selectedQrPlan) return;
        const link = document.createElement('a');
        link.href = planQrDataUrl;
        link.download = `PlayPeak_${selectedQrPlan.name.replace(/\s+/g, '_')}_QR.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Membership QR PNG image downloaded!');
    };

    const downloadPlanQrPdf = () => {
        if (!selectedQrPlan) return;
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
            doc.text("OFFICIAL MEMBERSHIP ENROLLMENT PASS", 105, 32, { align: "center" });

            // Card Box
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, 58, 170, 200, 4, 4, 'FD');

            doc.setFontSize(18);
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text(selectedQrPlan.name.toUpperCase(), 105, 75, { align: "center" });

            doc.setFontSize(11);
            doc.setTextColor(255, 106, 26);
            doc.text(`Starting at ₹${selectedQrPlan.basePrice.toLocaleString()}/mo • All Facilities Included`, 105, 83, { align: "center" });

            // QR Code
            if (planQrDataUrl) {
                doc.addImage(planQrDataUrl, 'PNG', 65, 92, 80, 80);
            }

            // Plan perks
            let yPos = 182;
            doc.setFontSize(9);
            (selectedQrPlan.features || []).forEach(f => {
                doc.setTextColor(71, 85, 105);
                doc.setFont('helvetica', 'normal');
                doc.text(`• ${f}`, 35, yPos);
                yPos += 7;
            });

            // Instructions
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text("Scan with your phone to instantly claim admission to this membership cohort.", 105, 245, { align: "center" });

            // Footer
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("PlayPeak Sports Arena, Olympic Complex Road | Helpline: +91 98765 43210", 105, 287, { align: "center" });

            doc.save(`PlayPeak_${selectedQrPlan.name.replace(/\s+/g, '_')}_Poster.pdf`);
            showToast('Membership Plan PDF poster downloaded!');
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setIsCheckoutOpen(true);
    };

    const handleProcessPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
            setTimeout(() => {
                setIsCheckoutOpen(false);
                setPaymentSuccess(false);
                generatePDFPass(selectedPlan);
            }, 1600);
        }, 1000);
    };

    const generatePDFPass = (plan) => {
        const doc = new jsPDF();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');

        doc.setFontSize(22);
        doc.setTextColor(255, 106, 26);
        doc.text("PLAYPEAK SPORTS ACADEMY", 20, 30);

        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text("OFFICIAL STUDENT ATHLETE PASS & RECEIPT", 20, 40);

        doc.setDrawColor(255, 106, 26);
        doc.setLineWidth(0.8);
        doc.line(20, 46, 190, 46);

        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        doc.text(`Student Name: ${user.name || 'Student Athlete'}`, 20, 60);
        doc.text(`Student Email: ${user.email || 'athlete@playpeaksports.com'}`, 20, 70);
        doc.text(`Membership Tier: ${plan ? plan.name : 'Champion All-Access Pass'}`, 20, 80);
        doc.text(`Billing Cycle: ${billingCycle.toUpperCase()}`, 20, 90);
        doc.text(`Training Shift: ${selectedShift.toUpperCase()}`, 20, 100);
        doc.text(`Amount Paid: Rs. ${calculatePrice(plan || membershipPlans[1])}`, 20, 110);
        doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, 120);
        doc.text(`Status: Active Pass (Valid for ${billingCycle})`, 20, 130);

        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 145, 170, 45, 4, 4, 'F');
        doc.setTextColor(255, 106, 26);
        doc.setFontSize(12);
        doc.text("DIGITAL QR GATE ACCESS", 30, 160);
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("Present this pass or scan the digital QR pass from your PlayPeak", 30, 170);
        doc.text("portal at the academy reception turnstiles.", 30, 178);

        doc.save(`PlayPeak-Pass-${Date.now()}.pdf`);
    };

    return (
        <div className="bg-white min-h-screen text-slate-800">
            
            {/* Header Banner */}
            <div className="relative bg-[#0A0E17] text-white py-20 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-35"
                    style={{ backgroundImage: `url('/images/playpeak/hero-football.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/95 via-[#070A0F]/80 to-[#070A0F]/40" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A1A]">
                            ACADEMY PASSES & ENROLLMENT
                        </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                        Choose Your <span className="text-[#FF6A1A]">Training Pass</span>
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Transparent membership plans crafted for grassroots beginners, competitive youth athletes, and tournament champions.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Billing Cycle Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200 flex items-center gap-1 shadow-sm">
                        {['monthly', 'quarterly', 'annual'].map((cycle) => (
                            <button
                                key={cycle}
                                onClick={() => setBillingCycle(cycle)}
                                className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all ${
                                    billingCycle === cycle
                                        ? 'bg-[#FF6A1A] text-white shadow-md'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <span className="capitalize">{cycle}</span>
                                {cycleMultipliers[cycle].discount > 0 && (
                                    <span className="ml-1.5 text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">
                                        {cycleMultipliers[cycle].tag}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shift Preference Selector */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-12">
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <FiClock className="text-[#FF6A1A]" /> Choose Preferred Training Shift:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {trainingShifts.map((shift) => (
                            <button
                                key={shift.id}
                                onClick={() => setSelectedShift(shift.id)}
                                className={`p-4 rounded-2xl border text-left transition-all ${
                                    selectedShift === shift.id
                                        ? 'bg-white border-[#FF6A1A] shadow-md text-slate-900'
                                        : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-sm text-slate-900">{shift.name}</span>
                                    {selectedShift === shift.id && <FiCheckCircle className="text-[#FF6A1A]" />}
                                </div>
                                <p className="text-xs font-semibold text-[#FF6A1A]">{shift.time}</p>
                                <p className="text-[11px] text-slate-500 mt-1">{shift.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3 Pricing Plans Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
                    {membershipPlans.map((plan) => {
                        const price = calculatePrice(plan);
                        return (
                            <div
                                key={plan.id}
                                className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                                    plan.popular
                                        ? 'bg-white border-2 border-[#FF6A1A] shadow-xl'
                                        : 'bg-white border border-slate-200 shadow-sm'
                                }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF6A1A] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                                        {plan.badge}
                                    </span>
                                )}

                                <div>
                                    <h3 className="font-display font-extrabold text-2xl text-slate-900">{plan.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{plan.desc}</p>

                                    <div className="my-6">
                                        <span className="font-display font-black text-4xl text-slate-900">₹{price.toLocaleString()}</span>
                                        <span className="text-xs text-slate-500 ml-1 font-semibold">{cycleMultipliers[billingCycle].label}</span>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5">
                                                <FiCheck className="text-[#FF6A1A] shrink-0 mt-0.5 text-sm" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 space-y-2.5">
                                    <button
                                        onClick={() => handleSelectPlan(plan)}
                                        className={`w-full py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-all ${
                                            plan.popular
                                                ? 'bg-[#FF6A1A] hover:bg-[#EA580C] text-white shadow-md hover:scale-[1.02]'
                                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                                        }`}
                                    >
                                        Select {plan.name}
                                    </button>

                                    <button
                                        onClick={() => openPlanQrModal(plan)}
                                        className="w-full py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <FaQrcode className="text-[#FF6A1A]" /> Scan / Download QR Pass
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add-ons Selector */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-16">
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-4">
                        Optional Athlete Add-Ons
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <label className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                            selectedAddons.locker ? 'bg-white border-[#FF6A1A] shadow-sm' : 'bg-white/60 border-slate-200'
                        }`}>
                            <input
                                type="checkbox"
                                checked={selectedAddons.locker}
                                onChange={(e) => setSelectedAddons({ ...selectedAddons, locker: e.target.checked })}
                                className="w-4 h-4 accent-[#FF6A1A]"
                            />
                            <div>
                                <span className="font-bold text-xs text-slate-900 block">Personal Equipment Locker</span>
                                <span className="text-[11px] text-slate-500">+₹300/mo</span>
                            </div>
                        </label>

                        <label className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                            selectedAddons.nutrition ? 'bg-white border-[#FF6A1A] shadow-sm' : 'bg-white/60 border-slate-200'
                        }`}>
                            <input
                                type="checkbox"
                                checked={selectedAddons.nutrition}
                                onChange={(e) => setSelectedAddons({ ...selectedAddons, nutrition: e.target.checked })}
                                className="w-4 h-4 accent-[#FF6A1A]"
                            />
                            <div>
                                <span className="font-bold text-xs text-slate-900 block">Nutrition & Hydration Pack</span>
                                <span className="text-[11px] text-slate-500">+₹600/mo</span>
                            </div>
                        </label>

                        <label className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                            selectedAddons.privateCoach ? 'bg-white border-[#FF6A1A] shadow-sm' : 'bg-white/60 border-slate-200'
                        }`}>
                            <input
                                type="checkbox"
                                checked={selectedAddons.privateCoach}
                                onChange={(e) => setSelectedAddons({ ...selectedAddons, privateCoach: e.target.checked })}
                                className="w-4 h-4 accent-[#FF6A1A]"
                            />
                            <div>
                                <span className="font-bold text-xs text-slate-900 block">1-on-1 Dedicated Coach Drill</span>
                                <span className="text-[11px] text-slate-500">+₹1,200/mo</span>
                            </div>
                        </label>
                    </div>
                </div>

            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {isCheckoutOpen && selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-100"
                        >
                            <button
                                onClick={() => setIsCheckoutOpen(false)}
                                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                            >
                                <FiX />
                            </button>

                            {paymentSuccess ? (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6A1A] flex items-center justify-center mx-auto text-3xl shadow-sm">
                                        <FiCheckCircle />
                                    </div>
                                    <h3 className="font-display font-bold text-2xl text-slate-900">Pass Activated!</h3>
                                    <p className="text-xs text-slate-600">Your PlayPeak Athlete Pass is active. Generating official PDF pass...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">
                                            PASS CHECKOUT & ACTIVATION
                                        </span>
                                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                                            {selectedPlan.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Shift: {selectedShift.toUpperCase()} • {billingCycle.toUpperCase()}
                                        </p>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700 mb-6">
                                        <div className="flex justify-between">
                                            <span>Base Membership:</span>
                                            <strong className="text-slate-900">₹{Math.round(selectedPlan.basePrice * cycleMultipliers[billingCycle].mult).toLocaleString()}</strong>
                                        </div>
                                        {selectedAddons.locker && (
                                            <div className="flex justify-between text-slate-500">
                                                <span>Locker Access:</span>
                                                <span>+₹300</span>
                                            </div>
                                        )}
                                        {selectedAddons.nutrition && (
                                            <div className="flex justify-between text-slate-500">
                                                <span>Nutrition Pack:</span>
                                                <span>+₹600</span>
                                            </div>
                                        )}
                                        {selectedAddons.privateCoach && (
                                            <div className="flex justify-between text-slate-500">
                                                <span>1-on-1 Coaching:</span>
                                                <span>+₹1,200</span>
                                            </div>
                                        )}
                                        <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-[#FF6A1A]">
                                            <span>Total Amount:</span>
                                            <span>₹{calculatePrice(selectedPlan).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Payment Method Selector */}
                                    <div className="space-y-2 mb-6">
                                        <label className="text-xs font-bold text-slate-700">Payment Option</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['upi', 'card', 'netbanking'].map((method) => (
                                                <button
                                                    key={method}
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                                        paymentMethod === method
                                                            ? 'bg-orange-50 text-[#FF6A1A] border border-[#FF6A1A]'
                                                            : 'bg-slate-50 border border-slate-200 text-slate-600'
                                                    }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleProcessPayment}
                                        disabled={isProcessing}
                                        className="w-full py-3.5 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                                    >
                                        {isProcessing ? (
                                            <span>Activating Pass...</span>
                                        ) : (
                                            <>
                                                <span>Pay ₹{calculatePrice(selectedPlan).toLocaleString()} & Get Pass</span>
                                                <FiArrowRight />
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MEMBERSHIP PLAN QR CODE MODAL WITH PNG & PDF DOWNLOAD */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showPlanQrModal && selectedQrPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden text-center p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">MEMBERSHIP QR PASS</span>
                                    <h3 className="font-display font-black text-lg text-slate-900">{selectedQrPlan.name}</h3>
                                </div>
                                <button onClick={() => setShowPlanQrModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                Scan this QR code to enroll in the <strong>{selectedQrPlan.name}</strong> at PlayPeak Sports Academy.
                            </p>

                            <div className="bg-slate-950 p-4 rounded-3xl inline-block shadow-xl">
                                {planQrDataUrl ? (
                                    <img src={planQrDataUrl} alt="Plan QR Code" className="w-48 h-48 mx-auto rounded-xl bg-white p-2" />
                                ) : (
                                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                                        <FaQrcode className="text-7xl text-slate-900" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2.5 pt-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={downloadPlanQrImage}
                                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                    >
                                        <FiDownload /> Download PNG
                                    </button>
                                    <button
                                        onClick={downloadPlanQrPdf}
                                        className="py-2.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
                                    >
                                        <FiPrinter /> Download PDF
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/enroll?plan=${encodeURIComponent(selectedQrPlan.name)}`;
                                        navigator.clipboard.writeText(url);
                                        showToast('Plan enrollment link copied to clipboard!');
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

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex items-center gap-3 text-xs font-bold"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-ping" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Payments;