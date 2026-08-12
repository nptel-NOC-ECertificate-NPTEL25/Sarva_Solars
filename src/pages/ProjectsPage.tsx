import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { MapPin, Zap, TrendingUp, CheckCircle2, Search } from 'lucide-react';

interface ProjectsPageProps {
  projects: Project[];
  onOpenQuoteModal: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onOpenQuoteModal }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      filterCategory === 'All' ||
      p.category === filterCategory ||
      p.status === filterCategory;

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Portfolio & Execution
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-poppins">
          Completed & Ongoing Solar Projects
        </h1>
        <p className="text-sm text-slate-600">
          Explore our real turnkey rooftop solar installations across Andhra Pradesh, Telangana, and West Bengal.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex flex-wrap gap-2">
          {['All', 'Residential', 'Commercial', 'Industrial', 'Completed', 'Ongoing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search location or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 pr-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl space-y-4 hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src={p.images[0]}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-slate-950/80 text-amber-400 text-xs font-black px-3 py-1 rounded-full backdrop-blur-md">
                  {p.capacityKw} kWp
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full text-white ${
                    p.status === 'Completed' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-poppins">
                  {p.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{p.location}, {p.state}</span>
                  <span>•</span>
                  <span>Completed {p.completionDate}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {p.description}
              </p>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Annual Electricity Savings:</span>
                <span className="font-extrabold text-emerald-600 font-mono">
                  ₹{p.annualSavingsRs.toLocaleString('en-IN')} / year
                </span>
              </div>

              {p.clientReview && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 italic text-slate-700">
                  <p>"{p.clientReview.comment}"</p>
                  <p className="font-bold not-italic text-amber-600">
                    — {p.clientReview.author}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
          <p className="text-slate-500 text-sm">No projects found matching the criteria.</p>
          <button
            onClick={() => {
              setFilterCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-blue-600 underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
