import React from 'react';
import { Plus, Edit2, Trash2, Building2, MapPin, Zap, TrendingUp } from 'lucide-react';
import { Project } from '../../types';

interface AdminProjectsTabProps {
  projects: Project[];
  onStartCreate: () => void;
  onStartEdit: (project: Project) => void;
  onDeleteRequest: (id: string, title: string) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({
  projects,
  onStartCreate,
  onStartEdit,
  onDeleteRequest
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Portfolio Showcase Projects ({projects.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Completed rooftop solar power installations across Andhra Pradesh, Telangana & West Bengal.
          </p>
        </div>

        <button
          onClick={onStartCreate}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-200 relative">
                <img
                  src={project.images?.[0] || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-amber-500/30">
                  {project.category}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow">
                  {project.capacityKw} kWp System
                </div>
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900 font-poppins line-clamp-1">
                  {project.title}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{project.location}, {project.state || 'Andhra Pradesh'}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Annual Savings</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> ₹{project.annualSavingsRs.toLocaleString('en-IN')}/yr
                  </span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Commissioned</span>
                  <span className="font-bold text-slate-800">{project.completionDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
              <span className="text-[11px] text-blue-600 font-bold">{project.status}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartEdit(project)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                  title="Edit Project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRequest(project.id, project.title)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                  title="Delete Project"
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
