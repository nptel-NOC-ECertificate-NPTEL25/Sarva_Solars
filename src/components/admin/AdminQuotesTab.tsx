import React, { useState } from 'react';
import { Search, Trash2, Zap, DollarSign, Calendar } from 'lucide-react';
import { QuoteRequest } from '../../types';
import { updateQuoteStatus, deleteQuoteRequest, notifyDataUpdated } from '../../services/api';

interface AdminQuotesTabProps {
  quotes: QuoteRequest[];
  setQuotesState: React.Dispatch<React.SetStateAction<QuoteRequest[]>>;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminQuotesTab: React.FC<AdminQuotesTabProps> = ({
  quotes,
  setQuotesState,
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredQuotes = quotes.filter((q) =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.phone.includes(searchTerm) ||
    q.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (id: string, newStatus: QuoteRequest['status']) => {
    if (!window.confirm(`CONFIRMATION: Are you sure you want to update quote request status to "${newStatus}"?`)) {
      return;
    }
    try {
      await updateQuoteStatus(id, newStatus);
      setQuotesState((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
      showToast(`Quote status updated to ${newStatus}`);
      notifyDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`CONFIRMATION: Are you sure you want to permanently delete quote request from "${name}"?`)) {
      return;
    }
    try {
      await deleteQuoteRequest(id);
      setQuotesState((prev) => prev.filter((q) => q.id !== id));
      showToast('Quote request deleted successfully');
      notifyDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete quote', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins">
            Instant Quote Submissions ({filteredQuotes.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Calculated solar system sizes, rooftop capacity, estimated costs, and government subsidy calculations.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-bold font-poppins">
              <th className="p-3.5">Customer Name</th>
              <th className="p-3.5">Phone & City</th>
              <th className="p-3.5">System Size</th>
              <th className="p-3.5">Net Cost after Subsidy</th>
              <th className="p-3.5">Rooftop Structure</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredQuotes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">{q.name}</td>
                <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                  <div className="font-bold text-slate-800">{q.phone}</div>
                  <div className="text-slate-400">{q.city}</div>
                </td>
                <td className="p-3.5 font-bold text-amber-600">
                  {q.proposedKw || 3} kWp System
                </td>
                <td className="p-3.5 font-black text-emerald-600">
                  ₹{(q.netCost || q.estimatedCost || 120000).toLocaleString('en-IN')}
                </td>
                <td className="p-3.5 text-slate-700 font-medium">
                  {q.roofType || 'RCC Flat Roof'}
                </td>
                <td className="p-3.5">
                  <select
                    value={q.status}
                    onChange={(e) => handleStatusChange(q.id, e.target.value as any)}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold border bg-slate-50 text-slate-800 border-slate-200"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Archived">Archived</option>
                  </select>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleDelete(q.id, q.name)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                    title="Delete Quote"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredQuotes.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No instant quote submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
