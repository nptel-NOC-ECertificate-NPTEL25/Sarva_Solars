import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GalleryItem } from '../types';
import { Camera, Video, X } from 'lucide-react';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [filter, setFilter] = useState<string>('All');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Drone Views'];

  const filtered = gallery.filter((g) => filter === 'All' || g.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Visual Showcase
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-poppins">
          Solar Installation Gallery
        </h1>
        <p className="text-sm text-slate-600">
          High-resolution photographs and aerial drone views of Sarva Solar projects across Andhra Pradesh, Telangana, and West Bengal.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all ${
              filter === c
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => setActiveMedia(item)}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg cursor-pointer group hover:shadow-2xl transition-all"
          >
            <div className="h-60 overflow-hidden relative">
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-slate-950/80 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-md">
                {item.category}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h4 className="font-bold text-sm text-slate-900 font-poppins">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full text-center space-y-4">
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 font-bold"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="rounded-2xl overflow-hidden max-h-[80vh] border border-slate-800">
              <img
                src={activeMedia.mediaUrl}
                alt={activeMedia.title}
                className="w-full h-full object-contain mx-auto"
              />
            </div>
            <div className="text-white space-y-1">
              <h3 className="text-xl font-bold font-poppins">{activeMedia.title}</h3>
              <p className="text-xs text-slate-300">{activeMedia.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
