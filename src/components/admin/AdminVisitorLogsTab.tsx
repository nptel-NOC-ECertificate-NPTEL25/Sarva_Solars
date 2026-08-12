import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, Globe, Clock, ShieldCheck } from 'lucide-react';
import { fetchVisitorLogs } from '../../services/api';

interface VisitorLog {
  id: string;
  ip: string;
  path: string;
  userAgent: string;
  timestamp: string;
  city?: string;
  country?: string;
}

interface AdminVisitorLogsTabProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminVisitorLogsTab: React.FC<AdminVisitorLogsTabProps> = ({ showToast }) => {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchVisitorLogs();
      setLogs(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load visitor logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-poppins flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-500" />
            Live Website Visitor Traffic Logs ({logs.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics tracking page views, referrer links, user-agents, and visitor IP addresses.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Traffic Logs</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-bold font-poppins">
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Page Path</th>
              <th className="p-3.5">IP Address</th>
              <th className="p-3.5">Location / City</th>
              <th className="p-3.5">Browser & Device User-Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </td>
                <td className="p-3.5 font-bold text-amber-600 font-mono">
                  {log.path}
                </td>
                <td className="p-3.5 font-mono text-slate-800 font-semibold">
                  {log.ip}
                </td>
                <td className="p-3.5 text-slate-700 font-medium">
                  {log.city || 'Andhra Pradesh'}, {log.country || 'India'}
                </td>
                <td className="p-3.5 text-slate-400 font-mono text-[10px] truncate max-w-xs">
                  {log.userAgent}
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No visitor logs recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
