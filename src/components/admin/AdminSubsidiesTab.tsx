import React from 'react';
import { Plus, Edit2, Trash2, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SubsidyScheme } from '../../types';

interface AdminSubsidiesTabProps {
  subsidies: SubsidyScheme[];
  onStartCreate: () => void;
  onStartEdit: (subsidy: SubsidyScheme) => void;
  onDeleteRequest: (id: string, name: string) => void;
}

export const AdminSubsidiesTab: React.FC<AdminSubsidiesTabProps> = ({
  subsidies,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            PM Surya Ghar Subsidy Tier Schemes ({subsidies.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Government subsidy slabs up to ₹78,000 for residential rooftop solar power systems.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subsidy Tier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subsidies.map((sub) => (
          <div
            key={sub.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs border border-amber-200">
                  {sub.capacityRange}
                </span>
                <span className="text-xl font-black text-emerald-600 font-poppins">
                  ₹{sub.centralSubsidyAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900 font-poppins">
                  {sub.schemeName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Central MNRE Subsidy Grant</p>
              </div>

              {sub.eligibility && sub.eligibility.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligibility Criteria</span>
                  {sub.eligibility.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
              <span className="text-[11px] text-slate-500 font-bold">Direct DBT Bank Credit</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartEdit(sub)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                  title="Edit Subsidy"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRequest(sub.id, sub.schemeName)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                  title="Delete Subsidy"
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
