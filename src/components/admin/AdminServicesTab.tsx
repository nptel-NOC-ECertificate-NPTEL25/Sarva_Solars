import React from 'react';
import { Plus, Edit2, Trash2, Wrench, CheckCircle } from 'lucide-react';
import { ServiceItem } from '../../types';

interface AdminServicesTabProps {
  services: ServiceItem[];
  onStartCreate: () => void;
  onStartEdit: (service: ServiceItem) => void;
  onDeleteRequest: (id: string, title: string) => void;
}

export const AdminServicesTab: React.FC<AdminServicesTabProps> = ({
  services,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            EPC Solar Services ({services.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage residential, commercial, industrial, PM Surya Ghar, and agricultural solar installation packages.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-40 rounded-2xl overflow-hidden bg-slate-200 relative">
                <img
                  src={service.imageUrl || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-sm text-amber-400">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900 font-poppins">
                  {service.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{service.shortDesc}</p>
              </div>

              {service.benefits && service.benefits.length > 0 && (
                <div className="space-y-1 pt-1">
                  {service.benefits.slice(0, 3).map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
              <span className="text-[11px] text-slate-400 font-mono">slug: /{service.slug}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartEdit(service)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                  title="Edit Service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRequest(service.id, service.title)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                  title="Delete Service"
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
