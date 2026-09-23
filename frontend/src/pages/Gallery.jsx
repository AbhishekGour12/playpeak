// pages/Gallery.jsx - PlayPeak Sports Academy Moments That Inspire
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMaximize2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight
} from 'react-icons/fi';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = [
    'All',
    'Football',
    'Cricket',
    'Badminton',
    'Basketball',
    'Tennis',
    'Swimming',
    'Academy Life'
  ];

  const galleryItems = [
    {
      id: 1,
      title: 'Youth Football Agility Cones Drill',
      category: 'Football',
      subtitle: 'Junior squad executing sprint and ball control drills on green turf',
      image: '/images/playpeak/gallery-football.jpg',
      badge: 'Turf Pitch #1'
    },
    {
      id: 2,
      title: 'Cricket Batting Practice in Nets',
      category: 'Cricket',
      subtitle: 'Batsman mastering drive technique in dedicated practice nets',
      image: '/images/playpeak/gallery-cricket.jpg',
      badge: 'Cricket Net #2'
    },
    {
      id: 3,
      title: 'Championship Swimming Laps',
      category: 'Swimming',
      subtitle: 'Competitive racer executing breaststroke in Olympic 50m pool',
      image: '/images/playpeak/gallery-swimming.jpg',
      badge: 'Aquatic Center'
    },
    {
      id: 4,
      title: 'Sunset Outdoor Basketball Session',
      category: 'Basketball',
      subtitle: 'High-energy streetball scrimmage under the golden hour sky',
      image: '/images/playpeak/gallery-basketball.jpg',
      badge: 'Hardwood Court'
    },
    {
      id: 5,
      title: 'Head Coach Mentoring Youth Squad',
      category: 'Academy Life',
      subtitle: 'National coach instilling team spirit, tactical discipline and camaraderie',
      image: '/images/playpeak/coach-guiding-kids.jpg',
      badge: 'Team Huddle'
    },
    {
      id: 6,
      title: 'Tennis Serve & Volley Dynamics',
      category: 'Tennis',
      subtitle: 'Junior champion executing topspin serve on tournament blue court',
      image: '/images/playpeak/prog-tennis.jpg',
      badge: 'Center Court'
    },
    {
      id: 7,
      title: 'Badminton Jump Smash Drill',
      category: 'Badminton',
      subtitle: 'Speed and aerial agility on indoor synthetic green court',
      image: '/images/playpeak/prog-badminton.jpg',
      badge: 'Indoor Arena'
    },
    {
      id: 8,
      title: 'Floodlit Evening Football Mastery',
      category: 'Football',
      subtitle: 'Dynamic dribbling under stadium floodlights during night session',
      image: '/images/playpeak/hero-football.jpg',
      badge: 'Night Training'
    }
  ];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
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
              MOMENTS THAT INSPIRE
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            PlayPeak Academy <span className="text-[#FF6A1A]">Photo Gallery</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            A glimpse into our intensive training sessions, tournaments, facilities, and inspiring student athlete victories.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Filter Category Pills */}
        <div className="flex gap-2 justify-start sm:justify-center overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FF6A1A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              onClick={() => openLightbox(idx)}
            >
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                <span className="absolute top-3.5 left-3.5 text-[10px] font-bold px-3 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-md">
                  {item.badge}
                </span>

                <div className="absolute bottom-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <FiMaximize2 className="text-xs" />
                </div>
              </div>

              <div className="p-5 space-y-1">
                <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">
                  {item.category}
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 leading-snug group-hover:text-[#FF6A1A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors z-50"
            >
              <FiX className="text-xl" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors z-50"
            >
              <FiChevronLeft className="text-2xl" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors z-50"
            >
              <FiChevronRight className="text-2xl" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full rounded-3xl overflow-hidden bg-white shadow-2xl"
            >
              <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={filteredItems[lightboxIndex].image}
                  alt={filteredItems[lightboxIndex].title}
                  className="w-full h-full max-h-[65vh] object-cover"
                />
              </div>

              <div className="p-6 bg-white flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">
                    {filteredItems[lightboxIndex].badge} • {filteredItems[lightboxIndex].category}
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 mt-0.5">
                    {filteredItems[lightboxIndex].title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {filteredItems[lightboxIndex].subtitle}
                  </p>
                </div>

                <Link
                  to="/contact"
                  onClick={closeLightbox}
                  className="px-6 py-2.5 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-md shrink-0 transition-all"
                >
                  Book Trial
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
