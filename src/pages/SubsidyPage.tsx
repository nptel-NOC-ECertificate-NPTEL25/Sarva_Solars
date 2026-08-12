import React from 'react';
import { SubsidyDetail } from '../types';
import { ShieldCheck, FileText, CheckCircle2, Award, Sparkles, Download, ArrowRight } from 'lucide-react';

interface SubsidyPageProps {
  subsidies: SubsidyDetail[];
  onOpenQuoteModal: () => void;
}

export const SubsidyPage: React.FC<SubsidyPageProps> = ({ subsidies, onOpenQuoteModal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Central Govt Direct Benefit Transfer
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-poppins">
          PM Surya Ghar: Muft Bijli Yojana Guide
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          The Central Government provides direct bank account subsidy up to ₹78,000 for residential rooftop solar installations. Sarva Solar handles end-to-end DISCOM approval and portal filing.
        </p>
      </div>

      {/* Subsidy Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subsidies.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
                {s.capacityRange}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-poppins">
                {s.schemeName}
              </h3>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white text-center shadow-lg space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-100">Central Direct Subsidy</span>
                <p className="text-3xl font-black font-poppins">
                  ₹{s.centralSubsidyAmount.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase text-slate-700">
                  Eligibility Criteria:
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {s.eligibility.map((e, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={onOpenQuoteModal}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl transition-transform active:scale-95 mt-4"
            >
              Apply for {s.capacityRange} System Subsidy
            </button>
          </div>
        ))}
      </div>

      {/* Process Workflow & Documents Required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step-by-Step Portal Process */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-poppins flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            5-Step Subsidy Application Process
          </h3>

          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="font-bold text-slate-900">Portal Registration</p>
                <p className="text-slate-500">Register on National Solar Portal using state DISCOM and electricity consumer account number.</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="font-bold text-slate-900">Sarva Solar Technical Survey</p>
                <p className="text-slate-500">Our structural engineers perform shadow-free rooftop assessment and upload feasibility report.</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="font-bold text-slate-900">Turnkey Installation & Testing</p>
                <p className="text-slate-500">Installation of ALMM-approved Tier-1 modules, hybrid inverter, and safety protection array.</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">4</span>
              <div>
                <p className="font-bold text-slate-900">DISCOM Net Metering</p>
                <p className="text-slate-500">DISCOM inspection and bi-directional Net Meter commissioning.</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center shrink-0">5</span>
              <div>
                <p className="font-bold text-emerald-700">Direct Subsidy Credit (DBT)</p>
                <p className="text-emerald-600">Direct bank account credit of up to ₹78,000 within 30 days of commissioning.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-poppins flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Documents Required Checklist
          </h3>

          <div className="space-y-3 text-xs">
            {[
              'Aadhaar Card copy of the electricity bill account holder',
              'Recent DISCOM Electricity Bill (within last 3 months)',
              'Rooftop ownership proof (House Tax receipt / Sale deed / Property document)',
              'Bank Account Passbook / Cancelled Cheque for Direct Benefit Transfer',
              'Passport size photograph'
            ].map((doc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium text-slate-800">{doc}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-xs text-amber-800 space-y-2">
            <p className="font-bold">Need assistance submitting documents?</p>
            <p>Our Sarva Solar documentation executive will visit your home in Andhra Pradesh, Telangana, or West Bengal to collect and upload everything for you.</p>
          </div>

          <button
            onClick={onOpenQuoteModal}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg"
          >
            Book Free Site Visit & Document Filing
          </button>
        </div>
      </div>
    </div>
  );
};
