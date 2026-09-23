// components/Footer.jsx - PlayPeak Sports Academy Footer
import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 100 100" className="w-9 h-9">
                                    <circle cx="50" cy="22" r="12" fill="#FF6A1A" />
                                    <path d="M48 38 L30 54 L38 68 L48 56 L62 78 L78 74 L60 48 L62 38 Z" fill="#FF6A1A" />
                                    <path d="M30 40 L18 52 L26 60 L36 48 Z" fill="#3B82F6" />
                                    <path d="M62 48 L76 34 L84 42 L68 56 Z" fill="#3B82F6" />
                                </svg>
                            </div>
                            <div className="leading-tight">
                                <span className="font-display font-extrabold text-2xl text-white tracking-tight">
                                    Play<span className="text-[#FF6A1A]">Peak</span>
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] block">
                                    SPORTS ACADEMY
                                </span>
                            </div>
                        </Link>

                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                            Nurturing future champions through world-class training programs, certified coaches, and state-of-the-art facilities across multiple disciplines.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF6A1A] transition-colors">
                                <FaInstagram />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF6A1A] transition-colors">
                                <FaFacebook />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF6A1A] transition-colors">
                                <FaYoutube />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF6A1A] transition-colors">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>

                    {/* Sports Programs */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Programs</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Football Academy</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Cricket Coaching</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Badminton Training</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Basketball Academy</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Tennis Development</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Swimming Program</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><Link to="/about" className="hover:text-[#FF6A1A] transition-colors">About PlayPeak</Link></li>
                            <li><Link to="/facilities" className="hover:text-[#FF6A1A] transition-colors">World-Class Facilities</Link></li>
                            <li><Link to="/membership" className="hover:text-[#FF6A1A] transition-colors">Membership & Pricing</Link></li>
                            <li><Link to="/enroll" className="hover:text-[#FF6A1A] transition-colors font-semibold text-orange-400">Athlete Self-Enroll (QR)</Link></li>
                            <li><Link to="/about" className="hover:text-[#FF6A1A] transition-colors">Expert Coaches</Link></li>
                            <li><Link to="/gallery" className="hover:text-[#FF6A1A] transition-colors">Academy Gallery</Link></li>
                            <li><Link to="/admin" className="hover:text-[#FF6A1A] transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A]" /> Admin Portal</Link></li>
                            <li><Link to="/contact" className="hover:text-[#FF6A1A] transition-colors">Book Free Trial</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Academy Location */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Us</h4>
                        <div className="space-y-2.5 text-xs text-slate-400">
                            <p className="flex items-start gap-2.5">
                                <FiMapPin className="text-[#FF6A1A] shrink-0 mt-0.5" />
                                <span>PlayPeak Sports Arena, Olympic Complex Road, Indore, MP</span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <FiPhone className="text-[#FF6A1A] shrink-0" />
                                <span>+91 98765 43210</span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <FiMail className="text-[#FF6A1A] shrink-0" />
                                <span>info@playpeaksports.com</span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <FiClock className="text-[#FF6A1A] shrink-0" />
                                <span>Mon - Sun: 06:00 AM - 10:00 PM</span>
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Rights */}
                <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} PlayPeak Sports Academy. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/membership" className="hover:text-slate-300">Membership Fees</Link>
                        <Link to="/admin" className="hover:text-[#FF6A1A] font-semibold">Staff & Admin Login</Link>
                        <Link to="/contact" className="hover:text-slate-400">Privacy Policy</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;