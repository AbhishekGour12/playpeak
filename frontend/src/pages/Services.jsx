// pages/Services.jsx - PlayPeak Sports Academy Programs & Facilities
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiChevronRight,
  FiCheckCircle,
  FiX,
  FiInfo,
  FiCalendar,
  FiClock,
  FiUsers,
  FiAward
} from 'react-icons/fi';
import { FaFutbol, FaBasketballBall, FaSwimmer, FaTrophy, FaRunning } from 'react-icons/fa';
import { GiCricketBat, GiShuttlecock, GiTennisRacket, GiWhistle, GiLaurelCrown } from 'react-icons/gi';
import { MdOutlineStadium, MdSportsSoccer, MdFitnessCenter } from 'react-icons/md';

const Services = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const sportsPrograms = [
    {
      id: 'football',
      category: 'Field Sports',
      title: 'Football Academy',
      subtitle: 'Discipline | Teamwork | Match IQ',
      ageGroup: 'Ages 6 - 19 yrs',
      schedule: 'Mon, Wed, Fri (4:30 PM - 7:00 PM)',
      coach: 'Coach Rajesh Sharma (AFC Pro)',
      image: '/images/playpeak/prog-football.jpg',
      icon: <FaFutbol className="text-[#FF6A1A] text-xl" />,
      tag: 'FIFA Standard Turf',
      overview: 'Structured European methodology focusing on ball mastery, tactical positioning, high-intensity pressing, and match simulation.',
      curriculum: [
        'Fundamental footwork, ball control, and directional dribbling',
        'Passing geometry, 1v1 attacking & defending drills',
        'Position-specific tactical development and set-pieces',
        'Competitive weekend league games & video analysis'
      ]
    },
    {
      id: 'cricket',
      category: 'Bat & Ball',
      title: 'Cricket Coaching',
      subtitle: 'Focus | Strategy | Technical Form',
      ageGroup: 'Ages 7 - 20 yrs',
      schedule: 'Tue, Thu, Sat (4:00 PM - 6:30 PM)',
      coach: 'Coach Vikram Singh (BCCI Certified)',
      image: '/images/playpeak/prog-cricket.jpg',
      icon: <GiCricketBat className="text-[#FF6A1A] text-xl" />,
      tag: 'Pro Turf Nets',
      overview: 'Comprehensive cricket coaching under certified Ranji-level mentors with turf wickets, automated bowling machines, and video biomechanics.',
      curriculum: [
        'Batting stance, backlift, shot execution & power hitting',
        'Pace and spin bowling techniques with speed radar analysis',
        'Wicketkeeping agility, slip catching & outfield drills',
        'Ranji Trophy & BCCI age-group tournament trials prep'
      ]
    },
    {
      id: 'badminton',
      category: 'Racquet Sports',
      title: 'Badminton Training',
      subtitle: 'Speed | Agility | Precision',
      ageGroup: 'Ages 6 - 18 yrs',
      schedule: 'Daily Batches (Morning & Evening)',
      coach: 'Coach Ananya Sen (National Champion)',
      image: '/images/playpeak/prog-badminton.jpg',
      icon: <GiShuttlecock className="text-[#FF6A1A] text-xl" />,
      tag: 'Synthetic Hardwood',
      overview: 'High-energy badminton coaching on international standard synthetic courts with multi-shuttle feeding and footwork conditioning.',
      curriculum: [
        'Six-corner court coverage & explosive split-step footwork',
        'Smash power generation, net tumble drops & deceptive clears',
        'Singles & doubles match strategy and psychological endurance',
        'State and National ranking tournament preparation'
      ]
    },
    {
      id: 'basketball',
      category: 'Court Sports',
      title: 'Basketball Academy',
      subtitle: 'Strength | Confidence | Court Vision',
      ageGroup: 'Ages 8 - 19 yrs',
      schedule: 'Mon, Wed, Fri, Sat (5:00 PM - 7:30 PM)',
      coach: 'Coach Rahul Nair (FIBA Level-2)',
      image: '/images/playpeak/prog-basketball.jpg',
      icon: <FaBasketballBall className="text-[#FF6A1A] text-xl" />,
      tag: 'NBA Sprung Court',
      overview: 'Modern fast-paced basketball training focusing on dynamic handles, shot mechanics, pick-and-roll IQ, and vertical leap training.',
      curriculum: [
        'Two-ball dribbling drills & high-pressure ball control',
        'Catch-and-shoot mechanics and free-throw consistency',
        'Man-to-man defensive slides and transition offense',
        'Inter-school & national youth championship league play'
      ]
    },
    {
      id: 'tennis',
      category: 'Racquet Sports',
      title: 'Tennis Development',
      subtitle: 'Precision | Patience | Power',
      ageGroup: 'Ages 6 - 18 yrs',
      schedule: 'Tue, Thu, Sat, Sun (6:30 AM - 9:00 AM)',
      coach: 'Coach Alok Verma (ITF Certified)',
      image: '/images/playpeak/prog-tennis.jpg',
      icon: <GiTennisRacket className="text-[#FF6A1A] text-xl" />,
      tag: 'Championship Courts',
      overview: 'All-court tennis mastery with emphasis on modern topspin groundstrokes, explosive serve biomechanics, and tactical court geometry.',
      curriculum: [
        'Forehand & backhand topspin mechanics with video replay',
        'First and kick-second serve consistency drills',
        'Volley touch, approach shots & overhead smash precision',
        'AITA tournament preparation and match temperament'
      ]
    },
    {
      id: 'swimming',
      category: 'Aquatics',
      title: 'Swimming Program',
      subtitle: 'Endurance | Fitness | Technique',
      ageGroup: 'Ages 5 - Adult',
      schedule: 'Daily Batches (Morning & Evening)',
      coach: 'Coach Sameer Joshi (FINA Certified)',
      image: '/images/playpeak/prog-swimming.jpg',
      icon: <FaSwimmer className="text-[#FF6A1A] text-xl" />,
      tag: 'Olympic 50m Pool',
      overview: 'Temperature-controlled 50m Olympic swimming pool program catering to beginners, intermediate stroke development, and competitive racers.',
      curriculum: [
        'Water safety, breathing rhythm, and buoyant body position',
        'Mastery of 4 strokes: Freestyle, Backstroke, Breaststroke, Butterfly',
        'Flip turns, explosive diving block starts, and lap pacing',
        'State and National swimming gala competition training'
      ]
    }
  ];

  const filteredPrograms = activeFilter === 'All' 
    ? sportsPrograms 
    : sportsPrograms.filter(p => p.category === activeFilter);

  const categories = ['All', 'Field Sports', 'Bat & Ball', 'Racquet Sports', 'Court Sports', 'Aquatics'];

  return (
    <div className="bg-white min-h-screen text-slate-800">
      
      {/* Hero Header */}
      <div className="relative bg-[#0A0E17] text-white py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('/images/playpeak/hero-football.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/95 via-[#070A0F]/80 to-[#070A0F]/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A1A]">
              SPORTS & PROGRAMS
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Explore Our Sports Programs & <br />
            <span className="text-[#FF6A1A]">World-Class Facilities</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From grassroots fundamentals to competitive championship training, find the perfect sport program tailored to your ambition.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === cat
                    ? 'bg-[#FF6A1A] text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="h-56 relative overflow-hidden bg-slate-900">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-md border border-white/20">
                    {prog.tag}
                  </span>

                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs font-semibold text-[#FF6A1A] block">{prog.category}</span>
                    <h3 className="font-display font-extrabold text-2xl text-white leading-none mt-0.5">
                      {prog.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {prog.overview}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-[#FF6A1A] shrink-0" />
                      <span><strong>Eligibility:</strong> {prog.ageGroup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-[#FF6A1A] shrink-0" />
                      <span><strong>Schedule:</strong> {prog.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GiWhistle className="text-[#FF6A1A] shrink-0 text-sm" />
                      <span><strong>Head Coach:</strong> {prog.coach}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => setSelectedSport(prog)}
                  className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiInfo /> View Syllabus
                </button>
                <Link
                  to="/contact"
                  className="flex-1 py-3 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  Book Trial <FiArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Detail Modal */}
      <AnimatePresence>
        {selectedSport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedSport(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <FiX />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl shrink-0">
                  {selectedSport.icon}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-2xl text-slate-900">
                    {selectedSport.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#FF6A1A]">
                    {selectedSport.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                {selectedSport.overview}
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-2 text-xs text-slate-700 border border-slate-100">
                <p><strong>Training Batches:</strong> {selectedSport.schedule}</p>
                <p><strong>Age Category:</strong> {selectedSport.ageGroup}</p>
                <p><strong>Mentored By:</strong> {selectedSport.coach}</p>
              </div>

              <h4 className="font-display font-bold text-sm text-slate-900 mb-3">
                Core Training Modules:
              </h4>

              <div className="space-y-2.5 mb-8">
                {selectedSport.curriculum.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FiCheckCircle className="text-[#FF6A1A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  to="/contact"
                  onClick={() => setSelectedSport(null)}
                  className="flex-1 text-center py-3 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  Enroll in {selectedSport.title}
                </Link>
                <button
                  onClick={() => setSelectedSport(null)}
                  className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Services;