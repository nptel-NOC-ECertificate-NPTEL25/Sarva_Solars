import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { sendTestEmailAlert, fetchEmailLogs } from '../../services/api';

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  status: 'Sent' | 'Failed';
  timestamp: string;
  error?: string;
}

interface AdminEmailNotificationsTabProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminEmailNotificationsTab: React.FC<AdminEmailNotificationsTabProps> = ({ showToast }) => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [testEmail, setTestEmail] = useState<string>('sarvasolar.group@gmail.com');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchEmailLogs();
      setLogs(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch email logs', 'error');
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`CONFIRMATION: Are you sure you want to send a test email notification to "${testEmail}"?`)) {
      return;
    }
    setSending(true);
    try {
      await sendTestEmailAlert(testEmail);
      showToast(`Test email notification dispatched successfully to ${testEmail}!`);
      loadLogs();
    } catch (err: any) {
      showToast(err.message || 'Failed to dispatch test email', 'error');
    } finally {
      setSending(false);
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

      {/* Test Email Dispatch Form */}
      <form onSubmit={handleSendTest} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <h4 className="font-bold text-sm text-slate-900 font-poppins">
          Dispatch Instant Test Admin Alert Email
        </h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Recipient email address..."
            className="flex-1 bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-mono text-slate-900"
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sending ? 'Sending Alert...' : 'Send Test Alert'}</span>
          </button>
        </div>
      </form>

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
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </td>
                <td className="p-3.5 font-bold text-slate-900 font-mono">{log.recipient}</td>
                <td className="p-3.5 font-medium text-slate-800">{log.subject}</td>
                <td className="p-3.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'Sent'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {log.status === 'Sent' ? (
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
