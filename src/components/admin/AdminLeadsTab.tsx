import React, { useState } from 'react';
import { Search, Filter, Phone, Mail, MapPin, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Lead } from '../../types';
import { updateLeadStatus, deleteLead, notifyDataUpdated } from '../../services/api';

interface AdminLeadsTabProps {
  leads: Lead[];
  setLeadsState: React.Dispatch<React.SetStateAction<Lead[]>>;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminLeadsTab: React.FC<AdminLeadsTabProps> = ({
  leads,
  setLeadsState,
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: Lead['status']) => {
    if (!window.confirm(`CONFIRMATION: Are you sure you want to update lead status to "${newStatus}"?`)) {
      return;
    }
    try {
      await updateLeadStatus(id, newStatus);
      setLeadsState((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      showToast(`Lead status updated to ${newStatus}`);
      notifyDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CONFIRMATION: Are you sure you want to permanently delete lead inquiry from "${name}"?`)) {
      return;
    }
    try {
      await deleteLead(id);
      setLeadsState((prev) => prev.filter((l) => l.id !== id));
      showToast('Lead deleted successfully');
      notifyDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete lead', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Customer Inquiry Leads ({filteredLeads.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real-time consultation requests, site survey inquiries, and phone callback submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="All">All Statuses</option>
            <option value="New">New Leads</option>
            <option value="Contacted">Contacted</option>
            <option value="Survey Scheduled">Survey Scheduled</option>
            <option value="Quoted">Quoted</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-bold font-poppins">
              <th className="p-3.5">Customer Name</th>
              <th className="p-3.5">Phone & Email</th>
              <th className="p-3.5">City / Location</th>
              <th className="p-3.5">Monthly Electric Bill</th>
              <th className="p-3.5">Submitted On</th>
              <th className="p-3.5">Lead Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">{lead.fullName}</td>
                <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                  <div className="font-bold text-slate-800">{lead.phone}</div>
                  <div className="text-slate-400">{lead.email || 'No email provided'}</div>
                </td>
                <td className="p-3.5 text-slate-700 font-medium">
                  {lead.city}, {lead.state || 'AP'}
                </td>
                <td className="p-3.5 font-bold text-amber-600">
                  {lead.monthlyBillRange || 'Not specified'}
                </td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                </td>
                <td className="p-3.5">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                      lead.status === 'New'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : lead.status === 'Contacted'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : lead.status === 'Closed Won'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Survey Scheduled">Survey Scheduled</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleDelete(lead.id, lead.fullName)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No customer inquiry leads matched your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
