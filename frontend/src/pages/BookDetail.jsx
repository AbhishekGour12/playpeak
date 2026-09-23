// pages/BookDetail.jsx - PlayPeak Sports Facility & Program Deep Dive
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  FiCalendar,
  FiStar,
  FiArrowLeft,
  FiCheckCircle,
  FiZap,
  FiShield,
  FiClock,
  FiUser,
  FiAward,
  FiActivity,
  FiMapPin,
  FiPhone,
  FiCheck
} from 'react-icons/fi';
import { FaFutbol, FaGamepad, FaBasketballBall, FaDumbbell, FaSwimmer } from 'react-icons/fa';
import { GiCricketBat, GiShuttlecock, GiPunchingBag, GiTennisRacket, GiWhistle } from 'react-icons/gi';

const BookDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('curriculum');
  const [enrolled, setEnrolled] = useState(false);

  // Sports Programs & Facilities Database
  const programsDb = {
    "1": {
      title: "FIFA-Standard Pro Turf Football Arena & Elite Coaching",
      coach: "Coach Marcus Vance (UEFA Pro License)",
      category: "Football / Soccer",
      duration: "8 Weeks Cohort (3 Sessions / Week)",
      level: "Advanced / Semi-Pro",
      availableSlots: 4,
      totalSlots: 16,
      rating: 4.9,
      hourlyRate: "₹1,200 / hr",
      image: "/images/sports-football-turf.jpg",
      description: "A comprehensive high-intensity football curriculum and arena rental setup designed for ambitious players and teams. Learn the art of breaking low-blocks, half-space penetration, timing explosive runs, and clinical one-touch finishing inside the box on our FIFA-certified 50mm monofilament turf.",
      methodology: "Key Facility & Training Highlights:\n• 105m x 68m full FIFA-certified turf with 500 Lux anti-glare broadcast floodlights.\n• Master clinical one-touch finishing under live defense pressure and speed gate timing.\n• High-definition cameras for weekly tactical video breakdowns and scout showcases.",
      modules: [
        "First-Touch Control & Body Orientation in Tight Spaces (Week 1-2)",
        "Counter-Pressing Triggers & Spatial Exploitation (Week 3-4)",
        "Set-Piece Specialization: Free Kicks, Penalties & Tactical Sets (Week 5)",
        "Match Simulation & Scout Showcase Tournament (Week 6-8)"
      ],
      gearRequired: [
        "Molded synthetic turf football boots (AG/FG studs)",
        "PlayPeak Official Training Jersey & Bibs (Provided on enrollment)",
        "Ankle compression sleeves & shin guards",
        "Personal GPS tracker vest (Provided for biometric speed tracking)"
      ]
    },
    "2": {
      title: "Ranji-Spec Pro Cricket Nets & Automated Bowling Lab",
      coach: "Coach Vikram Singh (BCCI Certified)",
      category: "Cricket",
      duration: "6 Weeks (4 Sessions / Week)",
      level: "Intermediate - Pro",
      availableSlots: 6,
      totalSlots: 20,
      rating: 4.9,
      hourlyRate: "₹900 / hr",
      image: "/images/playpeak/prog-cricket.jpg",
      description: "Premier cricket training facility equipped with programmable bowling machines (up to 155 km/h spin & swing) and high-speed slow-motion video analysis to hone your stance, trigger movement, and power hitting.",
      methodology: "Key Training Takeaways:\n• 4 natural red clay match pitches and 2 heavy-duty AstroTurf all-weather nets.\n• Merlin & Bola automated bowling machines with customizable swing and pace.\n• Speed radar guns tracking bowler release speeds and bowling biomechanics.",
      modules: [
        "Batting Stance, Backlift & Front-Foot Drive Precision (Week 1)",
        "Short-Pitch Defense & Pull/Hook Execution (Week 2-3)",
        "Spin Bowling Variation: Wrong-uns, Drifting & Dip (Week 4-5)",
        "Match Scenarios & BCCI Trial Preparation (Week 6)"
      ],
      gearRequired: [
        "Personal cricket bat & spikes for turf nets",
        "Full protective kit (Helmets, pads, gloves, chest guard)",
        "PlayPeak white cricket training jersey",
        "Hydration pack and sweatbands"
      ]
    },
    "3": {
      title: "FIBA-Certified Hardwood Basketball Arena & Guard Masterclass",
      coach: "Coach David Miller (FIBA Level-2)",
      category: "Basketball",
      duration: "10 Weeks (3 Sessions / Week)",
      level: "All Skill Levels",
      availableSlots: 5,
      totalSlots: 15,
      rating: 4.8,
      hourlyRate: "₹1,100 / hr",
      image: "/images/sports-basketball-court.jpg",
      description: "Train on shock-absorbing North American maple wood sprung floors. Develop the complete basketball toolkit from hesitation crossover dribbles against full-court presses to NBA-distance pull-up jumpers and perimeter defense.",
      methodology: "Key Basketball Drills:\n• Two-ball coordination & tennis ball distraction handling drills.\n• Automated Noah shooting analytics tracking shot arc angle and entry depth.\n• High-tempo 3-on-3 transition and pick-and-roll reads.",
      modules: [
        "Handle & Deceleration: Shifty Changes of Pace (Week 1-3)",
        "Shooting Pocket Mechanics & Catch-and-Shoot Rhythm (Week 4-6)",
        "Pick & Roll Mastery: Pocket Passes, Floaters & Lob Reads (Week 7-8)",
        "Full-Court 5-on-5 Competitive League Play (Week 9-10)"
      ],
      gearRequired: [
        "Indoor basketball high-top shoes with non-marking gum soles",
        "PlayPeak Reversible Basketball Training Uniform",
        "Athletic knee sleeves & mouthguard"
      ]
    }
  };

  const program = programsDb[id] || programsDb["1"];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/facilities"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#FF6A1A] transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <FiArrowLeft /> Back to Facilities & Arenas
          </Link>
        </div>

        {/* Main Showcase Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-16">
          
          {/* Left Column: Image & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative bg-slate-900 h-80">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900/90 text-[#FF6A1A] border border-[#FF6A1A]/30 backdrop-blur-md">
                  {program.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="flex items-center gap-1 font-semibold">
                  <FiMapPin className="text-[#FF6A1A]" /> PlayPeak Arena Campus
                </span>
                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full font-bold text-[11px]">
                  {program.hourlyRate}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                Facility & Cohort Highlights
              </h3>
              
              <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Duration / Schedule:</span>
                  <strong className="text-slate-800">{program.duration}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Skill Level:</span>
                  <strong className="text-slate-800">{program.level}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Batch Availability:</span>
                  <strong className="text-[#FF6A1A] font-bold">{program.availableSlots} of {program.totalSlots} Slots Open</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rating:</span>
                  <strong className="text-amber-500 flex items-center gap-1">
                    <FiStar className="fill-amber-400" /> {program.rating} / 5.0
                  </strong>
                </div>
              </div>

              <button
                onClick={() => setEnrolled(!enrolled)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  enrolled
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-[#FF6A1A] hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 active:scale-98'
                }`}
              >
                {enrolled ? (
                  <>
                    <FiCheck className="text-base" /> Batch Spot Reserved
                  </>
                ) : (
                  <>
                    <span>Reserve Training Spot</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Free trial sessions and court orientation available for new athletes.
              </p>
            </div>
          </div>

          {/* Right Column: Syllabus & Methodology */}
          <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">
                {program.category} • Lead Coach: {program.coach}
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                {program.title}
              </h1>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {program.description}
            </p>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 gap-6 text-xs sm:text-sm font-bold pt-2">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'curriculum' ? 'text-[#FF6A1A] font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Training Curriculum
                {activeTab === 'curriculum' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A1A] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('methodology')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'methodology' ? 'text-[#FF6A1A] font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Arena Specs & Technology
                {activeTab === 'methodology' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A1A] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('gear')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'gear' ? 'text-[#FF6A1A] font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Gear & Footwear Rules
                {activeTab === 'gear' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A1A] rounded-full" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'curriculum' && (
                <div className="space-y-3">
                  {program.modules.map((mod, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FF6A1A]/10 text-[#FF6A1A] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700">{mod}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'methodology' && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <pre className="text-xs sm:text-sm text-slate-700 font-sans whitespace-pre-line leading-relaxed">
                    {program.methodology}
                  </pre>
                </div>
              )}

              {activeTab === 'gear' && (
                <div className="space-y-3">
                  {program.gearRequired.map((gear, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                      <FiCheckCircle className="text-emerald-500 shrink-0 text-base" />
                      <span>{gear}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BookDetail;