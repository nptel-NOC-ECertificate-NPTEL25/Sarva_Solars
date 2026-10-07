import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchEmailNotifications } from '../../services/api';
import { EmailNotification } from '../../types';

interface AdminEmailNotificationsTabProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminEmailNotificationsTab: React.FC<AdminEmailNotificationsTabProps> = ({ showToast }) => {
  const [logs, setLogs] = useState<EmailNotification[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchEmailNotifications();
      setLogs(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch email logs', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-500" />
            Nodemailer Email Dispatch Logs & Test Alert
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Track automated lead notifications and quote submission alert emails sent to administration.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          title="Refresh Email Logs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Email Dispatch History Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-bold font-poppins">
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Recipient</th>
              <th className="p-3.5">Subject Headline</th>
              <th className="p-3.5">Delivery Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                  {log.sentAt ? new Date(log.sentAt).toLocaleString('en-IN') : 'Recent'}
                </td>
                <td className="p-3.5 font-bold text-slate-900 font-mono">{log.to || log.customerEmail}</td>
                <td className="p-3.5 font-medium text-slate-800">{log.subject}</td>
                <td className="p-3.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'Sent' || log.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {log.status === 'Sent' || log.status === 'Delivered' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-red-600" />
                    )}
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No email dispatch logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
