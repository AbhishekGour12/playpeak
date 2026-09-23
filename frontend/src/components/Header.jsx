// components/Header.jsx - PlayPeak Sports Academy Fully Responsive Navigation & Mobile Sidebar Drawer
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    FiSearch,
    FiMenu,
    FiX,
    FiUser,
    FiLogOut,
    FiLayers,
    FiCheckCircle,
    FiChevronDown,
    FiSmartphone,
    FiPhone,
    FiHome,
    FiInfo,
    FiActivity,
    FiMapPin,
    FiAward,
    FiImage,
    FiCalendar,
    FiMail
} from 'react-icons/fi';
import { FaWhatsapp, FaQrcode } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { userinfo } from '../features/userinfo';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallModal, setShowInstallModal] = useState(false);

    const user = useSelector((state) => state.user?.value) || JSON.parse(localStorage.getItem('libraryUser') || 'null');
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Catch PWA install prompt
    useEffect(() => {
        if (window.deferredPWAInstallPrompt) {
            setDeferredPrompt(window.deferredPWAInstallPrompt);
        }
        const handlePrompt = (e) => {
            e.preventDefault();
            window.deferredPWAInstallPrompt = e;
            setDeferredPrompt(e);
        };
        const handlePromptReady = () => {
            setDeferredPrompt(window.deferredPWAInstallPrompt);
        };
        window.addEventListener('beforeinstallprompt', handlePrompt);
        window.addEventListener('pwa-prompt-ready', handlePromptReady);
        return () => {
            window.removeEventListener('beforeinstallprompt', handlePrompt);
            window.removeEventListener('pwa-prompt-ready', handlePromptReady);
        };
    }, []);

    const handleInstallApp = () => {
        const promptEvent = deferredPrompt || window.deferredPWAInstallPrompt;
        if (promptEvent) {
            promptEvent.prompt();
            promptEvent.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('PlayPeak App installed on Home Screen');
                }
                window.deferredPWAInstallPrompt = null;
                setDeferredPrompt(null);
            });
        } else {
            setShowInstallModal(true);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: <FiHome /> },
        { name: 'About', path: '/about', icon: <FiInfo /> },
        { name: 'Programs', path: '/services', icon: <FiActivity /> },
        { name: 'Facilities', path: '/facilities', icon: <FiMapPin /> },
        { name: 'Coaches', path: '/about#coaches', icon: <FiAward /> },
        { name: 'Gallery', path: '/gallery', icon: <FiImage /> },
        { name: 'Memberships', path: '/membership', icon: <FiAward /> },
        { name: 'Contact', path: '/contact', icon: <FiMail /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('libraryUser');
        dispatch(userinfo(null));
        navigate('/login');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/facilities?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setIsMenuOpen(false);
        }
    };

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsUserDropdownOpen(false);
    }, [location.pathname]);

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 text-slate-800 transition-all shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        
                        {/* Left: Brand Logo & Tagline */}
                        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-sm transition-transform group-hover:scale-105">
                                    <circle cx="50" cy="22" r="12" fill="#FF6A1A" />
                                    <path d="M48 38 L30 54 L38 68 L48 56 L62 78 L78 74 L60 48 L62 38 Z" fill="#FF6A1A" />
                                    <path d="M30 40 L18 52 L26 60 L36 48 Z" fill="#3B82F6" />
                                    <path d="M62 48 L76 34 L84 42 L68 56 Z" fill="#3B82F6" />
                                </svg>
                            </div>
                            <div className="leading-tight">
                                <div className="flex items-baseline">
                                    <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                                        Play<span className="text-[#FF6A1A]">Peak</span>
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] block -mt-0.5">
                                    SPORTS ACADEMY
                                </span>
                            </div>
                        </Link>

                        {/* Center: Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`text-[13px] xl:text-[14px] font-semibold transition-colors hover:text-[#FF6A1A] relative py-1 ${
                                            isActive
                                                ? 'text-[#FF6A1A] font-bold'
                                                : 'text-slate-600'
                                        }`}
                                    >
                                        <span>{link.name}</span>
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6A1A] rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right: Utilities, App Install & Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            
                            {/* Search Icon / Bar (Desktop & Tablet) */}
                            <div className="relative">
                                {isSearchOpen ? (
                                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Search sports, drills..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-36 sm:w-48 pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-300 text-slate-800 rounded-full focus:outline-none focus:ring-1 focus:ring-[#FF6A1A]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsSearchOpen(false)}
                                            className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs"
                                        >
                                            <FiX />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="p-2 text-slate-600 hover:text-[#FF6A1A] hover:bg-slate-50 rounded-full transition-colors"
                                        title="Search Academy"
                                        aria-label="Search"
                                    >
                                        <FiSearch className="text-lg" />
                                    </button>
                                )}
                            </div>

                            {/* Install App Button (Visible on all screens) */}
                            <button
                                onClick={handleInstallApp}
                                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-all shadow-sm"
                                title="Install PlayPeak App on your device"
                            >
                                <FiSmartphone className="text-sm text-emerald-600 animate-bounce" />
                                <span>Install App</span>
                            </button>

                            {/* Account or Enquire Now Button */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                                    >
                                        <span className="w-7 h-7 rounded-full bg-[#FF6A1A] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                            {user.name?.charAt(0).toUpperCase() || 'A'}
                                        </span>
                                        <span className="hidden sm:inline max-w-[85px] truncate font-bold">{user.name}</span>
                                        <FiChevronDown className="text-xs text-slate-500" />
                                    </button>

                                    <AnimatePresence>
                                        {isUserDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs"
                                            >
                                                <div className="p-2.5 border-b border-slate-100">
                                                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                                        <span>{user.name}</span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-50 text-[#FF6A1A] font-bold">
                                                            {user.role === 'admin' ? 'Coach' : 'Athlete'}
                                                        </span>
                                                    </p>
                                                    <p className="text-slate-500 truncate text-[11px] mt-0.5">{user.email}</p>
                                                </div>

                                                <div className="py-1">
                                                    <Link
                                                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#FF6A1A] font-medium transition-colors"
                                                    >
                                                        <FiLayers /> {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                                                    </Link>
                                                    <Link
                                                        to="/qr-checkin"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#FF6A1A] font-medium transition-colors"
                                                    >
                                                        <FiCheckCircle /> QR Gate Access
                                                    </Link>
                                                </div>

                                                <div className="pt-1 border-t border-slate-100">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold text-left transition-colors"
                                                    >
                                                        <FiLogOut /> Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/enroll"
                                    className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    Enroll Now
                                </Link>
                            )}

                            {/* Mobile Hamburger / Sidebar Toggle Button */}
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:text-[#FF6A1A] hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6A1A]/30"
                                aria-label="Open Navigation Menu"
                            >
                                <FiMenu className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* FULL MOBILE SIDEBAR DRAWER (Sliding Navigation Menu) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />

                        {/* Sidebar Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
                        >
                            {/* Drawer Header */}
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 100 100" className="w-8 h-8">
                                            <circle cx="50" cy="22" r="12" fill="#FF6A1A" />
                                            <path d="M48 38 L30 54 L38 68 L48 56 L62 78 L78 74 L60 48 L62 38 Z" fill="#FF6A1A" />
                                            <path d="M30 40 L18 52 L26 60 L36 48 Z" fill="#3B82F6" />
                                            <path d="M62 48 L76 34 L84 42 L68 56 Z" fill="#3B82F6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                                            Play<span className="text-[#FF6A1A]">Peak</span>
                                        </span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block -mt-0.5">
                                            SPORTS ACADEMY
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                                    aria-label="Close Navigation Menu"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            {/* User Profile Card inside Mobile Drawer if logged in */}
                            {user ? (
                                <div className="p-4 mx-4 mt-4 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#FF6A1A] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                            {user.name?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                                            <p className="text-[11px] text-[#FF6A1A] font-semibold">
                                                {user.role === 'admin' ? 'Academy Coach' : 'Registered Athlete'}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 rounded-xl bg-white shadow-sm text-slate-700 hover:text-[#FF6A1A] text-xs font-bold"
                                        title="Go to Dashboard"
                                    >
                                        <FiLayers className="text-base" />
                                    </Link>
                                </div>
                            ) : null}

                            {/* Mobile Search Input */}
                            <div className="px-4 pt-3 pb-1">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search sports, programs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 rounded-xl border border-transparent focus:border-[#FF6A1A] focus:bg-white focus:outline-none transition-all"
                                    />
                                    <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                                </form>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 px-4 py-3 space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">
                                    Navigation
                                </p>
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                isActive
                                                    ? 'bg-[#FF6A1A] text-white shadow-md shadow-orange-500/20'
                                                    : 'text-slate-700 hover:bg-orange-50 hover:text-[#FF6A1A]'
                                            }`}
                                        >
                                            <span className="text-base">{link.icon}</span>
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}

                                {user && (
                                    <>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-3 pb-1">
                                            Quick Actions
                                        </p>
                                        <Link
                                            to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#FF6A1A] transition-all"
                                        >
                                            <FiLayers className="text-base" />
                                            <span>{user.role === 'admin' ? 'Admin Command Center' : 'Athlete Dashboard'}</span>
                                        </Link>
                                        <Link
                                            to="/qr-checkin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#FF6A1A] transition-all"
                                        >
                                            <FaQrcode className="text-base" />
                                            <span>QR Gate Check-In</span>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Drawer Bottom Actions */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                                
                                {/* Install App Trigger in Drawer */}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleInstallApp();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs shadow-sm transition-all"
                                >
                                    <FiSmartphone className="text-base text-emerald-600" />
                                    <span>Download / Install Mobile App</span>
                                </button>

                                <Link
                                    to="/enroll"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center py-2.5 bg-[#FF6A1A] hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                                >
                                    Enroll New Athlete
                                </Link>

                                {!user ? (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center py-2 text-slate-600 hover:text-slate-900 rounded-xl font-semibold text-xs border border-slate-200 bg-white"
                                    >
                                        Sign In
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-xs transition-colors"
                                    >
                                        <FiLogOut /> Sign Out
                                    </button>
                                )}

                                <div className="pt-2 text-center text-[10px] text-slate-400">
                                    <span>PlayPeak Sports Academy • 24/7 Training</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PWA INSTALL / DOWNLOAD APP INSTRUCTIONS MODAL */}
            <AnimatePresence>
                {showInstallModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 text-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-800 p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6A1A] to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                        <FiSmartphone className="text-xl text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-extrabold text-base text-white">
                                            Install PlayPeak Mobile App
                                        </h3>
                                        <p className="text-slate-400 text-xs">Direct Offline Access & Fast Check-In</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowInstallModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <div className="space-y-2.5 text-xs">
                                <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 space-y-1">
                                    <div className="font-bold text-emerald-400 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">1</span>
                                        On Android Phone (Chrome / Brave)
                                    </div>
                                    <p className="text-slate-300 text-[11px] pl-7 leading-relaxed">
                                        Tap the <strong>three dots menu (⋮)</strong> in your browser top-right & select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-blue-500/30 space-y-1">
                                    <div className="font-bold text-blue-400 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">2</span>
                                        On iPhone / iPad (Safari)
                                    </div>
                                    <p className="text-slate-300 text-[11px] pl-7 leading-relaxed">
                                        Tap the <strong>Share icon (⎋)</strong> at the bottom bar & scroll down to tap <strong>"Add to Home Screen"</strong>.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-purple-500/30 space-y-1">
                                    <div className="font-bold text-purple-400 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">3</span>
                                        On Desktop (Chrome, Edge, Brave)
                                    </div>
                                    <p className="text-slate-300 text-[11px] pl-7 leading-relaxed">
                                        Click the <strong>Install icon (⊞)</strong> in the URL address bar at the top right.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-2.5">
                                <button
                                    onClick={() => {
                                        if (deferredPrompt) {
                                            deferredPrompt.prompt();
                                        }
                                        setShowInstallModal(false);
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all"
                                >
                                    Install PlayPeak Now
                                </button>
                                <button
                                    onClick={() => setShowInstallModal(false)}
                                    className="py-3 px-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;