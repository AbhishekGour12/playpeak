import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Catalog from './pages/Catalog';
import BookDetail from './pages/BookDetail';
import QRCheckIn from './pages/QRCheckIn';
import Payments from './pages/Payments';
import AthleteEnroll from './pages/AthleteEnroll';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { userinfo } from './features/userinfo';
import { attendanceinfo } from './features/attendance';

import { useLocation } from 'react-router-dom';

function AppContent({ user, ProtectedRoute }) {
  const location = useLocation();
  const isAuthOrAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/enroll');

  return (
    <div className="App min-h-screen text-slate-800 flex flex-col selection:bg-[#FF6A1A] selection:text-white bg-white">
      {!isAuthOrAdmin && <Header />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/membership" element={<Payments />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/facilities" element={<Catalog />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/enroll" element={<AthleteEnroll />} />
            <Route path="/register-athlete" element={<AthleteEnroll />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/qr-checkin" element={
              <ProtectedRoute>
                <QRCheckIn />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAuthOrAdmin && <Footer />}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user.value);
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("libraryUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && (!user || user._id !== parsed._id)) {
          dispatch(userinfo(parsed));
        }
      } catch (e) {}
    }

    if (token && token !== 'playpeak-demo-token') {
      const getUser = async () => {
        try {
          const result = await axios.get(`${url}users/profile/${token}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
          if (result && result.data) {
            dispatch(userinfo(result.data));
          }

          const result1 = await axios.get(`${url}attendance/live`);
          if (result1.data && result1.data.success) {
            dispatch(attendanceinfo(result1.data.data));
          }
        } catch (err) {
          console.warn("Backend auth background sync:", err.message);
        }
      };
      getUser();
    }
  }, [dispatch, url]);

  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center h-screen bg-[#070A0F] text-white">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-volt-500/20 border-t-volt-500 animate-spin"></div>
        <div className="absolute w-8 h-8 rounded-full bg-volt-500/20 blur-md"></div>
        <span className="absolute font-tech text-[10px] text-volt-400 font-bold">APEX</span>
      </div>
      <p className="mt-4 text-xs font-bold tracking-widest uppercase text-volt-400/90 animate-pulse">
        Initializing APEX Arena...
      </p>
    </div>
  );

  // Protected Route component with resilient session recovery
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    let activeUser = user;
    if (!activeUser) {
      try {
        const saved = localStorage.getItem('libraryUser');
        if (saved) activeUser = JSON.parse(saved);
      } catch (e) {}
    }

    if (!activeUser) {
      return (
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="glass-card p-8 rounded-2xl text-center max-w-md border border-volt-500/30 shadow-glow-volt">
            <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-display">Athlete Gate Restricted</h2>
            <p className="text-slate-400 mb-6 text-sm">Please authenticate with your Athlete or Coach credentials to access this arena sector.</p>
            <a
              href="/login"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-volt-500 to-cyber-500 text-[#080C14] font-bold rounded-xl hover:shadow-glow-volt transition-all"
            >
              Sign In To Arena
            </a>
          </div>
        </div>
      );
    }

    if (adminOnly && activeUser.role !== 'admin') {
      return (
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="glass-card p-8 rounded-2xl text-center max-w-md border border-amber-500/30 shadow-glow-amber">
            <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-display">Coach Command Required</h2>
            <p className="text-slate-400 mb-6 text-sm">You need Head Coach or Academy Admin privileges to enter this console.</p>
            <a
              href="/dashboard"
              className="inline-block px-6 py-2.5 bg-slate-800 text-volt-400 border border-volt-500/30 font-bold rounded-xl hover:bg-slate-700 transition-all"
            >
              Go to Athlete Portal
            </a>
          </div>
        </div>
      );
    }

    return children;
  };

  // Initial loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <Router>
        <AppContent user={user} ProtectedRoute={ProtectedRoute} />
      </Router>
    </AuthProvider>
  );
}

export default App;