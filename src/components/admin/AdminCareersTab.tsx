import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Briefcase, MapPin, Clock, Users, FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import { JobOpening, JobApplication } from '../../types';
import { fetchJobApplications, updateJobApplicationStatus, notifyDataUpdated } from '../../services/api';

interface AdminCareersTabProps {
  careers: JobOpening[];
  onStartCreate: () => void;
  onStartEdit: (career: JobOpening) => void;
  onDeleteRequest: (id: string, title: string) => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminCareersTab: React.FC<AdminCareersTabProps> = ({
  careers,
  onStartCreate,
  onStartEdit,
  onDeleteRequest,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'openings' | 'applications'>('openings');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState<boolean>(false);

  useEffect(() => {
    if (activeSubTab === 'applications') {
      loadApps();
    }
  }, [activeSubTab]);

  const loadApps = async () => {
    setLoadingApps(true);
    try {
      const data = await fetchJobApplications();
      setApplications(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load applications', 'error');
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: JobApplication['status']) => {
    if (!window.confirm(`CONFIRMATION: Are you sure you want to change candidate application status to "${newStatus}"?`)) {
      return;
    }
    try {
      await updateJobApplicationStatus(id, newStatus);
      showToast(`Application status updated to ${newStatus}`);
      notifyDataUpdated();
      loadApps();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Careers & Job Openings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage site job listings, EPC engineer recruitment, and candidate resume submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveSubTab('openings')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'openings'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Job Openings ({careers.length})
            </button>
            <button
              onClick={() => setActiveSubTab('applications')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'applications'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resumes Received ({applications.length})
            </button>
          </div>

          {activeSubTab === 'openings' && (
            <button
              onClick={onStartCreate}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post Job Opening</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab 1: Openings List */}
      {activeSubTab === 'openings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-[10px] border border-blue-200">
                    {job.department || 'Engineering'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      job.isActive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {job.isActive ? 'Active Opening' : 'Closed'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 font-poppins">
                    {job.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{job.location}</span> • <span>{job.type}</span>
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200/60 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 text-[11px] block">
                    Exp: {job.exp}
                  </span>
                  <p className="line-clamp-3 text-[11px]">{job.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                <span className="text-[11px] text-slate-400 font-mono">ID: {job.id.slice(0, 8)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartEdit(job)}
                    className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                    title="Edit Opening"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteRequest(job.id, job.title)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                    title="Delete Opening"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {careers.length === 0 && (
            <div className="col-span-full p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              No active job openings posted. Click "Post Job Opening" to create one.
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Job Applicants Table */}
      {activeSubTab === 'applications' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-bold font-poppins">
                <th className="p-3.5">Candidate Name</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Applied Position</th>
                <th className="p-3.5">Experience</th>
                <th className="p-3.5">Resume Link</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{app.fullName}</td>
                  <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                    <div>{app.phone}</div>
                    <div className="text-slate-400">{app.email}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-800">{app.jobTitle}</td>
                  <td className="p-3.5 text-slate-600">{app.experience}</td>
                  <td className="p-3.5">
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Resume
                      </a>
                    ) : (
                      <span className="text-slate-400">No link</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'Shortlisted'
                          ? 'bg-amber-100 text-amber-800'
                          : app.status === 'Hired'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-800"
                    >
                      <option value="New">New</option>
                      <option value="Shortlisted">Shortlist</option>
                      <option value="Hired">Hire Candidate</option>
                      <option value="Rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && !loadingApps && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No candidate applications submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
