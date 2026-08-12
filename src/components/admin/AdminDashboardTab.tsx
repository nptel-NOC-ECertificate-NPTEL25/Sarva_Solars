import React from 'react';
import {
  FileText,
  Users,
  ShoppingBag,
  Building2,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Lead, QuoteRequest, Product, Project, BlogArticle } from '../../types';

interface AdminDashboardTabProps {
  analytics: any;
  leads: Lead[];
  quotes: QuoteRequest[];
  products: Product[];
  projects: Project[];
  blogs: BlogArticle[];
  onNavigateTab: (tab: any) => void;
  onStartCreate: (tab: any) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  analytics,
  leads,
  quotes,
  products,
  projects,
  blogs,
  onNavigateTab,
  onStartCreate
}) => {
  const chartData = [
    { name: 'Jan', leads: 12, quotes: 8 },
    { name: 'Feb', leads: 19, quotes: 14 },
    { name: 'Mar', leads: 25, quotes: 18 },
    { name: 'Apr', leads: 32, quotes: 22 },
    { name: 'May', leads: 28, quotes: 20 },
    { name: 'Jun', leads: 45, quotes: 30 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sarva Solar System Performance</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-poppins text-white">
            Live Administrative Hub
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor real-time customer leads, solar rooftop quote requests, site product listings, and PM Surya Ghar government subsidy inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigateTab('leads')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-lg flex items-center gap-2"
          >
            <span>View All Leads ({leads.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStartCreate('products')}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-2xl border border-white/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigateTab('leads')}
          className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-200 cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Lead Inquiries
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-poppins">
              {leads.length}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Customer quote & consultation requests</p>
        </div>

        <div
          onClick={() => onNavigateTab('quotes')}
          className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-200 cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Instant Quotes
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-poppins">
              {quotes.length}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +24%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Calculated bill & rooftop submissions</p>
        </div>

        <div
          onClick={() => onNavigateTab('products')}
          className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-200 cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Products
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-poppins">
              {products.length}
            </span>
            <span className="text-xs font-bold text-slate-400">Tier-1 Equipment</span>
          </div>
          <p className="text-[11px] text-slate-400">Solar panels, inverters & battery models</p>
        </div>

        <div
          onClick={() => onNavigateTab('projects')}
          className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-200 cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showcase Projects
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-poppins">
              {projects.length}
            </span>
            <span className="text-xs font-bold text-purple-600">AP, TS & WB</span>
          </div>
          <p className="text-[11px] text-slate-400">Completed rooftop solar installations</p>
        </div>
      </div>

      {/* Chart & Recent Leads Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Trends Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-poppins">
                Monthly Customer Growth Trends
              </h4>
              <p className="text-xs text-slate-500">
                Comparison of lead inquiries vs quote calculations over time
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Leads
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Quotes
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="leads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="quotes" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 font-poppins">
                Recent Lead Inquiries
              </h4>
              <button
                onClick={() => onNavigateTab('leads')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{lead.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{lead.city}, {lead.state}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      lead.status === 'New'
                        ? 'bg-blue-100 text-blue-800'
                        : lead.status === 'Contacted'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
              {leads.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">
                  No lead inquiries recorded yet.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>System Status: <strong className="text-emerald-600 font-bold">100% Operational</strong></span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
