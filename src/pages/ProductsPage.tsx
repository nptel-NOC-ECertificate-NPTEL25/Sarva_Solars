import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Search, ShoppingBag, ShieldCheck, Sparkles, X, Check } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  onOpenQuoteModal: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products, onOpenQuoteModal }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['All', 'Solar Panels', 'Inverters', 'Batteries', 'Mounting Structures'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          ALMM & Tier-1 Approved Equipment
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-poppins">
          Solar Products Catalog
        </h1>
        <p className="text-sm text-slate-600">
          Explore high-efficiency bifacial panels, hybrid smart inverters, lithium LFP batteries, and cyclone-proof mounting hardware.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all ${
                categoryFilter === cat
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
            placeholder="Search panels, inverters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 pr-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl space-y-4 hover:shadow-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="h-56 overflow-hidden relative group">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {p.isFeatured && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
                <span className="absolute bottom-4 right-4 bg-slate-950/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  {p.category}
                </span>
              </div>

              <div className="px-6 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  {p.brand}
                </p>
                <h3 className="text-base font-bold text-slate-900 font-poppins leading-snug">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {p.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Unit Price (ex. GST)</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProduct(p)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View Specifications →
                </button>
              </div>

              <button
                onClick={onOpenQuoteModal}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md transition-transform active:scale-98"
              >
                Inquire for Turnkey Project
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Specifications Popup Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <span className="text-[10px] text-amber-500 font-bold uppercase">{selectedProduct.brand}</span>
                <h3 className="text-lg font-bold text-slate-900 font-poppins">{selectedProduct.name}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              {selectedProduct.description}
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">
                Technical Specifications
              </h4>
              <div className="space-y-1.5 font-mono">
                {Object.entries(selectedProduct.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-sans">{k}:</span>
                    <span className="font-bold text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Warranty: {selectedProduct.warranty}</span>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(null);
                onOpenQuoteModal();
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg"
            >
              Request Detailed Proposal for this Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
