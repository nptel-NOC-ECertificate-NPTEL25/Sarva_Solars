import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ShoppingBag, Star, ShieldCheck, Tag } from 'lucide-react';
import { Product } from '../../types';

interface AdminProductsTabProps {
  products: Product[];
  onStartCreate: () => void;
  onStartEdit: (product: Product) => void;
  onDeleteRequest: (id: string, name: string) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Solar Panels', 'Inverters', 'Batteries', 'Mounting Structures', 'Accessories'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Solar Products & Equipment Catalog ({products.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tier-1 Mono PERC/TOPCon panels, hybrid & on-grid inverters, lithium batteries, and AL-zinc structures.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-200 relative">
                <img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-amber-500/30">
                  {product.category}
                </div>
                {product.brand && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow">
                    {product.brand}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900 font-poppins line-clamp-1">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-black text-amber-600 font-poppins">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.warranty && (
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> {product.warranty} Warranty
                    </span>
                  )}
                </div>
              </div>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="bg-white p-2 rounded-xl border border-slate-200/60">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">{key}</span>
                      <span className="font-bold text-slate-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
              <span className="text-[11px] text-emerald-600 font-bold">In Stock ({product.inventory || 50})</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartEdit(product)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                  title="Edit Product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRequest(product.id, product.name)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            No products found for "{selectedCategory}". Click "Add New Product" to add items.
          </div>
        )}
      </div>
    </div>
  );
};
