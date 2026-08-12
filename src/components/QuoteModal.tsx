import React, { useState } from 'react';
import { X, Calculator, CheckCircle2, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { submitQuote, submitLead } from '../services/api';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: 'Andhra Pradesh',
    city: '',
    propertyType: 'Residential',
    monthlyBill: 4000,
    roofType: 'Terrace (Concrete)',
    connectionType: 'On-Grid',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Quick live estimates
  const bill = Number(formData.monthlyBill) || 3000;
  const estimatedKw = Math.max(1, Math.round((bill / 1200) * 10) / 10);
  const estimatedCost = Math.round(estimatedKw * 55000);
  let estimatedSubsidy = 0;
  if (estimatedKw <= 1) estimatedSubsidy = 30000;
  else if (estimatedKw <= 2) estimatedSubsidy = 60000;
  else estimatedSubsidy = 78000;

  const netCost = Math.max(0, estimatedCost - estimatedSubsidy);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMsg('Please enter your Name, Phone Number, and Email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await submitQuote({
        ...formData,
        monthlyBill: bill,
        proposedKw: estimatedKw,
        estimatedCost,
        estimatedSubsidy,
        netCost
      });

      await submitLead({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        solarFor: formData.propertyType === 'Residential' ? 'Home' : 'Business',
        monthlyBill: `₹${bill} / month`,
        roofType: formData.roofType,
        connectionType: formData.connectionType,
        financeInterest: 'Yes',
        notes: `Quote Modal: Proposed ${estimatedKw}kW plant. ${formData.message}`
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 relative">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-emerald-600 to-amber-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Instant Solar Quote Generator
          </div>
          <h3 className="text-2xl font-black font-poppins mt-1">Get Your Free Sarva Solar Proposal</h3>
          <p className="text-xs text-white/90 mt-1">
            Calculated with PM Surya Ghar Government Subsidy Assistance
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900">
              Quotation Request Received!
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. Our senior solar engineer from Sarva Solar will contact you at <span className="font-bold text-amber-600">{formData.phone}</span> within 2 hours with detailed feasibility report.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Recommended Capacity:</span>
                <span className="text-blue-600">{estimatedKw} kW System</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Turnkey Cost:</span>
                <span>₹{estimatedCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Central Govt Subsidy:</span>
                <span>- ₹{estimatedSubsidy.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-slate-200 my-1" />
              <div className="flex justify-between text-sm font-extrabold text-slate-900">
                <span>Estimated Net Investment:</span>
                <span>₹{netCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95 text-sm"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Live Estimator Summary Box */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-4 rounded-2xl border border-blue-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Rec. Size</span>
                <p className="text-base font-extrabold text-blue-600">{estimatedKw} kW</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Gross Price</span>
                <p className="text-base font-bold text-slate-700">₹{estimatedCost.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600">Govt Subsidy</span>
                <p className="text-base font-extrabold text-emerald-600">₹{estimatedSubsidy.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Net Cost</span>
                <p className="text-base font-black text-slate-900">₹{netCost.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 8985430100"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900"
                >
                  <option>Andhra Pradesh</option>
                  <option>Telangana</option>
                  <option>West Bengal</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Maharashtra</option>
                  <option>Other State</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Town
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guntur / Vijayawada / Hyderabad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Electricity Bill (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  min="500"
                  value={formData.monthlyBill}
                  onChange={(e) => setFormData({ ...formData, monthlyBill: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Property Category
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900"
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Agriculture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Connection Preference
                </label>
                <select
                  value={formData.connectionType}
                  onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-slate-900"
                >
                  <option>On-Grid (Net Metering)</option>
                  <option>Hybrid (Net Metering + Lithium Battery)</option>
                  <option>Off-Grid (Standalone Battery)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Requirement / Message
              </label>
              <textarea
                rows={2}
                placeholder="Specify rooftop dimension, shadow concerns, or preferred time for site visit..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm py-3 rounded-xl shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Generating Proposal...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit & Request Free Site Inspection</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
