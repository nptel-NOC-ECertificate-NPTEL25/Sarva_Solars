import React from 'react';
import { Plus, Edit2, Trash2, Star, Quote, MapPin } from 'lucide-react';
import { Testimonial } from '../../types';

interface AdminTestimonialsTabProps {
  testimonials: Testimonial[];
  onStartCreate: () => void;
  onStartEdit: (testimonial: Testimonial) => void;
  onDeleteRequest: (id: string, name: string) => void;
}

export const AdminTestimonialsTab: React.FC<AdminTestimonialsTabProps> = ({
  testimonials,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Customer Reviews & Ratings ({testimonials.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Verified feedback and annual savings testimonials from solar rooftop owners.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={item.customerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-base text-slate-900 font-poppins">
                    {item.customerName}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500 shrink-0" /> {item.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs text-slate-600 italic relative pl-3 border-l-2 border-amber-400">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
              <span className="text-[11px] text-emerald-600 font-bold">{item.savedPerYear || '₹45,000/yr saved'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartEdit(item)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                  title="Edit Review"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRequest(item.id, item.customerName)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
