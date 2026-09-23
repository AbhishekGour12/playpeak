// pages/Reviews.jsx - PlayPeak Sports Academy Reviews & Testimonials
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar,
  FiCheckCircle,
  FiThumbsUp,
  FiEdit3,
  FiArrowRight,
  FiX
} from 'react-icons/fi';

const Reviews = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    role: 'Parent of U14 Football Player',
    sport: 'Football',
    rating: 5,
    title: '',
    comment: ''
  });
  const [submittedToast, setSubmittedToast] = useState(false);

  const filterCategories = [
    'All',
    'Football',
    'Cricket',
    'Badminton',
    'Basketball',
    'Tennis',
    'Swimming'
  ];

  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'Priya Sharma',
      role: 'Parent of U14 Football Player',
      sport: 'Football',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: '2 days ago',
      title: 'An amazing place for young athletes. Skills & confidence skyrocketed!',
      comment: 'My son has been training at PlayPeak for 8 months. Coach Rajesh Sharma and the structured European drill methodology transformed his ball control and game awareness. The floodlit turf is world-class.',
      helpfulCount: 42,
      isVerified: true
    },
    {
      id: 2,
      author: 'Rohan Mehta',
      role: 'Student - Cricket Program',
      sport: 'Cricket',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: '1 week ago',
      title: 'Great coaches, excellent practice nets and a motivating environment.',
      comment: 'The batting mechanics sessions with Coach Vikram Singh helped me get selected for the district U-16 team. The speed bowling radar and turf wickets are top notch.',
      helpfulCount: 58,
      isVerified: true
    },
    {
      id: 3,
      author: 'Amit Verma',
      role: 'Parent of U12 Basketball Player',
      sport: 'Basketball',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: '2 weeks ago',
      title: "PlayPeak is not just about sports, it's about building character.",
      comment: 'The coaches focus not just on shooting drills, but on discipline, teamwork, respect, and mental resilience. Best investment in my child’s health and personality.',
      helpfulCount: 35,
      isVerified: true
    },
    {
      id: 4,
      author: 'Sunita Deshmukh',
      role: 'Parent of U10 Badminton Student',
      sport: 'Badminton',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: '3 weeks ago',
      title: 'International standard synthetic courts and attentive coaching!',
      comment: 'Coach Ananya Sen pays attention to every child’s footwork and grip. The air-conditioned viewing area allows parents to comfortably observe training sessions.',
      helpfulCount: 29,
      isVerified: true
    }
  ]);

  const filteredReviews = selectedFilter === 'All'
    ? reviewsList
    : reviewsList.filter(r => r.sport === selectedFilter);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      author: newReview.author || 'Anonymous Member',
      role: newReview.role,
      sport: newReview.sport,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: newReview.rating,
      date: 'Just now',
      title: newReview.title,
      comment: newReview.comment,
      helpfulCount: 0,
      isVerified: true
    };

    setReviewsList([created, ...reviewsList]);
    setIsWriteModalOpen(false);
    setSubmittedToast(true);
    setNewReview({
      author: '',
      role: 'Parent of U14 Football Player',
      sport: 'Football',
      rating: 5,
      title: '',
      comment: ''
    });
    setTimeout(() => setSubmittedToast(false), 5000);
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
              TESTIMONIALS & RATINGS
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            What Parents & <span className="text-[#FF6A1A]">Students Say</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Genuine stories of growth, skill advancement, and character development from the PlayPeak community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Success Toast */}
        <AnimatePresence>
          {submittedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF6A1A] flex items-center justify-between text-xs sm:text-sm font-semibold shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <FiCheckCircle className="text-lg shrink-0" />
                <span>Thank you! Your verified review has been published.</span>
              </div>
              <button onClick={() => setSubmittedToast(false)} className="text-slate-400 hover:text-slate-700">
                <FiX />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rating Stats Banner */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div>
              <span className="font-display font-black text-5xl sm:text-6xl text-slate-900">4.9</span>
              <div className="flex text-amber-400 text-lg justify-center md:justify-start mt-1">
                ★★★★★
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">Based on 500+ Verified Reviews</p>
            </div>

            <div className="hidden sm:block h-16 w-[1px] bg-slate-200" />

            <div className="space-y-1.5 text-xs text-slate-600">
              <p><strong className="text-[#FF6A1A]">99%</strong> Parents notice enhanced fitness & discipline</p>
              <p><strong className="text-slate-900">96%</strong> Would recommend PlayPeak to friends & schoolmates</p>
              <p><strong className="text-emerald-600">100%</strong> Certified national coaches on every court</p>
            </div>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-6 py-3.5 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-xs sm:text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2 shrink-0"
          >
            <FiEdit3 className="text-base" /> Write Review
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {filterCategories.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === filter
                  ? 'bg-[#FF6A1A] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base text-slate-900">{rev.author}</h3>
                        {rev.isVerified && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6A1A] font-bold">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{rev.role}</p>
                    </div>
                  </div>

                  <div className="text-amber-400 text-sm">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>

                <h4 className="font-display font-bold text-base text-slate-900 mt-2">
                  "{rev.title}"
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[#FF6A1A] font-semibold">{rev.sport} Program</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-100"
            >
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <FiX className="text-base" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">
                  STUDENT & PARENT FEEDBACK
                </span>
                <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                  Share Your Experience
                </h3>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Sport Program</label>
                    <select
                      value={newReview.sport}
                      onChange={(e) => setNewReview({ ...newReview, sport: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                    >
                      <option value="Football">Football</option>
                      <option value="Cricket">Cricket</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Swimming">Swimming</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                    >
                      <option value="5">★★★★★ (5/5)</option>
                      <option value="4">★★★★☆ (4/5)</option>
                      <option value="3">★★★☆☆ (3/5)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Outstanding coaching and excellent facilities!"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Detailed Review</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the coaches, drills, and student progress..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                  ></textarea>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-md transition-all"
                  >
                    Publish Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Reviews;
