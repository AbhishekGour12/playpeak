// pages/Contact.jsx - PlayPeak Sports Academy Contact & Enquiries
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiArrowRight,
  FiCheckCircle,
  FiPlus,
  FiMinus
} from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter } from 'react-icons/fa';

import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phoneNumber: '',
    sportPreference: 'Football Academy',
    ageCategory: 'Under 14 (U-14)',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';
    const leadPayload = {
      name: formData.studentName || formData.parentName,
      phone: formData.phoneNumber,
      email: formData.email,
      sport: formData.sportPreference,
      planInterested: formData.ageCategory,
      message: formData.message || `Parent: ${formData.parentName}`,
      status: 'New',
      date: new Date().toISOString().split('T')[0]
    };

    // Post to MongoDB Atlas API
    axios.post(`${API_BASE}inquiries`, leadPayload)
      .then(() => {
        // Also save to localStorage for offline cache
        try {
          const existing = JSON.parse(localStorage.getItem('playpeak_inquiries') || '[]');
          localStorage.setItem('playpeak_inquiries', JSON.stringify([leadPayload, ...existing]));
        } catch (err) {}
      })
      .catch((err) => console.warn('Inquiry API note:', err.message));

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        studentName: '',
        parentName: '',
        email: '',
        phoneNumber: '',
        sportPreference: 'Football Academy',
        ageCategory: 'Under 14 (U-14)',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 6000);
    }, 700);
  };

  const faqs = [
    {
      q: "How do I book a Free Trial Training Session?",
      a: "Fill out the enquiry form on this page with your preferred sport and age group. Our admissions desk will call or WhatsApp you to schedule a convenient time slot with our coach."
    },
    {
      q: "What age groups does PlayPeak cater to?",
      a: "We have structured programs starting from age 5 (Grassroots Foundation) all the way to U-10, U-14, U-18, and Senior Competitive batches."
    },
    {
      q: "What gear is required for the first training session?",
      a: "For football, molded turf shoes or football studs. For cricket, whites and basic batting pads (academy spares available). For badminton/tennis/basketball, non-marking sports shoes. For swimming, swim cap and goggles."
    },
    {
      q: "Are parents allowed to watch the training sessions?",
      a: "Yes! We have dedicated covered spectator stands and parent lounges overlooking all fields, courts, and pools."
    }
  ];

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
              GET IN TOUCH
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Enquire & Book <span className="text-[#FF6A1A]">Free Trial</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Take the first step towards a healthier, stronger and brighter future. Our coaching coordinators are here to guide you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Left Column: Academy Campus Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-2xl text-slate-900">
                Academy Campus Info
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-lg shrink-0">
                    <FiMapPin />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-display">Campus Location:</strong>
                    <span>PlayPeak Sports Arena, Olympic Complex Road, Vijay Nagar, Indore, MP - 452010</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-lg shrink-0">
                    <FiPhone />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-display">Direct Phone & WhatsApp:</strong>
                    <span>+91 98765 43210 / +91 98765 43211</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-lg shrink-0">
                    <FiMail />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-display">Admissions & Enquiries:</strong>
                    <span>info@playpeaksports.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-lg shrink-0">
                    <FiClock />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-display">Operating Hours:</strong>
                    <span>Mon - Sun: 06:00 AM - 10:00 PM (All 6 Sports Arenas)</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 block mb-3 uppercase tracking-wider">
                  Follow PlayPeak Academy
                </span>
                <div className="flex gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-colors">
                    <FaInstagram />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-colors">
                    <FaYoutube />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-colors">
                    <FaFacebook />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-colors">
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>

            {/* Photo Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md relative group">
              <img src="/images/playpeak/coach-guiding-kids.jpg" alt="PlayPeak Coach" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent p-5 flex flex-col justify-end text-white">
                <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">GUIDING YOUNG TALENT</span>
                <h4 className="font-display font-bold text-white text-base">Nurturing Champions On & Off The Field</h4>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry / Free Trial Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">
                COMPLIMENTARY SESSION
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
                Book Your Free Trial Session
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Experience our professional coaching drills and modern facilities with zero obligation.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6A1A] flex items-center justify-center mx-auto text-3xl shadow-sm">
                  <FiCheckCircle />
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900">Enquiry Received!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, {formData.studentName || 'Athlete'}. Our coaching coordinator will call or WhatsApp you shortly to confirm your free trial schedule.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Student / Athlete Name</label>
                    <input
                      type="text"
                      required
                      name="studentName"
                      placeholder="e.g. Aryan Sharma"
                      value={formData.studentName}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      required
                      name="parentName"
                      placeholder="e.g. Priya Sharma"
                      value={formData.parentName}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      name="phoneNumber"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="e.g. parent@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Sport Program Preference</label>
                    <select
                      name="sportPreference"
                      value={formData.sportPreference}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#FF6A1A]"
                    >
                      <option value="Football Academy">Football Academy</option>
                      <option value="Cricket Coaching">Cricket Coaching</option>
                      <option value="Badminton Training">Badminton Training</option>
                      <option value="Basketball Academy">Basketball Academy</option>
                      <option value="Tennis Development">Tennis Development</option>
                      <option value="Swimming Program">Swimming Program</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Age Category</label>
                    <select
                      name="ageCategory"
                      value={formData.ageCategory}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#FF6A1A]"
                    >
                      <option value="Grassroots (5 - 8 yrs)">Grassroots (5 - 8 yrs)</option>
                      <option value="Under 10 (U-10)">Under 10 (U-10)</option>
                      <option value="Under 14 (U-14)">Under 14 (U-14)</option>
                      <option value="Under 18 (U-18)">Under 18 (U-18)</option>
                      <option value="Senior / Adult">Senior / Adult</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Any Specific Goals or Questions (Optional)</label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="Tell us about the athlete's previous playing experience, fitness goals, or preferred schedule..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  {isSubmitting ? 'Submitting Enquiry...' : 'Book Free Trial Session'}
                  <FiArrowRight />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQs */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Common questions answered for parents and student athletes.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 cursor-pointer transition-all hover:border-[#FF6A1A]"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                  <span>{faq.q}</span>
                  {openFaq === idx ? <FiMinus className="text-[#FF6A1A]" /> : <FiPlus className="text-slate-400" />}
                </div>

                {openFaq === idx && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Contact;
